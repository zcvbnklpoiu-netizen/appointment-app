import test from "node:test";
import assert from "node:assert/strict";
import { validateContactSubmission } from "../lib/contact-validation.js";

const valid = { name: "Samira Hassan", email: "SAMIRA@example.test", phone: "", category: "COMPLAINT", subject: "Booking issue", message: "I cannot see an available appointment slot.", consent: true };

test("valid contact data is normalized before persistence", () => {
  const result = validateContactSubmission(valid);
  assert.equal(result.error, undefined);
  assert.equal(result.data.email, "samira@example.test");
  assert.equal(result.data.phone, null);
});

test("contact validation rejects bad email, category, oversized message, and missing consent", () => {
  for (const input of [
    { ...valid, email: "bad-email" },
    { ...valid, category: "ADMIN" },
    { ...valid, message: "x".repeat(5001) },
    { ...valid, consent: false },
    null,
  ]) assert.equal(typeof validateContactSubmission(input).error, "string");
});
