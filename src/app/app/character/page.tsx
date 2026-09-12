import { createClient } from '@/lib/supabase/server';
import { calculateLevelFromXp } from '@/lib/rpg/xp-engine';
import { getTitleForLevel, getNextTitle } from '@/lib/rpg/title-engine';
import CharacterClient from './character-client';
import { DEMO_PROFILE, DEMO_INVENTORY } from '@/lib/auth/demo-helper';

export const metadata = {
  title: 'Character | LifeQuest',
};

export default async function CharacterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = DEMO_PROFILE;
  let stats = DEMO_PROFILE.character_stats;
  let streak = DEMO_PROFILE.streak;
  let equipped: any[] = DEMO_INVENTORY;
  let totalQuests = 12;

  if (user) {
    const [profileRes, statsRes, streakRes, equippedRes, questsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('character_stats').select('*').eq('user_id', user.id).single(),
      supabase.from('streaks').select('*').eq('user_id', user.id).single(),
      supabase.from('inventory').select('*, items(*)').eq('user_id', user.id).eq('equipped', true),
      supabase.from('quest_completions').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    ]);

    if (profileRes.data) profile = profileRes.data;
    if (statsRes.data) stats = statsRes.data;
    if (streakRes.data) streak = streakRes.data;
    if (equippedRes.data) equipped = equippedRes.data;
    if (questsRes.count) totalQuests = questsRes.count;
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
