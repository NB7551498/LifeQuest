import { createClient } from '@/lib/supabase/server';
import { calculateLevelFromXp } from '@/lib/rpg/xp-engine';
import { getTitleForLevel, getNextTitle } from '@/lib/rpg/title-engine';
import CharacterClient from './character-client';

export const metadata = {
  title: 'Character | LifeQuest',
};

export default async function CharacterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-slate-400">Not authenticated</div>;
  }

  const [profileRes, statsRes, streakRes, equippedRes, questsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('character_stats').select('*').eq('user_id', user.id).single(),
    supabase.from('streaks').select('*').eq('user_id', user.id).single(),
    supabase.from('inventory').select('*, items(*)').eq('user_id', user.id).eq('equipped', true),
    supabase.from('quest_completions').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  ]);

  const profile = profileRes.data;
  const stats = statsRes.data;
  const streak = streakRes.data;
  const equipped = equippedRes.data || [];
  const totalQuests = questsRes.count || 0;

  if (!profile || !stats) {
    return <div className="p-8 text-slate-400">Failed to load character data.</div>;
  }

  const { level, currentLevelXp, xpForNextLevel, progress } = calculateLevelFromXp(profile.total_xp || 0);
  const title = getTitleForLevel(level);
  const nextTitle = getNextTitle(level);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <CharacterClient
        profile={profile}
        stats={stats}
        streak={streak}
        equipped={equipped}
        level={level}
        currentXp={currentLevelXp}
        xpForNextLevel={xpForNextLevel}
        progress={progress}
        title={title}
        nextTitle={nextTitle}
        totalQuests={totalQuests}
      />
    </div>
  );
}
