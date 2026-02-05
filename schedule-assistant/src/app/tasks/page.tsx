"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import TaskForm from "@/components/TaskForm";
import type { Task } from "@/types";
import { CATEGORY_COLORS, PRIORITY_BADGES } from "@/utils/colors";

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask } = useAppContext();
  const [editing, setEditing] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSave = (task: Task) => {
    if (editing) {
      updateTask(task);
    } else {
      addTask(task);
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (task: Task) => {
    setEditing(task);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  const toggleComplete = (task: Task) => {
    updateTask({ ...task, completed: !task.completed });
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add tasks to be auto-scheduled into your free time.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            + Add Task
          </button>
        )}
      </div>

      {showForm && (
        <TaskForm task={editing} onSave={handleSave} onCancel={handleCancel} />
      )}

      {pendingTasks.length === 0 && !showForm ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
          <p className="text-gray-400">No tasks yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Add tasks and they&apos;ll be auto-scheduled into your free time.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <button
                onClick={() => toggleComplete(task)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 truncate">{task.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      PRIORITY_BADGES[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                      CATEGORY_COLORS[task.category]
                    }`}
                  >
                    {task.category}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Due {task.dueDate} &middot; {task.estimatedMinutes} min
                  {task.locked && " · Locked"}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(task)}
                  className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Completed ({completedTasks.length})
          </h2>
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <button
                onClick={() => toggleComplete(task)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-green-400 bg-green-400 text-white"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-400 line-through truncate">
                  {task.name}
                </h3>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="rounded-lg px-3 py-1.5 text-sm text-red-400 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
