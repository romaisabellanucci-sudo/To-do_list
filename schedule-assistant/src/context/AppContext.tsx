"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { FixedEvent, Task, ScheduledBlock } from "@/types";

interface AppContextType {
  fixedEvents: FixedEvent[];
  tasks: Task[];
  scheduledBlocks: ScheduledBlock[];
  addFixedEvent: (event: FixedEvent) => void;
  updateFixedEvent: (event: FixedEvent) => void;
  deleteFixedEvent: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  setScheduledBlocks: (blocks: ScheduledBlock[]) => void;
  clearScheduledBlocks: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [fixedEvents, setFixedEvents] = useState<FixedEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scheduledBlocks, setScheduledBlocks] = useState<ScheduledBlock[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setFixedEvents(loadFromStorage<FixedEvent[]>("sa_fixedEvents", []));
    setTasks(loadFromStorage<Task[]>("sa_tasks", []));
    setScheduledBlocks(loadFromStorage<ScheduledBlock[]>("sa_scheduledBlocks", []));
    setLoaded(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("sa_fixedEvents", JSON.stringify(fixedEvents));
  }, [fixedEvents, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("sa_tasks", JSON.stringify(tasks));
  }, [tasks, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("sa_scheduledBlocks", JSON.stringify(scheduledBlocks));
  }, [scheduledBlocks, loaded]);

  const addFixedEvent = useCallback((event: FixedEvent) => {
    setFixedEvents((prev) => [...prev, event]);
  }, []);

  const updateFixedEvent = useCallback((event: FixedEvent) => {
    setFixedEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
  }, []);

  const deleteFixedEvent = useCallback((id: string) => {
    setFixedEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearScheduledBlocks = useCallback(() => {
    setScheduledBlocks([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        fixedEvents,
        tasks,
        scheduledBlocks,
        addFixedEvent,
        updateFixedEvent,
        deleteFixedEvent,
        addTask,
        updateTask,
        deleteTask,
        setScheduledBlocks,
        clearScheduledBlocks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
