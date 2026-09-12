"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ShieldCheck, Dumbbell, Coins, Target } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemAnim = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
};

const CATEGORIES = ['All', 'Quests', 'Streaks', 'Levels', 'Attributes', 'Economy'];

export default function AchievementsClient({ achievements, userAchievements, userStats }: any) {
  const [category, setCategory] = useState('All');

  // Helper to map category to icon
  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'quests': return Target;
      case 'streaks': return Star;
      case 'levels': return Trophy;
      case 'attributes': return Dumbbell;
      case 'economy': return Coins;
      default: return ShieldCheck;
    }
  };

  // Helper to compute progress
  const getProgress = (achievement: any) => {
    const target = achievement.condition_value || 1;
    const type = (achievement.condition_type || achievement.category || '').toLowerCase();

    const pct = (current: number) => Math.min(100, Math.max(0, (current / target) * 100));

    // Order matters: 'quests_completed_daily' also contains 'quests_completed'
    if (type.includes('quests_completed_daily')) return pct(userStats.quests);
    if (type.includes('quests_completed')) return pct(userStats.quests);
    if (type.includes('streak')) return pct(userStats.streak);
    if (type.includes('level')) return pct(userStats.level);
    if (type.includes('items_purchased')) return pct(userStats.items);
    if (type.includes('gold_earned')) return pct(userStats.gold);
    if (type.includes('attribute_total')) {
      const best = Math.max(userStats.intellect, userStats.strength, userStats.vitality, userStats.discipline, userStats.creativity, userStats.social);
      return pct(best);
    }

    // Fallback: Check if it's already unlocked in userAchievements
    const isUnlocked = userAchievements.some((ua: any) => ua.achievement_id === achievement.id);
    return isUnlocked ? 100 : 0;
  };

  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;

  let filtered = achievements.filter((a: any) => 
    category === 'All' || (a.category && a.category.toLowerCase() === category.toLowerCase())
  );

  // Sort: unlocked first, then by target value or name
  filtered.sort((a: any, b: any) => {
    const aUnlocked = userAchievements.some((ua: any) => ua.achievement_id === a.id);
    const bUnlocked = userAchievements.some((ua: any) => ua.achievement_id === b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return (a.condition_value || 0) - (b.condition_value || 0) || a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            Achievements
          </h1>
          <p className="text-slate-400 mt-1">Unlock epic rewards by completing milestones.</p>
        </div>
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl px-6 py-3 flex items-center gap-4 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Completion</p>
            <p className="text-xl font-bold text-amber-400">{unlockedCount} / {totalCount}</p>
          </div>
          <div className="h-10 w-px bg-slate-800"></div>
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path strokeDasharray="100, 100" className="text-slate-800" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path strokeDasharray={`${(unlockedCount / Math.max(1, totalCount)) * 100}, 100`} className="text-amber-500" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-200">
              {Math.round((unlockedCount / Math.max(1, totalCount)) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              category === cat 
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" 
                : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <AnimatePresence>
          {filtered.map((achievement: any) => {
            const userAch = userAchievements.find((ua: any) => ua.achievement_id === achievement.id);
            const isUnlocked = !!userAch;
            const progress = isUnlocked ? 100 : getProgress(achievement);
            const Icon = getCategoryIcon(achievement.category || 'misc');

            return (
              <motion.div 
                key={achievement.id}
                layout
                variants={itemAnim}
                className={cn(
                  "relative overflow-hidden border rounded-2xl p-5 flex items-start gap-4 transition-all",
                  isUnlocked 
                    ? "bg-slate-900/80 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
                    : "bg-slate-900/40 border-slate-800 opacity-75 grayscale hover:grayscale-0 hover:opacity-100"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border-2",
                  isUnlocked ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-500"
                )}>
                  {achievement.icon_url ? (
                    <img src={achievement.icon_url} alt="" className="w-8 h-8 object-contain" />
                  ) : (
                    <Icon className="w-7 h-7" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn("text-lg font-bold truncate", isUnlocked ? "text-white" : "text-slate-300")}>
                      {achievement.name}
                    </h3>
                    {isUnlocked && userAch?.unlocked_at && (
                      <span className="text-[10px] text-amber-500/80 font-semibold whitespace-nowrap ml-2 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {formatDate(userAch.unlocked_at)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">{achievement.description}</p>
                  
                  {/* Rewards */}
                  <div className="flex items-center gap-3 mb-3">
                    {achievement.xp_reward > 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                        <Star className="w-3 h-3" /> +{achievement.xp_reward} XP
                      </span>
                    )}
                    {achievement.gold_reward > 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-md">
                        <Coins className="w-3 h-3" /> +{achievement.gold_reward} Gold
                      </span>
                    )}
                  </div>

                  {/* Progress Bar (if locked) */}
                  {!isUnlocked && (
                    <div className="w-full">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-medium">
                        <span>Progress</span>
                        <span>{Math.floor(progress)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-500 transition-all duration-1000 ease-out"
                          style={{ width: `${Math.max(2, progress)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed">
            <p className="text-slate-400">No achievements found in this category.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
