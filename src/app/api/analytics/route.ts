import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoIso = sevenDaysAgo.toISOString();

    const [
      { data: completions },
      { count: totalQuests },
      { count: completedQuests },
      { data: characterStats },
      { data: recentCompletions }
    ] = await Promise.all([
      supabase.from('quest_completions').select('completed_at, xp_earned').eq('user_id', user.id).gte('completed_at', sevenDaysAgoIso),
      supabase.from('quests').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('quests').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
      supabase.from('character_stats').select('*').eq('user_id', user.id).single(),
      supabase.from('quest_completions').select('*, quest:quests(*)').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(10)
    ]);

    const weeklyXp = (completions || []).reduce((acc: any, curr) => {
      const date = curr.completed_at.split('T')[0];
      acc[date] = (acc[date] || 0) + curr.xp_earned;
      return acc;
    }, {});

    const completionRate = totalQuests && totalQuests > 0 
      ? ((completedQuests || 0) / totalQuests) * 100 
      : 0;

    return NextResponse.json({
      weeklyXp,
      totalQuests: totalQuests || 0,
      completedQuests: completedQuests || 0,
      completionRate,
      characterStats,
      recentCompletions
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
