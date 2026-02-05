"use client";

import { useMemo } from "react";
import type { FixedEvent, ScheduledBlock, DayOfWeek } from "@/types";
import {
  DAY_ORDER,
  getWeekDates,
  dayOfWeekFromDate,
  isFirstFridayOfMonth,
  timeToMinutes,
  formatTime12,
  formatDateShort,
  toISODate,
} from "@/utils/dates";
import { CATEGORY_COLORS } from "@/utils/colors";

const HOUR_START = 6; // 6 AM
const HOUR_END = 22; // 10 PM
const TOTAL_MINUTES = (HOUR_END - HOUR_START) * 60;
const HOUR_HEIGHT = 60; // px per hour

interface Props {
  weekOf: Date;
  fixedEvents: FixedEvent[];
  scheduledBlocks: ScheduledBlock[];
}

interface CalendarBlock {
  id: string;
  label: string;
  sublabel?: string;
  startMinutes: number;
  endMinutes: number;
  className: string;
  isTask: boolean;
}

function getBlocksForDay(
  day: DayOfWeek,
  date: Date,
  fixedEvents: FixedEvent[],
  scheduledBlocks: ScheduledBlock[]
): CalendarBlock[] {
  const blocks: CalendarBlock[] = [];
  const isoDate = toISODate(date);

  // Fixed events
  for (const event of fixedEvents) {
    if (!event.days.includes(day)) continue;

    let endTime = event.endTime;
    if (
      event.firstFridayOverride &&
      day === "Fri" &&
      isFirstFridayOfMonth(date)
    ) {
      endTime = event.firstFridayOverride.endTime;
    }

    blocks.push({
      id: `fixed_${event.id}_${day}`,
      label: event.name,
      sublabel: `${formatTime12(event.startTime)} - ${formatTime12(endTime)}`,
      startMinutes: timeToMinutes(event.startTime),
      endMinutes: timeToMinutes(endTime),
      className: event.color,
      isTask: false,
    });
  }

  // Scheduled task blocks
  for (const block of scheduledBlocks) {
    if (block.date !== isoDate) continue;

    blocks.push({
      id: block.id,
      label: block.taskName,
      sublabel: `${formatTime12(block.startTime)} - ${formatTime12(block.endTime)}`,
      startMinutes: timeToMinutes(block.startTime),
      endMinutes: timeToMinutes(block.endTime),
      className: CATEGORY_COLORS[block.category] ?? CATEGORY_COLORS.Other,
      isTask: true,
    });
  }

  return blocks;
}

export default function WeekCalendar({ weekOf, fixedEvents, scheduledBlocks }: Props) {
  const weekDates = useMemo(() => getWeekDates(weekOf), [weekOf]);

  const hours = useMemo(
    () => Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i),
    []
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <div className="min-w-[800px]">
        {/* Header row */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200">
          <div className="border-r border-gray-100 p-2" />
          {weekDates.map((date, i) => {
            const day = DAY_ORDER[i];
            const isToday = toISODate(date) === toISODate(new Date());
            return (
              <div
                key={day}
                className={`border-r border-gray-100 p-2 text-center last:border-r-0 ${
                  isToday ? "bg-gray-900 text-white" : ""
                }`}
              >
                <div className="text-xs font-medium uppercase tracking-wide opacity-70">
                  {day}
                </div>
                <div className="text-sm font-semibold">{formatDateShort(date)}</div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="relative grid grid-cols-[60px_repeat(7,1fr)]">
          {/* Hour labels */}
          <div className="border-r border-gray-100">
            {hours.map((h) => (
              <div
                key={h}
                className="relative flex items-start justify-end pr-2 text-xs text-gray-400"
                style={{ height: `${HOUR_HEIGHT}px` }}
              >
                <span className="-mt-2">
                  {h === 0
                    ? "12 AM"
                    : h < 12
                    ? `${h} AM`
                    : h === 12
                    ? "12 PM"
                    : `${h - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date, i) => {
            const day = DAY_ORDER[i];
            const blocks = getBlocksForDay(day, date, fixedEvents, scheduledBlocks);
            const totalHeight = (HOUR_END - HOUR_START) * HOUR_HEIGHT;

            return (
              <div
                key={day}
                className="relative border-r border-gray-100 last:border-r-0"
                style={{ height: `${totalHeight}px` }}
              >
                {/* Hour grid lines */}
                {hours.map((h) => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-gray-50"
                    style={{ top: `${(h - HOUR_START) * HOUR_HEIGHT}px` }}
                  />
                ))}

                {/* Event / task blocks */}
                {blocks.map((block) => {
                  const top =
                    ((block.startMinutes - HOUR_START * 60) / 60) * HOUR_HEIGHT;
                  const height =
                    ((block.endMinutes - block.startMinutes) / 60) * HOUR_HEIGHT;

                  return (
                    <div
                      key={block.id}
                      className={`absolute left-0.5 right-0.5 overflow-hidden rounded-md border px-1.5 py-1 text-xs leading-tight ${
                        block.className
                      } ${block.isTask ? "border-dashed" : ""}`}
                      style={{ top: `${top}px`, height: `${Math.max(height, 20)}px` }}
                      title={`${block.label}\n${block.sublabel}`}
                    >
                      <div className="font-semibold truncate">{block.label}</div>
                      {height > 30 && (
                        <div className="truncate opacity-75">{block.sublabel}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
