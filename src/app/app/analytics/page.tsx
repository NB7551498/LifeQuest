import { createClient } from '@/lib/supabase/server';
import { AnalyticsCharts } from './analytics-charts';
import { redirect } from 'next/navigation';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch data
  const now = new Date();
  const startOfLast7Days = new Date(now);
  startOfLast7Days.setDate(now.getDate() - 6);
  startOfLast7Days.setHours(0, 0, 0, 0);

  // 1. Weekly XP
  const { data: completions } = await supabase
    .from('quest_completions')
    .select('xp_earned, completed_at')
    .eq('user_id', user.id)
    .gte('completed_at', startOfLast7Days.toISOString());
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyXp = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfLast7Days);
    d.setDate(d.getDate() + i);
    const dayStr = days[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];
    const xp = completions?.filter((c: any) => c.completed_at.startsWith(dateStr)).reduce((sum: number, c: any) => sum + c.xp_earned, 0) || 0;
    return { day: dayStr, xp };
  });

  // 2. Quest counts
  const { count: completedCount } = await supabase
    .from('quest_completions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: activeCount } = await supabase
    .from('quests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'active');

  // 3. Stats
  const { data: statsData } = await supabase
    .from('character_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const attributes = [
    { name: 'Strength', value: statsData?.strength || 1, icon: 'strength' },
    { name: 'Intellect', value: statsData?.intellect || 1, icon: 'intellect' },
    { name: 'Vitality', value: statsData?.vitality || 1, icon: 'vitality' },
    { name: 'Discipline', value: statsData?.discipline || 1, icon: 'discipline' },
    { name: 'Creativity', value: statsData?.creativity || 1, icon: 'creativity' },
    { name: 'Social', value: statsData?.social || 1, icon: 'social' },
  ];
  
  const bestAttribute = [...attributes].sort((a, b) => b.value - a.value)[0] || null;

  // 4. Recent completions
  const { data: recentCompletions } = await supabase
    .from('quest_completions')
    .select(`
      id,
      xp_earned,
      gold_earned,
      completed_at,
      quest:quests(title, attribute)
    `)
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(10);

  const totalCompletions = completedCount || 0;
  const totalActive = activeCount || 0;
  const completionRate = totalCompletions + totalActive > 0 
    ? Math.round((totalCompletions / (totalCompletions + totalActive)) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
          Analytics
        </h1>
        <p className="text-slate-400 mt-1">Track your progress and growth over time.</p>
      </div>
      
      <AnalyticsCharts 
        weeklyXp={weeklyXp}
        completionRate={completionRate}
        totalCompleted={totalCompletions}
        totalActive={totalActive}
        attributes={attributes}
        bestAttribute={bestAttribute}
        recentCompletions={recentCompletions || []}
      />
    </div>
  );
}
