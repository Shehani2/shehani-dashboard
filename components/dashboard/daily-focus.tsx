"use client";

import { useState, useEffect } from "react";
import { Check, Flame, Plus, Sparkles, Trash2 } from "lucide-react";

interface PriorityTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

interface Habit {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
}

export function DailyFocus() {
  const [priorities, setPriorities] = useState<PriorityTask[]>([]);
  const [newPriority, setNewPriority] = useState("");

  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", title: "Read 20 pages", completed: false, streak: 8 },
    { id: "2", title: "Drink 2L Water", completed: false, streak: 21 },
  ]);
  const [newHabit, setNewHabit] = useState("");

  // Auto Daily Reset Logic
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = localStorage.getItem("lifeos_last_date");

    const savedPriorities = localStorage.getItem("lifeos_priorities");
    const savedHabits = localStorage.getItem("lifeos_habits");

    let parsedPriorities: PriorityTask[] = savedPriorities ? JSON.parse(savedPriorities) : [];
    let parsedHabits: Habit[] = savedHabits ? JSON.parse(savedHabits) : habits;

    if (lastDate && lastDate !== today) {
      parsedPriorities = parsedPriorities.filter((p) => !p.completed);

      parsedHabits = parsedHabits.map((h) => ({
        ...h,
        completed: false,
      }));

      localStorage.setItem("lifeos_priorities", JSON.stringify(parsedPriorities));
      localStorage.setItem("lifeos_habits", JSON.stringify(parsedHabits));
    }

    setPriorities(parsedPriorities);
    setHabits(parsedHabits);
    localStorage.setItem("lifeos_last_date", today);
  }, []);

  const savePriorities = (updated: PriorityTask[]) => {
    setPriorities(updated);
    localStorage.setItem("lifeos_priorities", JSON.stringify(updated));
  };

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    localStorage.setItem("lifeos_habits", JSON.stringify(updated));
  };

  const handleAddPriority = () => {
    if (!newPriority.trim()) return;
    const newItem: PriorityTask = {
      id: Date.now().toString(),
      title: newPriority,
      category: "Personal",
      completed: false,
    };
    savePriorities([...priorities, newItem]);
    setNewPriority("");
  };

  const togglePriority = (id: string) => {
    const updated = priorities.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p));
    savePriorities(updated);
  };

  const deletePriority = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = priorities.filter((p) => p.id !== id);
    savePriorities(updated);
  };

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;
    const newItem: Habit = {
      id: Date.now().toString(),
      title: newHabit,
      completed: false,
      streak: 1,
    };
    saveHabits([...habits, newItem]);
    setNewHabit("");
  };

  const toggleHabit = (id: string) => {
    const updated = habits.map((h) => {
      if (h.id === id) {
        const isDone = !h.completed;
        return {
          ...h,
          completed: isDone,
          streak: isDone ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      }
      return h;
    });
    saveHabits(updated);
  };

  const deleteHabit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = habits.filter((h) => h.id !== id);
    saveHabits(updated);
  };

  const completedHabitsCount = habits.filter((h) => h.completed).length;
  const habitProgressPercent = habits.length > 0 ? Math.round((completedHabitsCount / habits.length) * 100) : 0;
  const remainingPriorities = priorities.filter((p) => !p.completed).length;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      {/* Top Priorities Section */}
      <div className="md:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary border border-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Top priorities</h3>
              <p className="text-xs text-muted-foreground">Your must-dos for today</p>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            {remainingPriorities} left
          </span>
        </div>

        {/* Priority List */}
        <div className="space-y-3 mb-5">
          {priorities.length === 0 && (
            <p className="text-xs text-muted-foreground italic py-2">No priorities set for today. Add one below!</p>
          )}
          {priorities.map((item) => (
            <div
              key={item.id}
              onClick={() => togglePriority(item.id)}
              className={`group flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                item.completed
                  ? "border-border/50 bg-accent/20 text-muted-foreground line-through"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                    item.completed ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {item.completed && <Check className="h-3 w-3" />}
                </div>
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] text-primary">
                  {item.category}
                </span>
                <button
                  onClick={(e) => deletePriority(item.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Priority Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a priority..."
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddPriority()}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddPriority}
            className="rounded-xl bg-primary px-4 py-2.5 text-primary-foreground hover:opacity-90 transition cursor-pointer active:scale-95 shadow-md shadow-primary/20"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Habits Section */}
      <div className="md:col-span-5 rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary border border-primary/20">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Habits</h3>
              <p className="text-xs text-muted-foreground">
                {completedHabitsCount} of {habits.length} done today
              </p>
            </div>
          </div>
        </div>

        {/* Habits Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-mono">
            <span>Daily progress</span>
            <span className="text-primary font-semibold">{habitProgressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-accent">
            <div
              className="h-full bg-primary transition-all duration-300 shadow-sm shadow-primary/30"
              style={{ width: `${habitProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Habits List */}
        <div className="space-y-3 mb-5">
          {habits.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleHabit(item.id)}
              className={`group flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                item.completed
                  ? "border-primary/30 bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-border/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                    item.completed ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {item.completed && <Check className="h-3 w-3" />}
                </div>
                <span className={`text-sm ${item.completed ? "font-semibold text-foreground" : ""}`}>
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-mono text-primary">
                  <Flame className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span>{item.streak}</span>
                </div>
                <button
                  onClick={(e) => deleteHabit(item.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-1 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Habit Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
            className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddHabit}
            className="rounded-xl bg-primary px-3 py-2 text-primary-foreground hover:opacity-90 transition cursor-pointer active:scale-95 shadow-md shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}