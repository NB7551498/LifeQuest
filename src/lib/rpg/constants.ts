export const DIFFICULTIES = {
  easy: { label: 'Easy', stars: 1, xpMultiplier: 1, goldMultiplier: 1 },
  medium: { label: 'Medium', stars: 2, xpMultiplier: 2, goldMultiplier: 2 },
  hard: { label: 'Hard', stars: 3, xpMultiplier: 3, goldMultiplier: 3 },
} as const;

export type Difficulty = keyof typeof DIFFICULTIES;

// Base rewards
export const BASE_XP = 30;
export const BASE_GOLD = 10;
export const BASE_ATTRIBUTE_XP = 10;

// Attributes
export const ATTRIBUTES = {
  intellect: { label: 'Intellect', icon: '🧠', color: 'blue' },
  strength: { label: 'Strength', icon: '💪', color: 'red' },
  vitality: { label: 'Vitality', icon: '❤️', color: 'green' },
  discipline: { label: 'Discipline', icon: '🎯', color: 'yellow' },
  creativity: { label: 'Creativity', icon: '✨', color: 'purple' },
  social: { label: 'Social', icon: '💬', color: 'pink' },
} as const;

export type Attribute = keyof typeof ATTRIBUTES;

// Quest categories with suggested attributes
export const CATEGORIES = {
  coding: { label: 'Coding', icon: '💻', suggestedAttribute: 'intellect' },
  learning: { label: 'Learning', icon: '📚', suggestedAttribute: 'intellect' },
  fitness: { label: 'Fitness', icon: '🏋️', suggestedAttribute: 'strength' },
  health: { label: 'Health', icon: '🏃', suggestedAttribute: 'vitality' },
  mindfulness: { label: 'Mindfulness', icon: '🧘', suggestedAttribute: 'discipline' },
  creative: { label: 'Creative', icon: '🎨', suggestedAttribute: 'creativity' },
  social: { label: 'Social', icon: '🤝', suggestedAttribute: 'social' },
  other: { label: 'Other', icon: '📋', suggestedAttribute: 'discipline' },
} as const;

export type Category = keyof typeof CATEGORIES;

// Rarity tiers
export const RARITIES = {
  common: { label: 'Common', color: '#9ca3af', bgClass: 'bg-gray-500/10 border-gray-500/30', borderColor: 'border-gray-500' },
  uncommon: { label: 'Uncommon', color: '#22c55e', bgClass: 'bg-green-500/10 border-green-500/30', borderColor: 'border-green-500' },
  rare: { label: 'Rare', color: '#3b82f6', bgClass: 'bg-blue-500/10 border-blue-500/30', borderColor: 'border-blue-500' },
  epic: { label: 'Epic', color: '#a855f7', bgClass: 'bg-purple-500/10 border-purple-500/30', borderColor: 'border-purple-500' },
  legendary: { label: 'Legendary', color: '#f59e0b', bgClass: 'bg-amber-500/10 border-amber-500/30', borderColor: 'border-amber-500' },
  mythic: { label: 'Mythic', color: '#ef4444', bgClass: 'bg-red-500/10 border-red-500/30', borderColor: 'border-red-500' },
} as const;

export type Rarity = keyof typeof RARITIES;

// Level-up rewards
export const LEVEL_UP_GOLD_BONUS = 50; // gold per level
export const LEVEL_UP_SKILL_POINTS = 1;

// Streak bonuses
export const STREAK_MILESTONES = [
  { days: 3, bonusXp: 50, bonusGold: 25, label: '3-Day Warrior' },
  { days: 7, bonusXp: 150, bonusGold: 100, label: 'Week Champion' },
  { days: 14, bonusXp: 300, bonusGold: 200, label: 'Fortnight Hero' },
  { days: 30, bonusXp: 500, bonusGold: 300, label: 'Monthly Legend' },
  { days: 60, bonusXp: 800, bonusGold: 500, label: 'Unstoppable Force' },
  { days: 100, bonusXp: 1500, bonusGold: 1000, label: 'Immortal' },
] as const;
