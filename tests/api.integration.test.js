import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { setTimeout as delay } from "node:timers/promises";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
const basePath = "/appointment-app";
const integrationPassword = "Valid-Password-481!";

function startNode(args, env) {
  return spawn(process.execPath, args, { cwd: process.cwd(), env, stdio: ["ignore", "pipe", "pipe"] });
}

async function waitForServer(url, child) {
  let lastError;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Next server exited early (${child.exitCode}).`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (error) { lastError = error; }
    await delay(250);
  }
  throw new Error(`Next server did not become ready: ${lastError ?? "timeout"}`);
}

test("authentication, authorization, booking conflicts, and patient isolation", { timeout: 120_000 }, async (t) => {
  const dbFile = `tests/integration-${randomUUID()}.db`;
  const databaseUrl = `file:./${dbFile}`;
  const port = 32100 + Math.floor(Math.random() * 1000);
  const origin = `http://127.0.0.1:${port}`;
  const secret = randomUUID() + randomUUID();
  const env = { ...process.env, DATABASE_PROVIDER: "sqlite", DATABASE_URL: databaseUrl, BETTER_AUTH_URL: origin, NEXT_PUBLIC_SITE_URL: origin, SESSION_SECRET: secret, NEXT_PUBLIC_BASE_PATH: basePath, PORT: String(port), NODE_ENV: "production" };
  new Database(dbFile).close();
  const migrate = startNode(["node_modules/prisma/build/index.js", "migrate", "deploy"], env);
  let migrateOutput = "";
  migrate.stdout.on("data", (chunk) => { migrateOutput += chunk; });
  migrate.stderr.on("data", (chunk) => { migrateOutput += chunk; });
  const [migrateCode] = await once(migrate, "exit");
  assert.equal(migrateCode, 0, `Prisma migration failed: ${migrateOutput}`);

  const db = new Database(dbFile);
  const app = startNode(["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], env);
  let appOutput = "";
  app.stdout.on("data", (chunk) => { appOutput += chunk; });
  app.stderr.on("data", (chunk) => { appOutput += chunk; });
  t.after(async () => {
    app.kill("SIGTERM");
    if (app.exitCode === null) await Promise.race([once(app, "exit"), delay(5000)]);
    db.close();
  });
  await waitForServer(`${origin}${basePath}/api/specialties`, app);

  async function request(path, { method = "GET", cookie, body, extraHeaders = {} } = {}) {
    const headers = { "content-type": "application/json", origin, ...extraHeaders };
    if (cookie) headers.cookie = cookie;
    const response = await fetch(`${origin}${basePath}${path}`, { method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { response, data: await response.json().catch(() => ({})) };
  }
  let signupIndex = 0;
  async function signup(label) {
    signupIndex += 1;
    const { response, data } = await request("/api/auth/sign-up/email", { method: "POST", extraHeaders: { "x-forwarded-for": `198.51.100.${signupIndex}` }, body: { name: label, email: `${label.toLowerCase()}-${randomUUID()}@example.test`, password: integrationPassword } });
    assert.equal(response.status, 200, `${response.url} (${response.headers.get("content-type")}): ${JSON.stringify(data)}; server: ${appOutput}`);
    const cookie = response.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
    assert.ok(cookie.includes("medibook"), "sign-up should return an auth cookie");
    return { cookie, user: data.user };
  }

  const admin = await signup("Admin");
  db.prepare("UPDATE User SET role = 'ADMIN' WHERE id = ?").run(admin.user.id);
  const adminSignIn = await request("/api/auth/sign-in/email", { method: "POST", body: { email: admin.user.email, password: integrationPassword } });
  assert.equal(adminSignIn.response.status, 200, "registered credentials can be used to sign in");
  const signedInAdminCookie = adminSignIn.response.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
  assert.ok(signedInAdminCookie.includes("medibook"), "sign-in should set the auth session cookie");
  const patientA = await signup("PatientA");
  const patientB = await signup("PatientB");
  const doctorAccount = await signup("DoctorAccount");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM Patient WHERE userId IN (?, ?)").get(patientA.user.id, patientB.user.id).n, 2, "patient profiles are created at registration");

  const specialtyName = `General-${randomUUID().slice(0, 8)}`;
  const specialtyResult = await request("/api/admin/specialties", { method: "POST", cookie: admin.cookie, body: { name: specialtyName, slug: specialtyName.toLowerCase() } });
  assert.equal(specialtyResult.response.status, 201, JSON.stringify(specialtyResult.data));
  const doctorSlug = `test-doctor-${randomUUID().slice(0, 8)}`;
  const doctorResult = await request("/api/admin/doctors", { method: "POST", cookie: admin.cookie, body: { slug: doctorSlug, displayName: "Test Doctor", specialtyId: specialtyResult.data.specialty.id, experienceYears: 10, consultationModes: "IN_PERSON,VIDEO", timeZone: "UTC" } });
  assert.equal(doctorResult.response.status, 201, JSON.stringify(doctorResult.data));
  assert.equal((await request("/api/admin/doctors", { cookie: patientA.cookie })).response.status, 403, "patients cannot browse private doctor management data");
  const doctorAdminList = await request("/api/admin/doctors", { cookie: admin.cookie });
  assert.equal(doctorAdminList.response.status, 200);
  const doctorUpdated = await request("/api/admin/doctors", { method: "PATCH", cookie: admin.cookie, body: { id: doctorResult.data.doctor.id, displayName: "Updated Test Doctor", specialtyId: specialtyResult.data.specialty.id, experienceYears: 10 } });
  assert.equal(doctorUpdated.response.status, 200, "admin can edit persisted doctor profile fields");
  const rejectedUniversity = await request("/api/admin/doctors", { method: "PATCH", cookie: admin.cookie, body: { id: doctorResult.data.doctor.id, displayName: "Updated Test Doctor", specialtyId: specialtyResult.data.specialty.id, experienceYears: 10, university: "x".repeat(161) } });
  assert.equal(rejectedUniversity.response.status, 400, "oversized university values are rejected server-side");
  const linkResult = await request(`/api/admin/doctors/${doctorSlug}/link-user`, { method: "POST", cookie: admin.cookie, body: { userId: doctorAccount.user.id } });
  assert.equal(linkResult.response.status, 200, JSON.stringify(linkResult.data));
  assert.equal((await request("/api/doctor/profile", { cookie: patientA.cookie })).response.status, 403, "patients cannot use the doctor profile editor");
  assert.equal((await request("/api/doctor/profile", { cookie: doctorAccount.cookie })).response.status, 200, "a linked doctor can read their own profile");
  const doctorProfileUpdate = await request("/api/doctor/profile", { method: "PATCH", cookie: doctorAccount.cookie, body: { professionalTitle: "Consultant", university: "Practice supplied university", qualifications: "Practice supplied qualification", practiceStartYear: 2012, procedureCount: 0 } });
  assert.equal(doctorProfileUpdate.response.status, 200, JSON.stringify(doctorProfileUpdate.data));
  assert.equal(doctorProfileUpdate.data.doctor.professionalTitle, "Consultant");
  assert.equal(doctorProfileUpdate.data.doctor.university, "Practice supplied university");
  assert.equal(doctorProfileUpdate.data.doctor.procedureCount, 0);
  assert.equal((await request("/api/doctor/profile", { method: "PATCH", cookie: doctorAccount.cookie, body: { doctorId: "another-doctor", biography: "attempt" } })).response.status, 400, "doctor profile updates cannot target another doctor");
  assert.equal((await request("/api/doctor/profile", { method: "PATCH", cookie: doctorAccount.cookie, body: { practiceStartYear: new Date().getFullYear() + 1 } })).response.status, 400, "invalid professional profile years are rejected");
  assert.equal((await request(`/api/admin/doctors/${doctorSlug}/availability`, { cookie: patientA.cookie })).response.status, 403, "patients cannot access doctor schedule management");
  const scheduleDate = new Date(Date.now() + 10 * 86400000);
  scheduleDate.setUTCHours(12, 0, 0, 0);
  const scheduleDateKey = scheduleDate.toISOString().slice(0, 10);
  const scheduleWeekday = scheduleDate.getUTCDay();
  const availabilityResult = await request(`/api/admin/doctors/${doctorSlug}/availability`, { method: "POST", cookie: doctorAccount.cookie, body: { weekday: scheduleWeekday, startTime: "09:00", endTime: "10:00", slotMinutes: 30, timeZone: "UTC" } });
  assert.equal(availabilityResult.response.status, 201, JSON.stringify(availabilityResult.data));
  const generatedResult = await request(`/api/admin/doctors/${doctorSlug}/generate-slots`, { method: "POST", cookie: doctorAccount.cookie, body: { from: scheduleDateKey, to: scheduleDateKey } });
  assert.equal(generatedResult.response.status, 201, JSON.stringify(generatedResult.data));
  assert.equal(generatedResult.data.created, 2, "doctor weekly availability creates real future slots");
  const generatedSlots = await request(`/api/doctors/${doctorSlug}/slots?from=${scheduleDateKey}&to=${new Date(scheduleDate.getTime() + 86400000).toISOString().slice(0, 10)}`);
  assert.equal(generatedSlots.response.status, 200);
  assert.equal(generatedSlots.data.slots.filter((slot) => slot.isBookable).length, 2, "public availability reflects generated bookable slots");
  const profilePage = await fetch(`${origin}${basePath}/doctors/${doctorSlug}`);
  assert.equal(profilePage.status, 200, "database doctor portfolio renders");
  const profileHtml = await profilePage.text();
  assert.match(profileHtml, /Consultant/, "portfolio renders saved professional profile data");
  assert.match(profileHtml, /Practice supplied university/, "portfolio renders saved university data");
  const bookingPage = await fetch(`${origin}${basePath}/doctors/${doctorSlug}/appointment`);
  assert.equal(bookingPage.status, 200, "database doctor appointment page renders under the configured base path");
  assert.equal((await request("/api/admin/doctors", { method: "POST", cookie: patientA.cookie, body: {} })).response.status, 403, "patients cannot create doctor records");

  const startA = new Date(Date.now() + 5 * 86400000);
  startA.setUTCHours(10, 0, 0, 0);
  const startB = new Date(startA.getTime() + 86400000);
  const slotsResult = await request(`/api/admin/doctors/${doctorSlug}/slots`, { method: "POST", cookie: admin.cookie, body: { slots: [startA, startB].map((start) => ({ startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 30 * 60000).toISOString(), timeZone: "UTC" })) } });
  assert.equal(slotsResult.response.status, 201, JSON.stringify(slotsResult.data));
  const slotId = db.prepare("SELECT id FROM AppointmentSlot WHERE doctorId = ? ORDER BY startsAt ASC LIMIT 1").get(doctorResult.data.doctor.id).id;

  assert.equal((await request("/api/appointments", { method: "POST", body: { doctorSlug, slotId, type: "IN_PERSON" } })).response.status, 401, "anonymous booking is rejected");
  assert.equal((await request("/api/appointments", { method: "POST", cookie: patientA.cookie, body: { doctorSlug, slotId, type: "BAD" } })).response.status, 400, "invalid appointment types are rejected");
  const concurrent = await Promise.all([patientA, patientB].map(({ cookie }) => request("/api/appointments", { method: "POST", cookie, body: { doctorSlug, slotId, type: "IN_PERSON" } })));
  assert.deepEqual(concurrent.map(({ response }) => response.status).sort(), [201, 409], "only one concurrent request can reserve a slot");
  const winner = concurrent.find(({ response }) => response.status === 201).data.appointment;
  const owner = concurrent.findIndex(({ response }) => response.status === 201) === 0 ? patientA : patientB;
  const other = owner === patientA ? patientB : patientA;
  const adminDashboard = await fetch(`${origin}${basePath}/dashboard`, { headers: { cookie: signedInAdminCookie } });
  assert.equal(adminDashboard.status, 200, `administrator dashboard loads from database: ${appOutput}`);
  const filteredAppointments = await request(`/api/appointments?status=PENDING&doctor=${encodeURIComponent("Updated Test Doctor")}`, { cookie: admin.cookie });
  assert.equal(filteredAppointments.response.status, 200);
  assert.equal(filteredAppointments.data.appointments.length, 1, "admin appointment filters query persisted records");

  const contactPayload = { name: "Visitor User", email: "visitor@example.test", phone: "", category: "COMPLAINT", subject: "Calendar issue", message: "I cannot load available slots on the appointment page.", consent: true };
  assert.equal((await request("/api/admin/contact")).response.status, 401, "contact inbox requires authentication");
  assert.equal((await request("/api/admin/contact", { cookie: patientA.cookie })).response.status, 403, "patients cannot read the private contact inbox");
  assert.equal((await request("/api/admin/doctors")).response.status, 401, "doctor management requires authentication");
  assert.equal((await request("/api/admin/specialties")).response.status, 401, "specialty management requires authentication");
  assert.equal((await request("/api/contact", { method: "POST", body: { ...contactPayload, consent: false } })).response.status, 400, "contact consent is validated server-side");
  const submitted = await request("/api/contact", { method: "POST", cookie: patientA.cookie, body: contactPayload });
  assert.equal(submitted.response.status, 201, JSON.stringify(submitted.data));
  assert.match(submitted.data.submission.reference, /^MB-[A-F0-9]{10}$/);
  assert.equal((await request("/api/admin/contact", { cookie: patientA.cookie })).response.status, 403);
  const adminInbox = await request("/api/admin/contact", { cookie: admin.cookie });
  assert.equal(adminInbox.response.status, 200);
  assert.equal(adminInbox.data.submissions[0].message, contactPayload.message);
  const updatedContact = await request("/api/admin/contact", { method: "PATCH", cookie: admin.cookie, body: { id: adminInbox.data.submissions[0].id, status: "IN_PROGRESS" } });
  assert.equal(updatedContact.response.status, 200, "administrator can update contact status");
  assert.equal((await request("/api/admin/patients", { cookie: patientA.cookie })).response.status, 403, "patient listing is admin-only");
  for (let index = 1; index < 5; index += 1) assert.equal((await request("/api/contact", { method: "POST", body: contactPayload })).response.status, 201, "contact limiter permits up to five submissions per window");
  assert.equal((await request("/api/contact", { method: "POST", body: contactPayload })).response.status, 429, "contact submissions are rate limited");

  assert.equal((await request(`/api/appointments/${winner.id}`, { method: "PATCH", cookie: other.cookie, body: { status: "CANCELLED" } })).response.status, 403, "a patient cannot cancel another patient's appointment");
  assert.equal((await request("/api/appointments", { cookie: owner.cookie })).data.appointments.length, 1);
  assert.equal((await request("/api/appointments", { cookie: other.cookie })).data.appointments.length, 0, "patient history is isolated");
  const doctorAppointments = await request("/api/appointments", { cookie: doctorAccount.cookie });
  assert.equal(doctorAppointments.response.status, 200);
  assert.equal(doctorAppointments.data.appointments.length, 1, "linked doctor can access assigned appointment");
  assert.equal((await request(`/api/appointments/${winner.id}`, { method: "PATCH", cookie: owner.cookie, body: { status: "CANCELLED" } })).response.status, 200, "the owner can cancel their appointment");
  assert.equal((await request("/api/appointments", { cookie: owner.cookie })).data.appointments[0].status, "CANCELLED");
});
