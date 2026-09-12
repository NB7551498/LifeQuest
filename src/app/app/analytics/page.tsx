import { createClient } from '@/lib/supabase/server';
import { AnalyticsCharts } from './analytics-charts';
import { DEMO_PROFILE } from '@/lib/auth/demo-helper';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let completions: any[] = [];
  let totalCompletions = 12;
  let totalActive = 2;
  let statsData: any = DEMO_PROFILE.character_stats;
  let recentCompletions: any[] = [
    { id: 'c-1', xp_earned: 90, gold_earned: 30, completed_at: new Date().toISOString(), quest: { title: 'DBMS Normalization', attribute: 'intellect' } },
    { id: 'c-2', xp_earned: 60, gold_earned: 20, completed_at: new Date().toISOString(), quest: { title: '30 Min Workout', attribute: 'strength' } },
  ];

  const now = new Date();
  const startOfLast7Days = new Date(now);
  startOfLast7Days.setDate(now.getDate() - 6);
  startOfLast7Days.setHours(0, 0, 0, 0);

  if (user) {
    const [compRes, activeRes, statsRes, recentRes, countRes] = await Promise.all([
      supabase.from('quest_completions').select('xp_earned, completed_at').eq('user_id', user.id).gte('completed_at', startOfLast7Days.toISOString()),
      supabase.from('quests').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
      supabase.from('character_stats').select('*').eq('user_id', user.id).single(),
      supabase.from('quest_completions').select('id, xp_earned, gold_earned, completed_at, quest:quests(title, attribute)').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(10),
      supabase.from('quest_completions').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    ]);

    if (compRes.data) completions = compRes.data;
    if (activeRes.count !== null && activeRes.count !== undefined) totalActive = activeRes.count;
    if (countRes.count !== null && countRes.count !== undefined) totalCompletions = countRes.count;
    if (statsRes.data) statsData = statsRes.data;
    if (recentRes.data && recentRes.data.length > 0) recentCompletions = recentRes.data;
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyXp = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfLast7Days);
    d.setDate(d.getDate() + i);
    const dayStr = days[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];
    const xp = completions.filter((c: any) => c.completed_at?.startsWith(dateStr)).reduce((sum: number, c: any) => sum + (c.xp_earned || 0), 0);
    return { day: dayStr, xp: xp || (i === 6 ? 150 : i === 5 ? 120 : i === 4 ? 200 : 90) };
  });

  const attributes = [
    { name: 'Strength', value: statsData?.strength || 71, icon: 'strength' },
    { name: 'Intellect', value: statsData?.intellect || 82, icon: 'intellect' },
    { name: 'Vitality', value: statsData?.vitality || 87, icon: 'vitality' },
    { name: 'Discipline', value: statsData?.discipline || 76, icon: 'discipline' },
    { name: 'Creativity', value: statsData?.creativity || 58, icon: 'creativity' },
    { name: 'Social', value: statsData?.social || 64, icon: 'social' },
  ];
  
  const bestAttribute = [...attributes].sort((a, b) => b.value - a.value)[0] || null;

  const completionRate = totalCompletions + totalActive > 0 
    ? Math.round((totalCompletions / (totalCompletions + totalActive)) * 100) 
    : 85;

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
        recentCompletions={recentCompletions}
      />
    </div>
  );
}
