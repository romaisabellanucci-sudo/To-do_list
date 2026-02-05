"use client";

import { useState, useEffect } from "react";
import type { FixedEvent, DayOfWeek } from "@/types";
import { FIXED_EVENT_COLORS } from "@/utils/colors";

const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  event?: FixedEvent | null;
  onSave: (event: FixedEvent) => void;
  onCancel: () => void;
}

export default function FixedEventForm({ event, onSave, onCancel }: Props) {
  const [name, setName] = useState(event?.name ?? "");
  const [days, setDays] = useState<DayOfWeek[]>(event?.days ?? []);
  const [startTime, setStartTime] = useState(event?.startTime ?? "08:00");
  const [endTime, setEndTime] = useState(event?.endTime ?? "09:00");
  const [color, setColor] = useState(event?.color ?? FIXED_EVENT_COLORS[0]);
  const [hasFirstFridayOverride, setHasFirstFridayOverride] = useState(
    !!event?.firstFridayOverride
  );
  const [fridayEndTime, setFridayEndTime] = useState(
    event?.firstFridayOverride?.endTime ?? "12:30"
  );

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDays(event.days);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setColor(event.color);
      setHasFirstFridayOverride(!!event.firstFridayOverride);
      setFridayEndTime(event.firstFridayOverride?.endTime ?? "12:30");
    }
  }, [event]);

  const toggleDay = (day: DayOfWeek) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || days.length === 0) return;

    onSave({
      id: event?.id ?? crypto.randomUUID(),
      name: name.trim(),
      days,
      startTime,
      endTime,
      color,
      firstFridayOverride: hasFirstFridayOverride
        ? { endTime: fridayEndTime }
        : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {event ? "Edit Event" : "Add Fixed Event"}
      </h3>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Event Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. School, Volleyball Practice"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Days</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                days.includes(day)
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
      </div>

      {days.includes("Fri") && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hasFirstFridayOverride}
              onChange={(e) => setHasFirstFridayOverride(e.target.checked)}
              className="rounded"
            />
            <span className="font-medium text-amber-800">
              Different end time on first Friday of month
            </span>
          </label>
          {hasFirstFridayOverride && (
            <div className="mt-2">
              <label className="mb-1 block text-xs text-amber-700">End time on first Friday</label>
              <input
                type="time"
                value={fridayEndTime}
                onChange={(e) => setFridayEndTime(e.target.value)}
                className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Color</label>
        <div className="flex flex-wrap gap-2">
          {FIXED_EVENT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full border-2 ${c.split(" ")[0]} ${
                color === c ? "ring-2 ring-gray-900 ring-offset-2" : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          {event ? "Update" : "Add Event"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
