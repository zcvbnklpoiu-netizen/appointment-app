export function addCalendarDays(dateKey, amount) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + amount)).toISOString().slice(0, 10);
}

export function isDateKey(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function dateKeyInTimeZone(value, timeZone) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getMonthCalendarDays(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const start = new Date(Date.UTC(year, month - 1, 1 - first.getUTCDay()));
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getTime() + index * 86400000);
    const value = date.toISOString().slice(0, 10);
    return { date: value, day: date.getUTCDate(), inMonth: date.getUTCMonth() === month - 1 };
  });
}

export function isBookableSlot(slot, now = Date.now()) {
  return slot.status === "OPEN" && new Date(slot.startsAt).getTime() > new Date(now).getTime();
}

export function getSlotsForDate(slots, date, timeZone, now) {
  const nowTime = now === undefined ? undefined : new Date(now).getTime();
  return slots.filter((slot) =>
    dateKeyInTimeZone(slot.startsAt, slot.timeZone || timeZone) === date,
  ).sort((left, right) => new Date(left.startsAt) - new Date(right.startsAt)).map((slot) => ({
    ...slot,
    isPast: typeof slot.isPast === "boolean" ? slot.isPast : nowTime === undefined ? false : new Date(slot.startsAt).getTime() <= nowTime,
    isBookable: typeof slot.isBookable === "boolean" ? slot.isBookable : nowTime === undefined ? false : isBookableSlot(slot, now),
  }));
}

export function getDayAvailability(slots, date, timeZone, now) {
  const daySlots = getSlotsForDate(slots, date, timeZone, now);
  return {
    date,
    available: daySlots.filter((slot) => slot.isBookable).length,
    booked: daySlots.filter((slot) => slot.status === "BOOKED" && !slot.isPast).length,
    unavailable: daySlots.filter((slot) => slot.status === "BLOCKED" && !slot.isPast).length,
    past: daySlots.filter((slot) => slot.isPast).length,
  };
}
