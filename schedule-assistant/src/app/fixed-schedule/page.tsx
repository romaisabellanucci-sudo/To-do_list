"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import FixedEventForm from "@/components/FixedEventForm";
import type { FixedEvent } from "@/types";
import { formatTime12 } from "@/utils/dates";

export default function FixedSchedulePage() {
  const { fixedEvents, addFixedEvent, updateFixedEvent, deleteFixedEvent } =
    useAppContext();
  const [editing, setEditing] = useState<FixedEvent | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (event: FixedEvent) => {
    if (editing) {
      updateFixedEvent(event);
    } else {
      addFixedEvent(event);
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (event: FixedEvent) => {
    setEditing(event);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fixed Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            Weekly repeating events like school, sports, etc.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            + Add Event
          </button>
        )}
      </div>

      {showForm && (
        <FixedEventForm
          event={editing}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {fixedEvents.length === 0 && !showForm ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
          <p className="text-gray-400">No fixed events yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Add your recurring weekly schedule above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fixedEvents.map((event) => (
            <div
              key={event.id}
              className={`flex items-center justify-between rounded-xl border-l-4 bg-white p-4 shadow-sm ${
                event.color.split(" ")[1]
              }`}
            >
              <div>
                <h3 className="font-semibold text-gray-900">{event.name}</h3>
                <p className="mt-0.5 text-sm text-gray-600">
                  {event.days.join(", ")} &middot;{" "}
                  {formatTime12(event.startTime)} &ndash;{" "}
                  {formatTime12(event.endTime)}
                </p>
                {event.firstFridayOverride && (
                  <p className="mt-0.5 text-xs text-amber-600">
                    First Friday: ends at{" "}
                    {formatTime12(event.firstFridayOverride.endTime)}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteFixedEvent(event.id)}
                  className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
