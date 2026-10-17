const TEXT_LIMITS = {
  displayName: 120,
  professionalTitle: 120,
  university: 160,
  biography: 4000,
  qualifications: 3000,
  training: 3000,
  subSpecialties: 2000,
  services: 3000,
  procedures: 3000,
  languages: 500,
};

const ALLOWED_FIELDS = new Set([...Object.keys(TEXT_LIMITS), "procedureCount", "practiceStartYear"]);

export function validateDoctorProfileInput(input, currentYear = new Date().getFullYear()) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Invalid profile details." };
  }

  const keys = Object.keys(input);
  if (keys.length === 0 || keys.some((key) => !ALLOWED_FIELDS.has(key))) {
    return { ok: false, error: "Profile contains unsupported or missing fields." };
  }

  const data = {};
  for (const [field, maxLength] of Object.entries(TEXT_LIMITS)) {
    if (!(field in input)) continue;
    if (typeof input[field] !== "string" || input[field].length > maxLength) {
      return { ok: false, error: `The ${field} field is invalid or too long.` };
    }
    const value = input[field].trim();
    if (field === "displayName" && value.length < 2) return { ok: false, error: "Display name must contain at least 2 characters." };
    data[field] = value || null;
  }

  if ("procedureCount" in input) {
    const value = input.procedureCount;
    if (value !== null && (!Number.isSafeInteger(value) || value < 0 || value > 10_000_000)) {
      return { ok: false, error: "Procedure count must be a whole number from 0 to 10,000,000." };
    }
    data.procedureCount = value;
  }

  if ("practiceStartYear" in input) {
    const value = input.practiceStartYear;
    if (value !== null && (!Number.isInteger(value) || value < 1850 || value > currentYear)) {
      return { ok: false, error: `Practice start year must be between 1850 and ${currentYear}.` };
    }
    data.practiceStartYear = value;
  }

  return { ok: true, data };
}
