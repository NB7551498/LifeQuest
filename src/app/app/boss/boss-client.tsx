"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, ShieldAlert, Sparkles, Trophy, Skull, Flame, CheckCircle2 } from "lucide-react";
import { INITIAL_BOSSES, Boss, calculateQuestDamage } from "@/lib/rpg/boss-engine";

export default function BossClient() {
  const [bosses, setBosses] = useState<Boss[]>(INITIAL_BOSSES);
  const [activeBossId, setActiveBossId] = useState<string>("boss-exam");
  const [lastDamage, setLastDamage] = useState<number | null>(null);
  const [victoryBoss, setVictoryBoss] = useState<Boss | null>(null);

  const activeBoss = bosses.find((b) => b.id === activeBossId) || bosses[0];

  const handleAttackBoss = (damageAmount: number) => {
    setLastDamage(damageAmount);
    setTimeout(() => setLastDamage(null), 2000);

    setBosses((prev) =>
      prev.map((b) => {
        if (b.id === activeBoss.id) {
          const nextHp = Math.max(0, b.currentHp - damageAmount);
          if (nextHp === 0 && b.currentHp > 0) {
            setVictoryBoss(b);
          }
          return { ...b, currentHp: nextHp };
        }
        return b;
      })
    );
  };

  const hpPercentage = Math.round((activeBoss.currentHp / activeBoss.maxHp) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-500 to-orange-400">
            🐉 Productivity Boss Battles
          </h1>
          <p className="text-slate-400 mt-1">Complete your real-life quests to deal critical damage to epic bosses!</p>
        </div>
      </div>

      {/* Victory Modal */}
      <AnimatePresence>
        {victoryBoss && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.4)]"
            >
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto text-amber-400">
                <Trophy className="w-10 h-10 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">BOSS DEFEATED!</div>
                <h2 className="text-3xl font-black text-white">{victoryBoss.name}</h2>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-sm font-bold">
                <div className="text-amber-400 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>+{victoryBoss.rewardXp} XP</span>
                  <span className="text-yellow-400">+{victoryBoss.rewardGold} 🪙</span>
                </div>
                <div className="text-xs text-slate-300">Unlocked Title: <span className="text-amber-400">{victoryBoss.rewardTitle}</span></div>
              </div>

              <button
                onClick={() => setVictoryBoss(null)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:shadow-lg transition-all"
              >
                Claim Victory Loot
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Boss Battle Display */}
      <div className="bg-slate-900/90 border-2 border-red-500/40 rounded-3xl p-8 space-y-8 shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden">
        {/* Damage Indicator */}
        <AnimatePresence>
          {lastDamage !== null && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 z-20 text-5xl font-black text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] pointer-events-none"
            >
              -{lastDamage} HP 💥
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boss Switcher */}
        <div className="flex flex-wrap justify-center gap-3">
          {bosses.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBossId(b.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeBossId === b.id
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              <span>{b.icon}</span>
              <span>{b.name}</span>
            </button>
          ))}
        </div>

        {/* Boss Sprite & HP */}
        <div className="text-center space-y-6 py-4">
          <div className="text-8xl drop-shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse inline-block">
            {activeBoss.icon}
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white">{activeBoss.name}</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">{activeBoss.subtitle}</p>
          </div>

          {/* HP Bar */}
          <div className="max-w-xl mx-auto space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-red-400">BOSS HEALTH</span>
              <span className="text-white">{activeBoss.currentHp} / {activeBoss.maxHp} HP ({hpPercentage}%)</span>
            </div>
            <div className="h-6 w-full bg-slate-950 rounded-full p-1 border border-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: `${hpPercentage}%` }}
                animate={{ width: `${hpPercentage}%` }}
                className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)]"
              />
            </div>
          </div>
        </div>

        {/* Attack Simulator & Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-400" />
              <span>How to Damage Bosses:</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>Complete real-life <span className="text-emerald-400 font-bold">Easy Quests</span>: Deals <span className="text-white font-bold">15 HP</span></li>
              <li>Complete real-life <span className="text-amber-400 font-bold">Medium Quests</span>: Deals <span className="text-white font-bold">35 HP</span></li>
              <li>Complete real-life <span className="text-red-400 font-bold">Hard Quests</span>: Deals <span className="text-white font-bold">75 HP</span></li>
            </ul>
          </div>

          <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="text-sm font-bold text-white">Simulate Quest Strike:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAttackBoss(calculateQuestDamage("easy"))}
                className="py-2.5 px-3 bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all"
              >
                Easy Quest (-15)
              </button>
              <button
                onClick={() => handleAttackBoss(calculateQuestDamage("medium"))}
                className="py-2.5 px-3 bg-slate-800 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all"
              >
                Medium (-35)
              </button>
              <button
                onClick={() => handleAttackBoss(calculateQuestDamage("hard"))}
                className="py-2.5 px-3 bg-slate-800 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition-all"
              >
                Hard Quest (-75)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
