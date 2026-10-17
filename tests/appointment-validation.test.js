import test from "node:test";
import assert from "node:assert/strict";
import { validateAppointmentInput } from "../lib/appointment-validation.js";
import { validateDoctorProfileInput } from "../lib/doctor-profile-validation.js";

test("rejects incomplete appointment details", () => {
  const result = validateAppointmentInput({
    name: "",
    email: "patient@example.com",
    date: "2099-10-13",
    time: "09:30",
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
});

test("accepts valid appointment details", () => {
  const result = validateAppointmentInput({
    name: "Alicia Johnson",
    email: "patient@example.com",
    date: "2099-10-13",
    time: "09:30",
    notes: "Needs a follow-up consult.",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test("validates optional doctor profile fields and normalizes empty text", () => {
  const result = validateDoctorProfileInput({
    displayName: "  Dr. Example  ",
    professionalTitle: "  ",
    university: "Example University",
    practiceStartYear: 2012,
    procedureCount: 0,
    services: "Consultation\nFollow-up",
  }, 2026);

  assert.equal(result.ok, true);
  assert.deepEqual(result.data, {
    displayName: "Dr. Example",
    professionalTitle: null,
    university: "Example University",
    practiceStartYear: 2012,
    procedureCount: 0,
    services: "Consultation\nFollow-up",
  });
});

test("rejects invalid doctor profile values and unknown ownership fields", () => {
  assert.equal(validateDoctorProfileInput({ practiceStartYear: 2027 }, 2026).ok, false);
  assert.equal(validateDoctorProfileInput({ procedureCount: -1 }).ok, false);
  assert.equal(validateDoctorProfileInput({ doctorId: "another-doctor", biography: "x" }).ok, false);
  assert.equal(validateDoctorProfileInput({ displayName: " " }).ok, false);
  assert.equal(validateDoctorProfileInput({ university: "x".repeat(161) }).ok, false);
});
