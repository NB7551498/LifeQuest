import { Difficulty, DIFFICULTIES, BASE_XP, BASE_GOLD, BASE_ATTRIBUTE_XP } from './constants';

export interface LevelInfo {
  level: number;
  currentLevelXp: number;  // XP earned within current level
  xpForNextLevel: number;  // total XP needed for next level
  progress: number;        // 0 to 1
  totalXp: number;
}

export interface QuestRewards {
  xp: number;
  gold: number;
  attributeXp: number;
}

/**
 * Returns the amount of XP needed to complete a specific level.
 * @param level - The level for which to calculate the XP requirement.
 * @returns The XP required for this level.
 */
export function xpRequiredForLevel(level: number): number {
  if (level < 1) return 0;
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculates the total cumulative XP needed to reach a specific level.
 * @param level - The target level.
 * @returns The total cumulative XP.
 */
export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpRequiredForLevel(i);
  }
  return total;
}

/**
 * Calculates level progress and information based on total accumulated XP.
 * @param totalXp - The total XP accumulated by the player.
 * @returns Comprehensive level information including progress.
 */
export function calculateLevelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  let accumulatedXp = 0;
  
  while (true) {
    const requiredForCurrentLevel = xpRequiredForLevel(level);
    if (totalXp >= accumulatedXp + requiredForCurrentLevel) {
      accumulatedXp += requiredForCurrentLevel;
      level++;
    } else {
      break;
    }
  }

  const xpForNextLevel = xpRequiredForLevel(level);
  const currentLevelXp = totalXp - accumulatedXp;
  const progress = currentLevelXp / xpForNextLevel;

  return {
    level,
    currentLevelXp,
    xpForNextLevel,
    progress,
    totalXp,
  };
}

/**
 * Returns the XP required to reach the next level from the start of the current level.
 * @param currentLevel - The player's current level.
 * @returns The XP needed to advance to the next level.
 */
export function getXpForNextLevel(currentLevel: number): number {
  return xpRequiredForLevel(currentLevel);
}

/**
 * Calculates the base rewards for a quest based on its difficulty.
 * @param difficulty - The difficulty tier of the quest.
 * @returns The rewards containing XP, gold, and attribute XP.
 */
export function calculateQuestRewards(difficulty: Difficulty): QuestRewards {
  const config = DIFFICULTIES[difficulty];
  if (!config) {
    return { xp: BASE_XP, gold: BASE_GOLD, attributeXp: BASE_ATTRIBUTE_XP };
  }

  return {
    xp: Math.floor(BASE_XP * config.xpMultiplier),
    gold: Math.floor(BASE_GOLD * config.goldMultiplier),
    attributeXp: Math.floor(BASE_ATTRIBUTE_XP * config.xpMultiplier),
  };
}
