import { createClient } from '@/lib/supabase/server';
import { calculateLevelFromXp } from '@/lib/rpg/xp-engine';
import AchievementsClient from './achievements-client';

export const metadata = {
  title: 'Achievements | LifeQuest',
};

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-slate-400">Not authenticated</div>;
  }

  // Fetch all required data in parallel
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

  const achievements = achievementsRes.data || [];
  const userAchievements = userAchievementsRes.data || [];
  const profile = profileRes.data;
  const stats = statsRes.data || {};
  const currentStreak = streakRes.data?.current_streak || 0;
  const totalQuests = questsRes.count || 0;
  const totalItems = inventoryRes.count || 0;
  
  // Calculate total gold earned
  const totalGoldEarned = (transactionsRes.data || []).reduce((sum, tx) => sum + (tx.amount || 0), 0);
  
  const { level } = calculateLevelFromXp(profile?.total_xp || 0);

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
