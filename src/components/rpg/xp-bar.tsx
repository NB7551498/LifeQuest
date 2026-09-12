"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface XPBarProps {
  currentXp: number;
  requiredXp: number;
  level: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

export function XPBar({
  currentXp,
  requiredXp,
  level,
  showLabel = true,
  size = "md",
  className,
  animated = true,
}: XPBarProps) {
  const percentage = Math.min(100, Math.max(0, (currentXp / requiredXp) * 100));

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm font-medium text-slate-300">
          <span>Level {level}</span>
          <span className="text-xs text-slate-400">
            {currentXp} / {requiredXp} XP
          </span>
        </div>
      )}
      <div className={cn("bg-slate-800 rounded-full overflow-hidden w-full", sizeClasses[size])}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
      </div>
    </div>
  );
}
