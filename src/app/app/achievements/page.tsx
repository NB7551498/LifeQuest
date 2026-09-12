import { createClient } from '@/lib/supabase/server';
import { calculateLevelFromXp } from '@/lib/rpg/xp-engine';
import AchievementsClient from './achievements-client';
import { DEMO_ACHIEVEMENTS, DEMO_USER_ACHIEVEMENTS, DEMO_PROFILE } from '@/lib/auth/demo-helper';

export const metadata = {
  title: 'Achievements | LifeQuest',
};

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let achievements = DEMO_ACHIEVEMENTS;
  let userAchievements = DEMO_USER_ACHIEVEMENTS;
  let profileTotalXp = DEMO_PROFILE.total_xp;
  let stats: any = DEMO_PROFILE.character_stats;
  let currentStreak = DEMO_PROFILE.streak.current_streak;
  let totalQuests = 12;
  let totalItems = 2;
  let totalGoldEarned = 850;

  if (user) {
    const [
      achievementsRes, 
      userAchievementsRes, 
      profileRes,
      statsRes,
      streakRes,
      questsRes,
      transactionsRes,
      inventoryRes
    ] = await Promise.all([
      supabase.from('achievements').select('*').order('name'),
      supabase.from('user_achievements').select('*').eq('user_id', user.id),
      supabase.from('profiles').select('total_xp').eq('id', user.id).single(),
      supabase.from('character_stats').select('*').eq('user_id', user.id).single(),
      supabase.from('streaks').select('current_streak').eq('user_id', user.id).single(),
      supabase.from('quest_completions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'gold_earned'),
      supabase.from('inventory').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    ]);

    if (achievementsRes.data && achievementsRes.data.length > 0) achievements = achievementsRes.data;
    if (userAchievementsRes.data) userAchievements = userAchievementsRes.data;
    if (profileRes.data) profileTotalXp = profileRes.data.total_xp;
    if (statsRes.data) stats = statsRes.data;
    if (streakRes.data) currentStreak = streakRes.data.current_streak;
    if (questsRes.count) totalQuests = questsRes.count;
    if (inventoryRes.count) totalItems = inventoryRes.count;
    if (transactionsRes.data) totalGoldEarned = (transactionsRes.data || []).reduce((sum, tx) => sum + (tx.amount || 0), 0);
  }

  const { level } = calculateLevelFromXp(profileTotalXp || 0);

  const userStats = {
    level,
    quests: totalQuests,
    streak: currentStreak,
    gold: totalGoldEarned,
    items: totalItems,
    intellect: stats.intellect || 0,
    strength: stats.strength || 0,
    vitality: stats.vitality || 0,
    discipline: stats.discipline || 0,
    creativity: stats.creativity || 0,
    social: stats.social || 0
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <AchievementsClient 
        achievements={achievements} 
        userAchievements={userAchievements} 
        userStats={userStats} 
      />
    </div>
  );
}
