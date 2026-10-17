import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import AdminManagement from "./AdminManagement";
import AdminContactManager from "./AdminContactManager";
import AdminPatients from "./AdminPatients";
import AdminDoctorManager from "./AdminDoctorManager";
import AdminSpecialtyManager from "./AdminSpecialtyManager";
import AdminAppointmentManager from "./AdminAppointmentManager";
import DoctorProfileEditor from "./DoctorProfileEditor";
import DoctorScheduleManager from "./DoctorScheduleManager";
import { isAuthConfigured } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard | MediaBook" };

export default async function DashboardPage() {
  if (process.env.NODE_ENV === "production" && !isAuthConfigured()) redirect("/login?error=auth-unavailable");
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.isActive === false) redirect("/login");
  const role = session.user.role ?? "PATIENT";
  const adminOverview = role === "ADMIN" ? await loadAdminOverview() : null;
  const patient = role === "PATIENT" ? await prisma.patient.findUnique({ where: { userId: session.user.id } }) : null;
  const doctor = role === "DOCTOR" ? await prisma.doctor.findUnique({ where: { userId: session.user.id }, select: { id: true, slug: true, displayName: true, timeZone: true, professionalTitle: true, university: true, biography: true, qualifications: true, training: true, subSpecialties: true, services: true, procedures: true, languages: true, procedureCount: true, practiceStartYear: true } }) : null;
  const where = role === "ADMIN" ? {} : role === "DOCTOR" ? { doctorId: doctor?.id ?? "missing-doctor" } : { patientId: patient?.id ?? "missing-patient" };
  const select: Prisma.AppointmentSelect = {
    id: true, type: true, status: true, createdAt: true,
    slot: { select: { startsAt: true, endsAt: true, timeZone: true } },
    doctor: { select: { slug: true, displayName: true, specialty: { select: { name: true } } } },
  };
  if (role !== "PATIENT") select.patient = { select: { user: { select: { name: true, email: true } } } };
  const appointments = await prisma.appointment.findMany({
    where,
    select,
    orderBy: { slot: { startsAt: "asc" } },
    take: 100,
  });
  const profile = role === "PATIENT" ? { name: session.user.name, email: session.user.email, phone: patient?.phone ?? "" } : null;

  return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-teal-800">{role === "ADMIN" ? "Clinic operations" : role === "DOCTOR" ? "Doctor workspace" : "Patient workspace"}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Hello, {session.user.name}</h1><p className="mt-2 text-sm text-slate-600">{role === "ADMIN" ? "Review persisted platform activity and manage clinic operations." : role === "DOCTOR" ? doctor ? `Schedule for ${doctor.displayName}.` : "Your doctor profile has not been linked yet. Ask a clinic administrator." : "Manage your appointments and profile."}</p></div><div className="rounded-xl bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900">{role.toLowerCase()} account</div></div>{role === "ADMIN" && adminOverview && <AdminOverview data={adminOverview} />}{role === "DOCTOR" && <><DoctorProfileEditor profile={doctor} />{doctor && <DoctorScheduleManager doctor={doctor} />}</>}{role === "ADMIN" ? <AdminAppointmentManager /> : <DashboardClient role={role} appointments={appointments} profile={profile} />}{role === "ADMIN" && <><AdminManagement /><AdminDoctorManager /><AdminPatients /><AdminSpecialtyManager /><AdminContactManager /></>}</main>;
}

async function loadAdminOverview() {
  try {
    const now = new Date();
    const [patients, doctors, profiles, specialties, appointments, upcoming, byStatus, contacts, activity] = await Promise.all([
      prisma.user.count({ where: { role: "PATIENT" } }),
      prisma.user.count({ where: { role: "DOCTOR" } }),
      prisma.doctor.count(),
      prisma.specialty.count(),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { slot: { startsAt: { gte: now } }, status: { in: ["PENDING", "CONFIRMED"] } } }),
      prisma.appointment.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.contactSubmission.count(),
      prisma.auditEvent.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { action: true, targetType: true, createdAt: true, actor: { select: { name: true } } } }),
    ]);
    return { error: false, patients, doctors, profiles, specialties, appointments, upcoming, byStatus, contacts, activity };
  } catch {
    return { error: true, patients: 0, doctors: 0, profiles: 0, specialties: 0, appointments: 0, upcoming: 0, byStatus: [], contacts: 0, activity: [] };
  }
}

function AdminOverview({ data }: { data: Awaited<ReturnType<typeof loadAdminOverview>> }) {
  const cards = [["Patients", data.patients], ["Doctor accounts", data.doctors], ["Doctor profiles", data.profiles], ["Specialties", data.specialties], ["Appointments", data.appointments], ["Upcoming", data.upcoming], ["Contact messages", data.contacts]];
  return <section aria-label="Platform overview" className="mb-10 space-y-5"><div><p className="text-sm font-semibold text-teal-800">PLATFORM OVERVIEW</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Current clinic activity</h2>{data.error && <p role="alert" className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Platform metrics are unavailable because the database could not be reached. Counts are not shown as zero.</p>}</div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">{cards.map(([label, value]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs leading-5 text-slate-600">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{data.error ? "—" : value}</p></article>)}</div>{!data.error && <div className="grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold text-slate-950">Appointments by status</h3><div className="mt-3 flex flex-wrap gap-2">{data.byStatus.length ? data.byStatus.map(({ status, _count }) => <span key={status} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">{status.toLowerCase().replaceAll("_", " ")}: {_count._all}</span>) : <p className="text-sm text-slate-500">No appointments recorded.</p>}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold text-slate-950">Recent platform activity</h3>{data.activity.length ? <ul className="mt-3 space-y-2">{data.activity.map((event, index) => <li key={`${event.targetType}-${event.action}-${index}`} className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-slate-100 pt-2 text-sm"><span className="text-slate-700">{event.actor.name} · {event.action.toLowerCase().replaceAll("_", " ")}</span><time className="text-xs text-slate-500">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(event.createdAt)}</time></li>)}</ul> : <p className="mt-3 text-sm text-slate-500">No audited activity recorded yet.</p>}</section></div>}</section>;
}
