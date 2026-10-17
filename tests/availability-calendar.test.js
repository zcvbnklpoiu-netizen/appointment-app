import test from "node:test";
import assert from "node:assert/strict";
import {
  addCalendarDays,
  dateKeyInTimeZone,
  getDayAvailability,
  getMonthCalendarDays,
  getSlotsForDate,
  isBookableSlot,
  isDateKey,
} from "../lib/availability-calendar.js";

const now = new Date("2026-10-17T10:00:00.000Z");
const timeZone = "Asia/Amman";

test("availability retrieval groups the selected local day and preserves slot states", () => {
  const slots = [
    { id: "open", status: "OPEN", startsAt: "2026-10-20T11:00:00.000Z", endsAt: "2026-10-20T11:30:00.000Z", timeZone },
    { id: "booked", status: "BOOKED", startsAt: "2026-10-20T12:00:00.000Z", endsAt: "2026-10-20T12:30:00.000Z", timeZone },
    { id: "blocked", status: "BLOCKED", startsAt: "2026-10-20T13:00:00.000Z", endsAt: "2026-10-20T13:30:00.000Z", timeZone },
    { id: "other-day", status: "OPEN", startsAt: "2026-10-21T11:00:00.000Z", endsAt: "2026-10-21T11:30:00.000Z", timeZone },
  ];

  const selectedDay = getSlotsForDate(slots, "2026-10-20", timeZone, now);
  assert.deepEqual(selectedDay.map((slot) => slot.id), ["open", "booked", "blocked"]);
  assert.deepEqual(getDayAvailability(slots, "2026-10-20", timeZone, now), {
    date: "2026-10-20", available: 1, booked: 1, unavailable: 1, past: 0,
  });
});

test("date selection follows the slot time zone without shifting the clinic day", () => {
  assert.equal(dateKeyInTimeZone("2026-10-19T22:30:00.000Z", timeZone), "2026-10-20");
  assert.deepEqual(getSlotsForDate([
    { id: "clinic-evening", status: "OPEN", startsAt: "2026-10-19T22:30:00.000Z", timeZone },
  ], "2026-10-20", timeZone, now).map((slot) => slot.id), ["clinic-evening"]);
});

test("empty availability produces no bookable dates or slots", () => {
  assert.deepEqual(getSlotsForDate([], "2026-10-20", timeZone, now), []);
  assert.deepEqual(getDayAvailability([], "2026-10-20", timeZone, now), {
    date: "2026-10-20", available: 0, booked: 0, unavailable: 0, past: 0,
  });
});

test("only future open slots can be selected for booking", () => {
  assert.equal(isBookableSlot({ status: "OPEN", startsAt: "2026-10-20T11:00:00.000Z" }, now), true);
  assert.equal(isBookableSlot({ status: "BOOKED", startsAt: "2026-10-20T11:00:00.000Z" }, now), false);
  assert.equal(isBookableSlot({ status: "BLOCKED", startsAt: "2026-10-20T11:00:00.000Z" }, now), false);
  assert.equal(isBookableSlot({ status: "OPEN", startsAt: "2026-10-17T09:00:00.000Z" }, now), false);
});

test("calendar helpers use date-only arithmetic without host-local time", () => {
  assert.equal(addCalendarDays("2026-10-31", 1), "2026-11-01");
  assert.equal(isDateKey("2026-02-28"), true);
  assert.equal(isDateKey("2026-02-30"), false);
  const october = getMonthCalendarDays("2026-10-01");
  assert.equal(october.length, 42);
  assert.equal(october.find((day) => day.date === "2026-10-01").inMonth, true);
});
