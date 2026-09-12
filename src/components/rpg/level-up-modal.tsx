"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  newTitle: string | null;
  goldReward: number;
}

export function LevelUpModal({
  isOpen,
  onClose,
  newLevel,
  newTitle,
  goldReward,
}: LevelUpModalProps) {
  const [particles, setParticles] = useState<{ id: number; left: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 0.5}s`,
        duration: `${1 + Math.random() * 2}s`,
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="relative z-10 w-full max-w-sm p-8 bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] text-center overflow-hidden"
          >
            {/* Particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full animate-float-up"
                style={{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  bottom: "-10px",
                  opacity: 0,
                  animation: "floatUp var(--duration) ease-in infinite",
                  "--duration": p.duration,
                } as any}
              />
            ))}
            
            <style jsx>{`
              @keyframes floatUp {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-200px); opacity: 0; }
              }
            `}</style>

            <div className="flex justify-center mb-4">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Sparkles className="w-12 h-12 text-amber-400" />
              </div>
            </div>

            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 animate-pulse mb-2 tracking-wider drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
              ✨ LEVEL UP ✨
            </h2>

            <div className="text-6xl font-black text-white my-6 drop-shadow-lg">
              {newLevel}
            </div>

            {newTitle && (
              <div className="mb-6">
                <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">New Title Unlocked</div>
                <div className="text-xl font-bold text-amber-400">{newTitle}</div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold text-xl mb-8 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <Coins className="w-6 h-6" />
              <span>+{goldReward} Gold</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Continue Adventure
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
