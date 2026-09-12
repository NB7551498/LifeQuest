"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, Coins, Brain } from "lucide-react";

interface QuestCompleteToastProps {
  xpEarned: number;
  goldEarned: number;
  attributeXp: number;
  attributeName: string;
  onClose: () => void;
}

export function QuestCompleteToast({
  xpEarned,
  goldEarned,
  attributeXp,
  attributeName,
  onClose,
}: QuestCompleteToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, x: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="fixed top-4 right-4 z-50 w-72 bg-slate-900 border border-green-500/50 rounded-xl shadow-[0_5px_25px_rgba(34,197,94,0.15)] overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="flex items-center gap-2 font-bold text-green-400">
              <div className="bg-green-500/20 p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
              Quest Complete!
            </h4>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 pl-8 mt-3">
            {xpEarned > 0 && (
              <div className="flex items-center gap-2 text-sm text-amber-500 font-medium">
                <Zap className="w-4 h-4" />
                <span>+{xpEarned} XP</span>
              </div>
            )}
            
            {goldEarned > 0 && (
              <div className="flex items-center gap-2 text-sm text-yellow-400 font-medium">
                <Coins className="w-4 h-4" />
                <span>+{goldEarned} Gold</span>
              </div>
            )}
            
            {attributeXp > 0 && attributeName && (
              <div className="flex items-center gap-2 text-sm text-blue-400 font-medium capitalize">
                <Brain className="w-4 h-4" />
                <span>+{attributeXp} {attributeName} XP</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
