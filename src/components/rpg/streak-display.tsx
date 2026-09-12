"use client";

import { motion } from "framer-motion";
import { Flame, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  weekActivity?: { date: string; dayLabel: string; completed: boolean }[];
  compact?: boolean;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  weekActivity = [],
  compact = false,
}: StreakDisplayProps) {
  const isPulsing = currentStreak > 0;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 font-bold">
        <motion.div
          animate={isPulsing ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Flame className={cn("w-5 h-5", currentStreak > 0 ? "text-orange-500 fill-orange-500" : "text-slate-500")} />
        </motion.div>
        <span className={currentStreak > 0 ? "text-orange-500" : "text-slate-400"}>
          {currentStreak}
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={isPulsing ? { scale: [1, 1.1, 1], filter: ["drop-shadow(0 0 5px rgba(249,115,22,0))", "drop-shadow(0 0 15px rgba(249,115,22,0.6))", "drop-shadow(0 0 5px rgba(249,115,22,0))"] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="relative"
          >
            <Flame className={cn("w-10 h-10", currentStreak > 0 ? "text-orange-500 fill-orange-500" : "text-slate-600")} />
          </motion.div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{currentStreak}</span>
              <span className="text-sm font-medium text-slate-400">days in a row</span>
            </div>
            <div className="text-xs text-slate-500">
              Longest streak: {longestStreak} days
            </div>
          </div>
        </div>
      </div>

      {weekActivity.length > 0 && (
        <div className="flex justify-between mt-4 gap-2">
          {weekActivity.map((day, idx) => {
            const isToday = idx === weekActivity.length - 1; // Assuming last item is today
            return (
              <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={cn(
                    "w-full aspect-square rounded-md flex items-center justify-center transition-colors",
                    day.completed
                      ? "bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                      : "bg-slate-800 border border-slate-700",
                    isToday && !day.completed && "border-slate-500 border-2"
                  )}
                >
                  {day.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <span className={cn("text-[10px] font-medium uppercase", isToday ? "text-white" : "text-slate-500")}>
                  {day.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
