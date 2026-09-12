import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateLevelFromXp } from '@/lib/rpg/xp-engine';
import { calculateStreak, getStreakBonus, checkStreakMilestone } from '@/lib/rpg/streak-engine';
import { getTitleForLevel } from '@/lib/rpg/title-engine';
import { LEVEL_UP_GOLD_BONUS } from '@/lib/rpg/constants';
import { readDB, writeDB } from '@/lib/storage/json-db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch quest
        const { data: quest, error: questError } = await supabase
          .from('quests')
          .select('*')
          .eq('id', id)
          .single();

        if (!questError && quest && quest.user_id === user.id && quest.status === 'active') {
          const adminSupabase = createAdminClient();
          const [{ data: profile }, { data: streak }, { data: characterStats }] = await Promise.all([
            adminSupabase.from('profiles').select('*').eq('id', user.id).single(),
            adminSupabase.from('streaks').select('*').eq('user_id', user.id).single(),
            adminSupabase.from('character_stats').select('*').eq('user_id', user.id).single()
          ]);

          if (profile && streak && characterStats) {
            const xp = quest.xp_reward;
            const gold = quest.gold_reward;
            const nowDate = new Date();
            const todayDateString = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}-${String(nowDate.getDate()).padStart(2, '0')}`;
            const now = nowDate.toISOString();

            const streakResult = calculateStreak(streak.last_activity_date, todayDateString, streak.current_streak, streak.longest_streak);
            const streakBonus = getStreakBonus(streakResult.currentStreak);
            let totalXp = xp + streakBonus.bonusXp;
            let totalGold = gold + streakBonus.bonusGold;

            const newTotalXp = profile.total_xp + totalXp;
            const newLevelInfo = calculateLevelFromXp(newTotalXp);
            const previousLevel = profile.level;
            const leveledUp = newLevelInfo.level > previousLevel;
            if (leveledUp) totalGold += LEVEL_UP_GOLD_BONUS * (newLevelInfo.level - previousLevel);

            if (quest.is_recurring) {
              await adminSupabase.from('quests').update({ status: 'active', completed_at: null }).eq('id', id);
            } else {
              await adminSupabase.from('quests').update({ status: 'completed', completed_at: now }).eq('id', id);
            }

            await adminSupabase.from('profiles').update({
              total_xp: newTotalXp,
              gold: profile.gold + totalGold,
              level: newLevelInfo.level,
              title: getTitleForLevel(newLevelInfo.level)
            }).eq('id', user.id);

            return NextResponse.json({
              success: true,
              leveledUp,
              previousLevel,
              newLevel: newLevelInfo.level,
              rewards: { xp: totalXp, gold: totalGold, baseXp: xp, baseGold: gold }
            });
          }
        }
      }
    } catch {}

    // Fallback to local persistent JSON DB
    const db = readDB();
    const questIndex = db.quests.findIndex((q) => q.id === id);

    if (questIndex === -1) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    const quest = db.quests[questIndex];
    if (!quest.is_recurring) {
      db.quests[questIndex].status = 'completed';
    }

    const xp = quest.xp_reward || 50;
    const gold = quest.gold_reward || 20;

    const currentProfile = db.profile || {};
    const newTotalXp = (currentProfile.total_xp || 1000) + xp;
    const newLevelInfo = calculateLevelFromXp(newTotalXp);
    const previousLevel = currentProfile.level || 1;
    const leveledUp = newLevelInfo.level > previousLevel;
    const newGold = (currentProfile.gold || 100) + gold + (leveledUp ? 50 : 0);

    const updatedProfile = {
      ...currentProfile,
      total_xp: newTotalXp,
      level: newLevelInfo.level,
      gold: newGold,
      title: getTitleForLevel(newLevelInfo.level),
      character_stats: {
        ...(currentProfile.character_stats || {}),
        [quest.attribute || 'intellect']: ((currentProfile.character_stats?.[quest.attribute || 'intellect']) || 50) + xp
      }
    };

    db.profile = updatedProfile;
    writeDB(db);

    return NextResponse.json({
      success: true,
      leveledUp,
      previousLevel,
      newLevel: newLevelInfo.level,
      rewards: { xp, gold, baseXp: xp, baseGold: gold },
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error completing quest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
