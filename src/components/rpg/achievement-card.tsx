"use client";

import { motion } from "framer-motion";
import { Lock, Trophy, Zap, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/lib/types/database";

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number; // 0-1
}

export function AchievementCard({
  achievement,
  unlocked,
  unlockedAt,
  progress,
}: AchievementCardProps) {
  return (
    <motion.div
      whileHover={unlocked ? { y: -2, scale: 1.02 } : {}}
      className={cn(
        "relative p-4 rounded-xl border flex items-center gap-4 transition-all overflow-hidden",
        unlocked
          ? "bg-slate-900/80 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          : "bg-slate-900/40 border-slate-800 grayscale opacity-70"
      )}
    >
      {/* Background glow if unlocked */}
      {unlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-50" />
      )}

      <div className="relative shrink-0 w-16 h-16 flex items-center justify-center bg-slate-800 rounded-full border border-slate-700 text-3xl">
        {/* @ts-ignore */}
        {achievement.icon || "🏆"}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-full backdrop-blur-[1px]">
            <Lock className="w-6 h-6 text-slate-400" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 z-10">
        <div className="flex justify-between items-start mb-1">
          <h3 className={cn("font-bold truncate text-base", unlocked ? "text-amber-400" : "text-slate-300")}>
            {/* @ts-ignore */}
            {achievement.name}
          </h3>
          {unlocked && unlockedAt && (
            <span className="text-[10px] text-slate-500 shrink-0 ml-2 mt-1">
              {new Date(unlockedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {/* @ts-ignore */}
        <p className="text-sm text-slate-400 mb-2 line-clamp-2">{achievement.description}</p>
        
        <div className="flex items-center gap-3 mt-auto">
          {/* @ts-ignore */}
          {(achievement.xp_reward > 0 || achievement.gold_reward > 0) && (
            <div className="flex gap-2 text-xs font-medium">
              {/* @ts-ignore */}
              {achievement.xp_reward > 0 && (
                <span className="flex items-center gap-1 text-amber-500">
                  {/* @ts-ignore */}
                  <Zap className="w-3 h-3" /> {achievement.xp_reward}
                </span>
              )}
              {/* @ts-ignore */}
              {achievement.gold_reward > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  {/* @ts-ignore */}
                  <Coins className="w-3 h-3" /> {achievement.gold_reward}
                </span>
              )}
            </div>
          )}
        </div>

        {!unlocked && progress !== undefined && progress > 0 && (
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-slate-500 rounded-full" 
              style={{ width: `${Math.min(100, progress * 100)}%` }} 
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
