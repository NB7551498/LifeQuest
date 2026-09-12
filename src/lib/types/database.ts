export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestStatus = 'active' | 'completed' | 'abandoned';
export type Attribute = 'intellect' | 'strength' | 'vitality' | 'discipline' | 'creativity' | 'social';
export type ItemType = 'weapon' | 'shield' | 'badge' | 'theme' | 'consumable';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type TransactionType = 'xp_earned' | 'gold_earned' | 'gold_spent' | 'achievement_xp' | 'achievement_gold' | 'streak_bonus';
export type AchievementCategory = 'quests' | 'streaks' | 'levels' | 'attributes' | 'economy';
export type ConditionType = 'quests_completed' | 'streak_days' | 'level_reached' | 'attribute_total' | 'gold_earned' | 'items_purchased' | 'quests_completed_daily';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  gold: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface CharacterStats {
  id: string;
  user_id: string;
  intellect: number;
  strength: number;
  vitality: number;
  discipline: number;
  creativity: number;
  social: number;
  updated_at: string;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: Difficulty;
  xp_reward: number;
  gold_reward: number;
  attribute: Attribute;
  status: QuestStatus;
  due_date: string | null;
  is_recurring: boolean;
  created_at: string;
  completed_at: string | null;
}

export interface QuestCompletion {
  id: string;
  quest_id: string;
  user_id: string;
  xp_earned: number;
  gold_earned: number;
  attribute_xp: number;
  completed_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  updated_at: string;
}

export interface Item {
  id: string;
  name: string;
  description: string | null;
  type: ItemType;
  rarity: Rarity;
  price: number;
  icon: string;
  effect: string | null;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  equipped: boolean;
  purchased_at: string;
  item?: Item; // joined
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  condition_type: ConditionType;
  condition_value: number;
  reward_xp: number;
  reward_gold: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement; // joined
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface UserProfile extends Profile {
  character_stats: CharacterStats;
  streak: Streak;
}

export interface QuestWithCompletion extends Quest {
  completions?: QuestCompletion[];
}

// API response types
export interface QuestCompleteResponse {
  quest: Quest;
  completion: QuestCompletion;
  profile: Profile;
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
  newTitle: string | null;
  streakResult: {
    currentStreak: number;
    longestStreak: number;
    isNewDay: boolean;
    milestone: { days: number; label: string; bonusXp: number; bonusGold: number } | null;
  };
  achievementsUnlocked: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rewardXp: number;
    rewardGold: number;
  }[];
  totalXpEarned: number;
  totalGoldEarned: number;
}

export interface PurchaseResponse {
  inventory: InventoryItem;
  newGoldBalance: number;
  transaction: Transaction;
}

export interface AnalyticsData {
  weeklyXp: { day: string; xp: number }[];
  completionRate: number;
  totalQuestsCompleted: number;
  totalQuestsActive: number;
  bestAttribute: { name: string; value: number } | null;
  attributeBreakdown: { name: string; value: number; icon: string }[];
  recentCompletions: QuestCompletion[];
}
