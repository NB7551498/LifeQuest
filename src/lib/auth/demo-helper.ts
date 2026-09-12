import { calculateLevelFromXp } from '@/lib/rpg/xp-engine';

export function isDemoEnvironment(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return (
    !url ||
    url.includes('your-project') ||
    url.includes('placeholder') ||
    url === 'https://your-project.supabase.co'
  );
}

export interface DemoUser {
  id: string;
  email: string;
  username: string;
}

export const DEFAULT_DEMO_USER: DemoUser = {
  id: 'demo-hero-id',
  email: 'hero@example.com',
  username: 'HeroAdventurer',
};

export const DEMO_PROFILE = {
  id: 'demo-hero-id',
  username: 'HeroAdventurer',
  email: 'hero@example.com',
  avatar_url: null,
  level: 12,
  total_xp: 2480,
  gold: 450,
  title: 'Journeyman',
  created_at: new Date().toISOString(),
  levelInfo: calculateLevelFromXp(2480),
  character_stats: {
    user_id: 'demo-hero-id',
    intellect: 82,
    strength: 71,
    vitality: 87,
    discipline: 76,
    creativity: 58,
    social: 64,
  },
  streak: {
    user_id: 'demo-hero-id',
    current_streak: 14,
    longest_streak: 14,
    last_activity_date: new Date().toISOString().split('T')[0],
  },
};

export const DEMO_QUESTS = [
  {
    id: 'demo-quest-1',
    user_id: 'demo-hero-id',
    title: 'Complete DBMS Assignment',
    description: 'Finish normalization, ER diagrams, and SQL practice queries',
    category: 'learning',
    difficulty: 'hard',
    xp_reward: 90,
    gold_reward: 30,
    attribute: 'intellect',
    status: 'active',
    due_date: `${new Date().toISOString().split('T')[0]}T23:59:59`,
    is_recurring: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-quest-2',
    user_id: 'demo-hero-id',
    title: '30 Minute High-Intensity Workout',
    description: 'Pushups, pullups, core training, and 15 min cardio sprint',
    category: 'fitness',
    difficulty: 'medium',
    xp_reward: 60,
    gold_reward: 20,
    attribute: 'strength',
    status: 'active',
    due_date: `${new Date().toISOString().split('T')[0]}T23:59:59`,
    is_recurring: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-quest-3',
    user_id: 'demo-hero-id',
    title: 'Morning Mindfulness & Meditation',
    description: '15 minutes of deep breathing and daily objective setting',
    category: 'mindfulness',
    difficulty: 'easy',
    xp_reward: 30,
    gold_reward: 10,
    attribute: 'discipline',
    status: 'completed',
    due_date: `${new Date().toISOString().split('T')[0]}T23:59:59`,
    is_recurring: true,
    created_at: new Date().toISOString(),
  },
];

export const DEMO_ITEMS = [
  {
    id: 'item-iron-shield',
    name: 'Iron Shield',
    description: 'A sturdy shield providing protection against laziness.',
    type: 'shield',
    price: 250,
    rarity: 'uncommon',
    icon: '🛡️',
  },
  {
    id: 'item-shadow-sword',
    name: 'Shadow Sword',
    description: 'Slices through tough procrastination tasks.',
    type: 'weapon',
    price: 500,
    rarity: 'rare',
    icon: '⚔️',
  },
  {
    id: 'item-night-theme',
    name: 'Cyber Night Theme',
    description: 'Unlocks custom neon dark aesthetic visuals.',
    type: 'theme',
    price: 750,
    rarity: 'epic',
    icon: '🌌',
  },
  {
    id: 'item-hero-badge',
    name: 'Hero Badge',
    description: 'Proof of legendary dedication.',
    type: 'badge',
    price: 1000,
    rarity: 'legendary',
    icon: '👑',
  },
];

export const DEMO_INVENTORY = [
  {
    id: 'inv-1',
    user_id: 'demo-hero-id',
    item_id: 'item-shadow-sword',
    quantity: 1,
    equipped: true,
    items: DEMO_ITEMS[1],
  },
  {
    id: 'inv-2',
    user_id: 'demo-hero-id',
    item_id: 'item-iron-shield',
    quantity: 1,
    equipped: false,
    items: DEMO_ITEMS[0],
  },
];

export const DEMO_ACHIEVEMENTS = [
  {
    id: 'first_quest',
    name: 'First Blood',
    description: 'Complete your first quest',
    icon: '⚔️',
    reward_xp: 50,
    reward_gold: 25,
  },
  {
    id: 'streak_7',
    name: 'On Fire',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    reward_xp: 150,
    reward_gold: 100,
  },
  {
    id: 'level_10',
    name: 'Adventurer Unleashed',
    description: 'Reach Level 10',
    icon: '🌟',
    reward_xp: 300,
    reward_gold: 200,
  },
  {
    id: 'scholar_100',
    name: 'Scholar',
    description: 'Reach 80 Intellect',
    icon: '🧠',
    reward_xp: 200,
    reward_gold: 150,
  },
];

export const DEMO_USER_ACHIEVEMENTS = [
  {
    user_id: 'demo-hero-id',
    achievement_id: 'first_quest',
    unlocked_at: new Date().toISOString(),
  },
  {
    user_id: 'demo-hero-id',
    achievement_id: 'streak_7',
    unlocked_at: new Date().toISOString(),
  },
];
