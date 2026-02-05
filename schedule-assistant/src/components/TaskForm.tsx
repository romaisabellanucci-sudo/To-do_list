"use client";

import { useState, useEffect } from "react";
import type { Task, Priority, TaskCategory } from "@/types";

const PRIORITIES: Priority[] = ["P1", "P2", "P3"];
const CATEGORIES: TaskCategory[] = [
  "Homework",
  "Glow Up",
  "Personal",
  "Extracurricular",
  "Chores",
  "Other",
];

interface Props {
  task?: Task | null;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSave, onCancel }: Props) {
  const [name, setName] = useState(task?.name ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState(
    task?.estimatedMinutes ?? 30
  );
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "P2");
  const [category, setCategory] = useState<TaskCategory>(
    task?.category ?? "Homework"
  );
  const [locked, setLocked] = useState(task?.locked ?? false);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDueDate(task.dueDate);
      setEstimatedMinutes(task.estimatedMinutes);
      setPriority(task.priority);
      setCategory(task.category);
      setLocked(task.locked);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dueDate) return;

    onSave({
      id: task?.id ?? crypto.randomUUID(),
      name: name.trim(),
      dueDate,
      estimatedMinutes,
      priority,
      category,
      locked,
      completed: task?.completed ?? false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {task ? "Edit Task" : "Add Task"}
      </h3>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Task Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Math homework Ch. 5"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Estimated Minutes
          </label>
          <input
            type="number"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            min={5}
            max={480}
            step={5}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Priority</label>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                priority === p
                  ? p === "P1"
                    ? "bg-red-500 text-white"
                    : p === "P2"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                category === c
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={locked}
          onChange={(e) => setLocked(e.target.checked)}
          className="rounded"
        />
        Lock to specific time slot (future feature)
      </label>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          {task ? "Update" : "Add Task"}
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
