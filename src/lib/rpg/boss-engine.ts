export interface Boss {
  id: string;
  name: string;
  subtitle: string;
  maxHp: number;
  currentHp: number;
  icon: string;
  rewardXp: number;
  rewardGold: number;
  rewardTitle: string;
  requiredQuestsToDamage: string[];
}

export const INITIAL_BOSSES: Boss[] = [
  {
    id: 'boss-exam',
    name: 'Examination Boss',
    subtitle: 'Threatens academic progression. Defeat by completing study quests!',
    maxHp: 200,
    currentHp: 120,
    icon: '🐉',
    rewardXp: 350,
    rewardGold: 200,
    rewardTitle: 'Master Scholar',
    requiredQuestsToDamage: ['learning', 'coding'],
  },
  {
    id: 'boss-project',
    name: 'Semester Project Boss',
    subtitle: 'A massive architectural beast requiring multi-stage quest execution.',
    maxHp: 400,
    currentHp: 280,
    icon: '👹',
    rewardXp: 800,
    rewardGold: 500,
    rewardTitle: 'Architect of Legend',
    requiredQuestsToDamage: ['coding', 'creative'],
  },
  {
    id: 'boss-procrastination',
    name: 'Procrastination Demon',
    subtitle: 'Feeds on delayed tasks. Striking active quests drains its dark energy!',
    maxHp: 300,
    currentHp: 180,
    icon: '👾',
    rewardXp: 500,
    rewardGold: 300,
    rewardTitle: 'Dragon Slayer',
    requiredQuestsToDamage: ['fitness', 'mindfulness', 'other'],
  },
];

/**
 * Calculates damage dealt to an active boss when a real-life quest is completed.
 */
export function calculateQuestDamage(difficulty: 'easy' | 'medium' | 'hard'): number {
  switch (difficulty) {
    case 'easy':
      return 15;
    case 'medium':
      return 35;
    case 'hard':
      return 75;
    default:
      return 20;
  }
}
