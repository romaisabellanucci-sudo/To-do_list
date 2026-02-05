import type { DayOfWeek } from "@/types";

const DAY_ORDER: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function getDayIndex(day: DayOfWeek): number {
  return DAY_ORDER.indexOf(day);
}

/** Get the Monday of the week containing `date`. */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const jsDay = d.getDay(); // 0=Sun,1=Mon,...6=Sat
  const diff = jsDay === 0 ? -6 : 1 - jsDay;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Returns array of 7 Dates (Mon-Sun) for the week containing `date`. */
export function getWeekDates(date: Date): Date[] {
  const mon = getWeekStart(date);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

export function dayOfWeekFromDate(date: Date): DayOfWeek {
  const jsDay = date.getDay(); // 0=Sun
  const map: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return map[jsDay];
}

/** Is `date` the first Friday of its month? */
export function isFirstFridayOfMonth(date: Date): boolean {
  return date.getDay() === 5 && date.getDate() <= 7;
}

/** Convert "HH:MM" to minutes since midnight. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Convert minutes since midnight to "HH:MM". */
export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/** Format "HH:MM" (24h) to "h:mm AM/PM". */
export function formatTime12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export { DAY_ORDER };
