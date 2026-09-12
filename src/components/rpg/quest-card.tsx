"use client";

import { motion } from "framer-motion";
import { Check, Clock, Trash2, Loader2, Star, Zap, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { ATTRIBUTES, DIFFICULTIES } from "@/lib/rpg/constants";
import type { Quest } from "@/lib/types/database";

interface QuestCardProps {
  quest: Quest;
  onComplete?: (questId: string) => void;
  onDelete?: (questId: string) => void;
  isCompleting?: boolean;
  showActions?: boolean;
  compact?: boolean;
}

export function QuestCard({
  quest,
  onComplete,
  onDelete,
  isCompleting = false,
  showActions = true,
  compact = false,
}: QuestCardProps) {
  // @ts-ignore - Assuming standard quest properties based on common database schema
  const isCompleted = quest.status === "completed";
  // @ts-ignore
  const isOverdue = quest.due_date && new Date(quest.due_date) < new Date() && !isCompleted;

  return (
    <motion.div
      layout
      whileHover={!isCompleted ? { scale: 1.01, boxShadow: "0 0 15px rgba(51, 65, 85, 0.5)" } : {}}
      className={cn(
        "relative p-4 rounded-xl border transition-colors",
        isCompleted
          ? "bg-slate-900/40 border-slate-800 opacity-60"
          : "bg-slate-900/60 border-slate-700 hover:border-slate-600"
      )}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className={cn("font-bold text-slate-100", compact ? "text-base" : "text-lg", isCompleted && "line-through text-slate-400")}>
              {/* @ts-ignore */}
              {quest.title}
            </h3>
            {isCompleted && <Check className="w-4 h-4 text-green-500" />}
          </div>
          
          {/* @ts-ignore */}
          {!compact && quest.description && (
            <p className="text-sm text-slate-400 line-clamp-2">{/* @ts-ignore */ quest.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* @ts-ignore */}
            {quest.difficulty && DIFFICULTIES[quest.difficulty as keyof typeof DIFFICULTIES] && (
              <span className="flex items-center gap-0.5 text-yellow-500">
                {/* @ts-ignore */}
                {Array.from({ length: DIFFICULTIES[quest.difficulty as keyof typeof DIFFICULTIES].stars }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </span>
            )}
            
            {/* @ts-ignore */}
            {quest.attribute && ATTRIBUTES[quest.attribute as keyof typeof ATTRIBUTES] && (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                {/* @ts-ignore */}
                {ATTRIBUTES[quest.attribute as keyof typeof ATTRIBUTES].icon} {ATTRIBUTES[quest.attribute as keyof typeof ATTRIBUTES].label}
              </span>
            )}
            
            {/* @ts-ignore */}
            {quest.due_date && (
              <span className={cn("flex items-center gap-1", isOverdue ? "text-red-400" : "text-slate-400")}>
                <Clock className="w-3 h-3" />
                {/* @ts-ignore */}
                {new Date(quest.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 pt-2 text-sm font-medium">
            <span className="flex items-center gap-1 text-amber-500">
              {/* @ts-ignore */}
              <Zap className="w-4 h-4" /> {quest.xp_reward || 0}
            </span>
            <span className="flex items-center gap-1 text-yellow-400">
              {/* @ts-ignore */}
              <Coins className="w-4 h-4" /> {quest.gold_reward || 0}
            </span>
            {/* @ts-ignore */}
            {quest.attribute && ATTRIBUTES[quest.attribute as keyof typeof ATTRIBUTES] && (
              <span className="flex items-center gap-1 text-blue-400">
                {/* @ts-ignore */}
                +{quest.xp_reward} {ATTRIBUTES[quest.attribute as keyof typeof ATTRIBUTES].label} XP
              </span>
            )}
          </div>
        </div>

        {showActions && !isCompleted && (
          <div className="flex flex-col gap-2 shrink-0">
            {onComplete && (
              <button
                // @ts-ignore
                onClick={() => onComplete(quest.id)}
                disabled={isCompleting}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                title="Complete Quest"
              >
                {isCompleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              </button>
            )}
            {onDelete && (
              <button
                // @ts-ignore
                onClick={() => onDelete(quest.id)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                title="Delete Quest"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
