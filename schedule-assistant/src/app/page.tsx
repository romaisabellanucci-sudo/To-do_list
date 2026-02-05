"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import WeekCalendar from "@/components/WeekCalendar";
import { autoSchedule } from "@/utils/scheduler";
import { getWeekStart, formatDateShort, getWeekDates } from "@/utils/dates";

export default function CalendarPage() {
  const {
    fixedEvents,
    tasks,
    scheduledBlocks,
    setScheduledBlocks,
    clearScheduledBlocks,
  } = useAppContext();

  const [weekOffset, setWeekOffset] = useState(0);
  const [unscheduledIds, setUnscheduledIds] = useState<string[]>([]);

  const currentWeek = useMemo(() => {
    const now = new Date();
    const start = getWeekStart(now);
    start.setDate(start.getDate() + weekOffset * 7);
    return start;
  }, [weekOffset]);

  const weekDates = useMemo(() => getWeekDates(currentWeek), [currentWeek]);

  const handleAutoSchedule = () => {
    const result = autoSchedule(currentWeek, fixedEvents, tasks);
    setScheduledBlocks(result.scheduled);
    setUnscheduledIds(result.unscheduledTaskIds);
  };

  const handleClear = () => {
    clearScheduledBlocks();
    setUnscheduledIds([]);
  };

  const pendingTaskCount = tasks.filter((t) => !t.completed).length;
  const unscheduledTasks = tasks.filter((t) => unscheduledIds.includes(t.id));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {formatDateShort(weekDates[0])} &ndash;{" "}
            {formatDateShort(weekDates[6])}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            &larr; Prev
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Next &rarr;
          </button>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleAutoSchedule}
          disabled={pendingTaskCount === 0}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Auto-Schedule ({pendingTaskCount} tasks)
        </button>
        {scheduledBlocks.length > 0 && (
          <button
            onClick={handleClear}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Clear Schedule
          </button>
        )}

        {scheduledBlocks.length > 0 && (
          <span className="text-sm text-gray-500">
            {scheduledBlocks.length} task{scheduledBlocks.length !== 1 && "s"}{" "}
            scheduled
          </span>
        )}
      </div>

      {/* Unscheduled warning */}
      {unscheduledTasks.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-800">
            {unscheduledTasks.length} task
            {unscheduledTasks.length !== 1 && "s"} couldn&apos;t fit this week:
          </p>
          <ul className="mt-1 list-inside list-disc text-sm text-amber-700">
            {unscheduledTasks.map((t) => (
              <li key={t.id}>
                {t.name} ({t.estimatedMinutes} min, due {t.dueDate})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-5 rounded border border-indigo-500 bg-indigo-200" />
          Fixed events
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-5 rounded border border-dashed border-blue-400 bg-blue-100" />
          Scheduled tasks
        </span>
      </div>

      {/* Calendar grid */}
      <WeekCalendar
        weekOf={currentWeek}
        fixedEvents={fixedEvents}
        scheduledBlocks={scheduledBlocks}
      />
    </div>
  );
}
