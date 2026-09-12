"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { Target, Trophy, Flame, Swords, Book, Heart, Shield, Sparkles, Users, Award, Coins, Star } from 'lucide-react';
import { cn, formatNumber, formatRelativeTime } from '@/lib/utils';
import { motion } from 'framer-motion';

const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'strength': return <Swords className="w-5 h-5 text-red-500" />;
    case 'intellect': return <Book className="w-5 h-5 text-blue-500" />;
    case 'vitality': return <Heart className="w-5 h-5 text-green-500" />;
    case 'discipline': return <Shield className="w-5 h-5 text-slate-400" />;
    case 'creativity': return <Sparkles className="w-5 h-5 text-purple-500" />;
    case 'social': return <Users className="w-5 h-5 text-pink-500" />;
    default: return <Star className="w-5 h-5 text-amber-500" />;
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        <p className="text-amber-500 font-bold">
          {payload[0].value} XP
        </p>
      </div>
    );
  }
  return null;
};

interface AnalyticsChartsProps {
  weeklyXp: { day: string; xp: number }[];
  completionRate: number;
  totalCompleted: number;
  totalActive: number;
  attributes: { name: string; value: number; icon: string }[];
  bestAttribute: { name: string; value: number; icon: string } | null;
  recentCompletions: any[];
}

export function AnalyticsCharts({
  weeklyXp,
  completionRate,
  totalCompleted,
  totalActive,
  attributes,
  bestAttribute,
  recentCompletions
}: AnalyticsChartsProps) {
  const totalXpThisWeek = weeklyXp.reduce((acc, curr) => acc + curr.xp, 0);

  const radialData = [
    {
      name: 'Completion Rate',
      value: completionRate,
      fill: '#10b981', // emerald-500
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">XP Earned This Week</h2>
              <p className="text-3xl font-bold text-amber-500 glow-amber">{formatNumber(totalXpThisWeek)} XP</p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyXp} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="xp" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quest Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Quest Mastery</h2>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="h-[250px] w-full max-w-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="70%" 
                  outerRadius="90%" 
                  barSize={15} 
                  data={radialData} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background={{ fill: '#1e293b' }}
                    dataKey="value"
                    cornerRadius={10}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{completionRate}%</span>
                <span className="text-sm text-slate-400">Completion</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">Completed</p>
              <p className="text-2xl font-bold text-emerald-400">{totalCompleted}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-slate-400 text-sm mb-1">Active</p>
              <p className="text-2xl font-bold text-blue-400">{totalActive}</p>
            </div>
          </div>
        </motion.div>

        {/* Attribute Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/60 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-white">Attribute Proficiency</h2>
            {bestAttribute && (
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-slate-200">
                  Best: <span className="text-yellow-500">{bestAttribute.name}</span>
                </span>
              </div>
            )}
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={attributes}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <Radar
                  name="Attributes"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Triumphs</h2>
            <Target className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentCompletions.length > 0 ? (
              recentCompletions.map((completion) => (
                <div key={completion.id} className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-lg border border-slate-800/60 hover:bg-slate-800/60 transition-colors">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    {getIcon(completion.quest.attribute)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium truncate">{completion.quest.title}</p>
                    <p className="text-xs text-slate-400">{formatRelativeTime(new Date(completion.completed_at))}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400 font-bold text-sm">+{completion.xp_earned}</span>
                      <span className="text-xs text-amber-500/70">XP</span>
                    </div>
                    {completion.gold_earned > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 font-bold text-sm">+{completion.gold_earned}</span>
                        <Coins className="w-3 h-3 text-yellow-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 text-slate-500">
                <Target className="w-12 h-12 mb-3 opacity-20" />
                <p>No recent quests completed.</p>
                <p className="text-sm">Time to embark on an adventure!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
