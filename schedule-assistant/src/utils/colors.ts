import type { TaskCategory } from "@/types";

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  Homework: "bg-blue-100 border-blue-400 text-blue-800",
  "Glow Up": "bg-pink-100 border-pink-400 text-pink-800",
  Personal: "bg-purple-100 border-purple-400 text-purple-800",
  Extracurricular: "bg-green-100 border-green-400 text-green-800",
  Chores: "bg-yellow-100 border-yellow-400 text-yellow-800",
  Other: "bg-gray-100 border-gray-400 text-gray-800",
};

export const FIXED_EVENT_COLORS = [
  "bg-indigo-200 border-indigo-500 text-indigo-900",
  "bg-teal-200 border-teal-500 text-teal-900",
  "bg-orange-200 border-orange-500 text-orange-900",
  "bg-rose-200 border-rose-500 text-rose-900",
  "bg-cyan-200 border-cyan-500 text-cyan-900",
  "bg-amber-200 border-amber-500 text-amber-900",
];

export const PRIORITY_BADGES: Record<string, string> = {
  P1: "bg-red-500 text-white",
  P2: "bg-orange-400 text-white",
  P3: "bg-gray-400 text-white",
};
