export const contactCategories = ["GENERAL_INQUIRY", "COMPLAINT", "TECHNICAL_ISSUE", "SUGGESTION", "OTHER"];

export function validateContactSubmission(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { error: "Enter the requested contact details." };
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const category = input.category;
  const subject = typeof input.subject === "string" ? input.subject.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (name.length < 2 || name.length > 120) return { error: "Name must be between 2 and 120 characters." };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  if (phone.length > 32 || (phone && !/^[+()\d .-]{5,32}$/.test(phone))) return { error: "Enter a valid phone number or leave it blank." };
  if (!contactCategories.includes(category)) return { error: "Choose a valid message category." };
  if (subject.length < 3 || subject.length > 160) return { error: "Subject must be between 3 and 160 characters." };
  if (message.length < 10 || message.length > 5000) return { error: "Message must be between 10 and 5,000 characters." };
  if (input.consent !== true) return { error: "Please agree to the privacy notice before sending." };
  return { data: { name, email, phone: phone || null, category, subject, message } };
}
