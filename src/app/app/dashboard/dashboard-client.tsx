"use client";

import { useState } from "react";
import { XPBar } from "@/components/rpg/xp-bar";
import { StreakDisplay } from "@/components/rpg/streak-display";
import { GoldDisplay } from "@/components/rpg/gold-display";
import { QuestCard } from "@/components/rpg/quest-card";
import { QuestCompleteToast } from "@/components/rpg/quest-complete-toast";
import { LevelUpModal } from "@/components/rpg/level-up-modal";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { calculateLevelFromXp } from "@/lib/rpg/xp-engine";
import { getTitleForLevel } from "@/lib/rpg/title-engine";

type Profile = any;
type Streak = any;
type Quest = any;

interface DashboardClientProps {
  profile: Profile;
  streak: Streak | null;
  quests: Quest[];
  xpEarnedToday: number;
  questsCompletedToday: number;
}

export function DashboardClient({
  profile,
  streak,
  quests: initialQuests,
  xpEarnedToday,
  questsCompletedToday,
}: DashboardClientProps) {
  const [quests, setQuests] = useState(initialQuests);
  const [profileData, setProfileData] = useState(profile);
  const [toast, setToast] = useState<{ xp: number; gold: number; attributeXp: number; attributeName: string } | null>(null);
  const [levelUp, setLevelUp] = useState<{ newLevel: number; newTitle: string | null; goldReward: number } | null>(null);
  const supabase = createClient();
  const levelInfo = calculateLevelFromXp(profileData.total_xp || 0);

  const handleCompleteQuest = async (questId: string) => {
    const completedQuest = quests.find((q) => q.id === questId);

    // Optimistic update
    setQuests((prev) => prev.filter((q) => q.id !== questId));

    try {
      const response = await fetch(`/api/quests/${questId}/complete`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete quest");
      }

      // Live-update the character so XP / gold feel instant
      setProfileData((prev: any) => ({
        ...prev,
        gold: (prev.gold || 0) + (data.rewards?.gold || 0),
        total_xp: (prev.total_xp || 0) + (data.rewards?.xp || 0),
      }));

      // Celebratory feedback
      if (data.leveledUp) {
        setLevelUp({
          newLevel: data.newLevel,
          newTitle: getTitleForLevel(data.newLevel),
          goldReward: data.rewards?.gold || 0,
        });
      } else if (data.rewards) {
        setToast({
          xp: data.rewards.xp,
          gold: data.rewards.gold,
          attributeXp: completedQuest?.xp_reward || 0,
          attributeName: completedQuest?.attribute || "attribute",
        });
      }
    } catch (error) {
      console.error(error);
      // Revert on error
      const restoredQuest = initialQuests.find((q) => q.id === questId);
      if (restoredQuest) {
        setQuests((prev) => [...prev, restoredQuest]);
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {getGreeting()}, {profile.username}!
          </h1>
          <p className="text-slate-400">Ready to conquer the day?</p>
        </div>
        <div className="flex gap-4">
          <GoldDisplay amount={profileData.gold} />
          {streak && <StreakDisplay currentStreak={streak.current_streak} longestStreak={streak.longest_streak} />}
        </div>
      </div>

      {/* Level and XP */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl">
        <XPBar 
          currentXp={levelInfo.currentLevelXp} 
          requiredXp={levelInfo.xpForNextLevel} 
          level={levelInfo.level} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Today's Quests */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Today's Quests</h2>
            <Link 
              href="/quests/new" 
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              + Create Quest
            </Link>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {quests.length > 0 ? (
                quests.map((quest) => (
                  <motion.div
                    key={quest.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <QuestCard 
                      quest={quest} 
                      onComplete={() => handleCompleteQuest(quest.id)} 
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-8 text-center text-slate-400"
                >
                  <p>No quests for today. Create one!</p>
                  <Link 
                    href="/quests/new" 
                    className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                  >
                    Create Quest
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Quick Stats</h2>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Quests Completed Today</p>
              <p className="text-2xl font-bold text-white">{questsCompletedToday}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">XP Earned Today</p>
              <p className="text-2xl font-bold text-green-400">+{xpEarnedToday} XP</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Current Streak</p>
              <p className="text-2xl font-bold text-orange-400">
                {streak?.current_streak || 0} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quest completion toast */}
      <AnimatePresence>
        {toast && (
          <QuestCompleteToast
            xpEarned={toast.xp}
            goldEarned={toast.gold}
            attributeXp={toast.attributeXp}
            attributeName={toast.attributeName}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Level up celebration */}
      <LevelUpModal
        isOpen={!!levelUp}
        onClose={() => setLevelUp(null)}
        newLevel={levelUp?.newLevel ?? 1}
        newTitle={levelUp?.newTitle ?? null}
        goldReward={levelUp?.goldReward ?? 0}
      />
    </div>
  );
}
