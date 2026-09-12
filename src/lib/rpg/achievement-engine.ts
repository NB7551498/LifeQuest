export interface AchievementCheck {
  totalQuestsCompleted: number;
  currentStreak: number;
  currentLevel: number;
  totalAttributeXp: Record<string, number>;
  totalGoldEarned: number;
  totalItemsPurchased: number;
  questsCompletedToday: number;
}

export interface UnlockedAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rewardXp: number;
  rewardGold: number;
}

// In a real application, you might define Achievement criteria structure here.
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rewardXp: number;
  rewardGold: number;
  // Evaluate checks if the stats meet the requirement for this achievement
  evaluate: (stats: AchievementCheck) => boolean;
}

/**
 * Evaluates current stats against all achievements to find newly unlocked ones.
 * 
 * @param stats - The player's current cumulative statistics.
 * @param allAchievements - The complete list of available achievements.
 * @param alreadyUnlocked - Array of achievement IDs that have already been unlocked.
 * @returns Array of newly unlocked achievements.
 */
export function checkNewAchievements(
  stats: AchievementCheck,
  allAchievements: Achievement[],
  alreadyUnlocked: string[]
): UnlockedAchievement[] {
  const newUnlocks: UnlockedAchievement[] = [];
  
  for (const achievement of allAchievements) {
    if (!alreadyUnlocked.includes(achievement.id)) {
      const isMet = achievement.evaluate(stats);
      if (isMet) {
        newUnlocks.push({
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          rewardXp: achievement.rewardXp,
          rewardGold: achievement.rewardGold,
        });
      }
    }
  }
  
  return newUnlocks;
}
