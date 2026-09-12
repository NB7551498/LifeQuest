"use client";

import { motion } from "framer-motion";
import { Brain, Dumbbell, Heart, Shield, Palette, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttributeBarProps {
  attribute: string;
  value: number;
  maxValue?: number;
  showLabel?: boolean;
  size?: "sm" | "md";
}

const ATTRIBUTE_CONFIG: Record<string, { color: string; icon: LucideIcon; label: string }> = {
  intellect: { color: "from-blue-500 to-cyan-400", icon: Brain, label: "Intellect" },
  strength: { color: "from-red-500 to-rose-400", icon: Dumbbell, label: "Strength" },
  vitality: { color: "from-green-500 to-emerald-400", icon: Heart, label: "Vitality" },
  discipline: { color: "from-yellow-500 to-amber-400", icon: Shield, label: "Discipline" },
  creativity: { color: "from-purple-500 to-fuchsia-400", icon: Palette, label: "Creativity" },
  social: { color: "from-pink-500 to-rose-400", icon: Users, label: "Social" },
};

export function AttributeBar({
  attribute,
  value,
  maxValue = 100,
  showLabel = true,
  size = "md",
}: AttributeBarProps) {
  const normalizedAttr = attribute.toLowerCase();
  const config = ATTRIBUTE_CONFIG[normalizedAttr] || { color: "from-slate-500 to-slate-400", icon: Brain, label: attribute };
  const Icon = config.icon;
  
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div className="flex items-center gap-3 w-full">
      {showLabel && (
        <div className="flex items-center gap-2 w-28 shrink-0">
          <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700">
            <Icon className="w-4 h-4 text-slate-300" />
          </div>
          <span className="text-sm font-medium text-slate-300 capitalize">{config.label}</span>
        </div>
      )}
      
      <div className="flex-1 flex items-center gap-3">
        <div className={cn("w-full bg-slate-800 rounded-full overflow-hidden", size === "sm" ? "h-1.5" : "h-2.5")}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className={cn("h-full rounded-full bg-gradient-to-r", config.color)}
          />
        </div>
        <div className="text-xs font-bold text-slate-400 w-8 text-right shrink-0">
          {value}
        </div>
      </div>
    </div>
  );
}
