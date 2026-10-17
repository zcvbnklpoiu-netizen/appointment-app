
function normalizeDate(dateString) {
  return new Date(`${dateString}T00:00:00`);
}

export function validateAppointmentInput(values) {
  const errors = {};
  const safeName = values.name?.trim() ?? "";
  const safeEmail = values.email?.trim() ?? "";
  const safeDate = values.date ?? "";
  const safeTime = values.time ?? "";
  const safeNotes = values.notes?.trim() ?? "";

  if (!safeName) {
    errors.name = "Please enter your full name.";
  }

  if (!safeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!safeDate) {
    errors.date = "Please choose an appointment date.";
  } else {
    const selectedDate = normalizeDate(safeDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
      errors.date = "Appointment date must be today or in the future.";
    }
  }

  if (!safeTime) {
    errors.time = "Please choose a time slot.";
  }

  if (safeNotes.length > 300) {
    errors.notes = "Notes should be 300 characters or fewer.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
