export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type Priority = "P1" | "P2" | "P3";

export type TaskCategory =
  | "Homework"
  | "Glow Up"
  | "Personal"
  | "Extracurricular"
  | "Chores"
  | "Other";

export interface FixedEvent {
  id: string;
  name: string;
  days: DayOfWeek[];
  startTime: string; // "HH:MM" 24h format
  endTime: string; // "HH:MM" 24h format
  color: string;
  /** Special rule: if true, on the first Friday of each month endTime changes */
  firstFridayOverride?: {
    endTime: string;
  };
}

export interface Task {
  id: string;
  name: string;
  dueDate: string; // ISO date string "YYYY-MM-DD"
  estimatedMinutes: number;
  priority: Priority;
  category: TaskCategory;
  locked: boolean;
  completed: boolean;
}

export interface ScheduledBlock {
  id: string;
  taskId: string;
  taskName: string;
  day: DayOfWeek;
  date: string; // ISO date string
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  category: TaskCategory;
  priority: Priority;
}
