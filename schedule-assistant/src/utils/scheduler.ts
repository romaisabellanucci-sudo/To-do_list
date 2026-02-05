import type { FixedEvent, Task, ScheduledBlock, DayOfWeek } from "@/types";
import {
  getWeekDates,
  dayOfWeekFromDate,
  isFirstFridayOfMonth,
  timeToMinutes,
  minutesToTime,
  toISODate,
} from "./dates";

interface TimeSlot {
  day: DayOfWeek;
  date: string;
  startMinutes: number;
  endMinutes: number;
}

const SCHEDULE_DAY_START = 6 * 60; // 6:00 AM
const SCHEDULE_DAY_END = 22 * 60; // 10:00 PM

/**
 * Get occupied time ranges for a given day based on fixed events.
 */
function getOccupiedSlots(
  day: DayOfWeek,
  date: Date,
  fixedEvents: FixedEvent[]
): { start: number; end: number }[] {
  const occupied: { start: number; end: number }[] = [];

  for (const event of fixedEvents) {
    if (!event.days.includes(day)) continue;

    let endTime = event.endTime;

    // Handle first-Friday override
    if (
      event.firstFridayOverride &&
      day === "Fri" &&
      isFirstFridayOfMonth(date)
    ) {
      endTime = event.firstFridayOverride.endTime;
    }

    occupied.push({
      start: timeToMinutes(event.startTime),
      end: timeToMinutes(endTime),
    });
  }

  // Sort by start time
  occupied.sort((a, b) => a.start - b.start);
  return occupied;
}

/**
 * Find all free time slots in the week.
 */
function getFreeSlots(
  weekOf: Date,
  fixedEvents: FixedEvent[]
): TimeSlot[] {
  const weekDates = getWeekDates(weekOf);
  const freeSlots: TimeSlot[] = [];

  for (const date of weekDates) {
    const day = dayOfWeekFromDate(date);
    const occupied = getOccupiedSlots(day, date, fixedEvents);
    const isoDate = toISODate(date);

    let cursor = SCHEDULE_DAY_START;

    for (const block of occupied) {
      if (cursor < block.start) {
        freeSlots.push({
          day,
          date: isoDate,
          startMinutes: cursor,
          endMinutes: block.start,
        });
      }
      cursor = Math.max(cursor, block.end);
    }

    if (cursor < SCHEDULE_DAY_END) {
      freeSlots.push({
        day,
        date: isoDate,
        startMinutes: cursor,
        endMinutes: SCHEDULE_DAY_END,
      });
    }
  }

  return freeSlots;
}

/**
 * Sort tasks by due date (soonest), then priority, then alternate short/long.
 */
function sortTasks(tasks: Task[]): Task[] {
  const priorityWeight = { P1: 0, P2: 1, P3: 2 };

  // First sort by due date then priority
  const sorted = [...tasks].sort((a, b) => {
    const dateCompare = a.dueDate.localeCompare(b.dueDate);
    if (dateCompare !== 0) return dateCompare;
    return priorityWeight[a.priority] - priorityWeight[b.priority];
  });

  // Alternate short and long tasks
  const short = sorted.filter((t) => t.estimatedMinutes <= 30);
  const long = sorted.filter((t) => t.estimatedMinutes > 30);
  const alternated: Task[] = [];
  let si = 0,
    li = 0;
  let pickShort = true;

  while (si < short.length || li < long.length) {
    if (pickShort && si < short.length) {
      alternated.push(short[si++]);
    } else if (!pickShort && li < long.length) {
      alternated.push(long[li++]);
    } else if (si < short.length) {
      alternated.push(short[si++]);
    } else {
      alternated.push(long[li++]);
    }
    pickShort = !pickShort;
  }

  return alternated;
}

/**
 * Auto-schedule tasks into available free time slots.
 * Returns scheduled blocks and any unscheduled task IDs.
 */
export function autoSchedule(
  weekOf: Date,
  fixedEvents: FixedEvent[],
  tasks: Task[]
): { scheduled: ScheduledBlock[]; unscheduledTaskIds: string[] } {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const sortedTasks = sortTasks(pendingTasks);
  const freeSlots = getFreeSlots(weekOf, fixedEvents);

  const scheduled: ScheduledBlock[] = [];
  const unscheduledTaskIds: string[] = [];

  // Clone free slots so we can mutate them
  const availableSlots = freeSlots.map((s) => ({ ...s }));

  for (const task of sortedTasks) {
    let placed = false;
    const neededMinutes = task.estimatedMinutes;

    for (let i = 0; i < availableSlots.length; i++) {
      const slot = availableSlots[i];
      const slotDuration = slot.endMinutes - slot.startMinutes;

      if (slotDuration >= neededMinutes) {
        // Place task at the start of this slot
        scheduled.push({
          id: `sb_${task.id}_${slot.date}`,
          taskId: task.id,
          taskName: task.name,
          day: slot.day,
          date: slot.date,
          startTime: minutesToTime(slot.startMinutes),
          endTime: minutesToTime(slot.startMinutes + neededMinutes),
          category: task.category,
          priority: task.priority,
        });

        // Shrink the slot
        slot.startMinutes += neededMinutes;
        if (slot.startMinutes >= slot.endMinutes) {
          availableSlots.splice(i, 1);
        }

        placed = true;
        break;
      }
    }

    if (!placed) {
      unscheduledTaskIds.push(task.id);
    }
  }

  return { scheduled, unscheduledTaskIds };
}
