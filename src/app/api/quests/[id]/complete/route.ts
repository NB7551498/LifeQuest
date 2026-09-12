import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateLevelFromXp } from '@/lib/rpg/xp-engine';
import { calculateStreak, getStreakBonus, checkStreakMilestone } from '@/lib/rpg/streak-engine';
import { checkNewAchievements } from '@/lib/rpg/achievement-engine';
import { getTitleForLevel } from '@/lib/rpg/title-engine';
import { LEVEL_UP_GOLD_BONUS } from '@/lib/rpg/constants';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;

    // Fetch quest
    const { data: quest, error: questError } = await supabase
      .from('quests')
      .select('*')
      .eq('id', id)
      .single();

    if (questError || !quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    if (quest.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (quest.status !== 'active') {
      return NextResponse.json({ error: 'Quest is not active' }, { status: 409 });
    }

    const adminSupabase = createAdminClient();

    const [{ data: profile }, { data: streak }, { data: characterStats }] = await Promise.all([
      adminSupabase.from('profiles').select('*').eq('id', user.id).single(),
      adminSupabase.from('streaks').select('*').eq('user_id', user.id).single(),
      adminSupabase.from('character_stats').select('*').eq('user_id', user.id).single()
    ]);

    if (!profile || !streak || !characterStats) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const xp = quest.xp_reward;
    const gold = quest.gold_reward;
    const attributeXp = quest.xp_reward;

    // Timezone-safe local date string (YYYY-MM-DD)
    const nowDate = new Date();
    const todayDateString = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}-${String(nowDate.getDate()).padStart(2, '0')}`;
    const now = nowDate.toISOString();

    const streakResult = calculateStreak(streak.last_activity_date, todayDateString, streak.current_streak, streak.longest_streak);
    const streakBonus = getStreakBonus(streakResult.currentStreak);
    const streakMilestone = checkStreakMilestone(streak.current_streak, streakResult.currentStreak);

    let totalXp = xp + streakBonus.bonusXp;
    let totalGold = gold + streakBonus.bonusGold;

    if (streakMilestone) {
      totalXp += streakMilestone.bonusXp;
      totalGold += streakMilestone.bonusGold;
    }

    const newTotalXp = profile.total_xp + totalXp;
    const newLevelInfo = calculateLevelFromXp(newTotalXp);
    const previousLevel = profile.level;
    const leveledUp = newLevelInfo.level > previousLevel;

    if (leveledUp) {
      totalGold += LEVEL_UP_GOLD_BONUS * (newLevelInfo.level - previousLevel);
    }

    const newTitle = getTitleForLevel(newLevelInfo.level);

    // Record the completion first (attribute_xp is NOT NULL in the schema)
    const { error: completionError } = await adminSupabase.from('quest_completions').insert({
      quest_id: id,
      user_id: user.id,
      completed_at: now,
      xp_earned: totalXp,
      gold_earned: totalGold,
      attribute_xp: attributeXp
    });
    if (completionError) throw completionError;

    // Recurring quests become available again (fresh daily/weekly quest).
    // Otherwise the quest is retired as completed.
    if (quest.is_recurring) {
      await adminSupabase.from('quests').update({ status: 'active', completed_at: null }).eq('id', id);
    } else {
      await adminSupabase.from('quests').update({ status: 'completed', completed_at: now }).eq('id', id);
    }

    await adminSupabase.from('profiles').update({
      total_xp: newTotalXp,
      gold: profile.gold + totalGold,
      level: newLevelInfo.level,
      title: newTitle
    }).eq('id', user.id);

    const attributeToUpdate = quest.attribute?.toLowerCase();
    if (attributeToUpdate && characterStats[attributeToUpdate] !== undefined) {
      await adminSupabase.from('character_stats').update({
        [attributeToUpdate]: characterStats[attributeToUpdate] + attributeXp
      }).eq('user_id', user.id);
    }

    await adminSupabase.from('streaks').update({
      current_streak: streakResult.currentStreak,
      longest_streak: Math.max(streak.longest_streak, streakResult.currentStreak),
      last_activity_date: todayDateString
    }).eq('user_id', user.id);

    await adminSupabase.from('transactions').insert([
      { user_id: user.id, type: 'xp_earned', amount: totalXp, description: 'quest_completion', reference_type: 'quest', reference_id: id },
      { user_id: user.id, type: 'gold_earned', amount: totalGold, description: 'quest_completion', reference_type: 'quest', reference_id: id }
    ]);

    const [
      { data: allAchievements },
      { data: userAchievements },
      { count: totalCompletions },
      { count: inventoryCount }
    ] = await Promise.all([
      adminSupabase.from('achievements').select('*'),
      adminSupabase.from('user_achievements').select('achievement_id').eq('user_id', user.id),
      adminSupabase.from('quest_completions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      adminSupabase.from('inventory').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    ]);

    const { count: completionsToday } = await adminSupabase
      .from('quest_completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('completed_at', `${todayDateString}T00:00:00.000Z`)
      .lte('completed_at', `${todayDateString}T23:59:59.999Z`);

    const { data: goldTransactions } = await adminSupabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('type', 'gold_earned');

    const totalGoldEarned = (goldTransactions || []).reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);

    let newAchievementsUnlocked: any[] = [];
    if (allAchievements && userAchievements) {
      const unlockedIdsArray = userAchievements.map((ua: any) => ua.achievement_id);
      const achievementStats = {
        totalQuestsCompleted: (totalCompletions || 0) + 1,
        currentStreak: streakResult.currentStreak,
        currentLevel: newLevelInfo.level,
        totalAttributeXp: characterStats
          ? { ...characterStats, [attributeToUpdate]: (characterStats[attributeToUpdate] || 0) + attributeXp }
          : {},
        totalGoldEarned: totalGoldEarned + totalGold,
        totalItemsPurchased: inventoryCount || 0,
        questsCompletedToday: (completionsToday || 0) + 1
      };

      newAchievementsUnlocked = checkNewAchievements(achievementStats, allAchievements, unlockedIdsArray);

      let finalTotalXp = newTotalXp;
      let finalGold = profile.gold + totalGold;
      let finalLevel = newLevelInfo.level;

      for (const ach of newAchievementsUnlocked) {
        await adminSupabase.from('user_achievements').insert({
          user_id: user.id,
          achievement_id: ach.id,
          unlocked_at: now
        });

        const achXp = ach.reward_xp || 0;
        const achGold = ach.reward_gold || 0;
        finalTotalXp += achXp;
        finalGold += achGold;
        // Recompute the level so achievement rewards can also push a level up
        finalLevel = calculateLevelFromXp(finalTotalXp).level;

        if (achXp > 0) {
          await adminSupabase.from('transactions').insert({
            user_id: user.id,
            type: 'achievement_xp',
            amount: achXp,
            description: 'Achievement reward',
            reference_type: 'achievement',
            reference_id: ach.id
          });
        }
        if (achGold > 0) {
          await adminSupabase.from('transactions').insert({
            user_id: user.id,
            type: 'achievement_gold',
            amount: achGold,
            description: 'Achievement reward',
            reference_type: 'achievement',
            reference_id: ach.id
          });
        }
      }

      // Persist the combined achievement rewards in a single write
      if (newAchievementsUnlocked.length > 0) {
        await adminSupabase.from('profiles').update({
          total_xp: finalTotalXp,
          gold: finalGold,
          level: finalLevel,
          title: getTitleForLevel(finalLevel)
        }).eq('id', user.id);
      }
    }

    return NextResponse.json({
      success: true,
      leveledUp,
      previousLevel,
      newLevel: newLevelInfo.level,
      rewards: {
        xp: totalXp,
        gold: totalGold,
        baseXp: xp,
        baseGold: gold,
        streakBonus,
        streakMilestone
      },
      newAchievements: newAchievementsUnlocked
    });
  } catch (error) {
    console.error('Error completing quest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
