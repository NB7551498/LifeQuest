"use client";

import { motion } from 'framer-motion';
import { Shield, Sword, Medal, Palette, Brain, Dumbbell, Heart, ShieldCheck, Lightbulb, Users, Calendar, Target } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { ATTRIBUTES } from '@/lib/rpg/constants';
import Image from 'next/image';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function CharacterClient({
  profile, stats, streak, equipped, level, currentXp, xpForNextLevel, progress, title, nextTitle, totalQuests
}: any) {
  
  const attributeList = [
    { key: 'intellect', value: stats.intellect, icon: Brain, color: 'bg-blue-500' },
    { key: 'strength', value: stats.strength, icon: Dumbbell, color: 'bg-red-500' },
    { key: 'vitality', value: stats.vitality, icon: Heart, color: 'bg-green-500' },
    { key: 'discipline', value: stats.discipline, icon: ShieldCheck, color: 'bg-purple-500' },
    { key: 'creativity', value: stats.creativity, icon: Lightbulb, color: 'bg-yellow-500' },
    { key: 'social', value: stats.social, icon: Users, color: 'bg-pink-500' }
  ].sort((a, b) => b.value - a.value);

  const getEquipped = (type: string) => equipped.find((e: any) => e.items.type === type)?.items;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Hero Card */}
      <motion.div variants={itemAnim} className="relative overflow-hidden rounded-2xl border border-amber-500/50 bg-slate-900/80 p-6 md:p-8 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="h-24 w-24 rounded-full bg-slate-800 border-2 border-amber-500 flex items-center justify-center overflow-hidden shrink-0">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt="Avatar" width={96} height={96} className="object-cover" />
            ) : (
              <Shield className="w-12 h-12 text-amber-500" />
            )}
          </div>
          
          <div className="flex-1 w-full text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{profile.username || 'Hero'}</h1>
              <p className="text-amber-400 font-medium text-lg">{title}</p>
            </div>
            
            <div className="space-y-2 max-w-xl">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-bold">Level {level}</span>
                <span className="text-slate-400">{currentXp} / {xpForNextLevel} XP</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out relative"
                  style={{ width: `${Math.max(2, progress)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              {nextTitle && (
                <p className="text-xs text-slate-500 text-right">
                  Next title: {nextTitle.title} at Level {nextTitle.level}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attributes */}
        <motion.div variants={itemAnim} className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            Attributes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {attributeList.map((attr) => {
              const Icon = attr.icon;
              const maxStat = 1000; // Arbitrary max for bar scale
              const barProgress = Math.min(100, (attr.value / maxStat) * 100);
              
              return (
                <div key={attr.key} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("w-4 h-4", attr.color.replace('bg-', 'text-'))} />
                      <span className="capitalize font-medium text-slate-200">{attr.key}</span>
                    </div>
                    <span className="text-slate-100 font-bold">{attr.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000 ease-out", attr.color)}
                      style={{ width: `${Math.max(2, barProgress)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Sidebar: Equipped & Stats */}
        <motion.div variants={itemAnim} className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h2 className="text-lg font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">Equipped</h2>
            <div className="space-y-3">
              {[
                { type: 'weapon', icon: Sword, label: 'Weapon' },
                { type: 'shield', icon: Shield, label: 'Shield' },
                { type: 'badge', icon: Medal, label: 'Badge' },
                { type: 'theme', icon: Palette, label: 'Theme' },
              ].map(slot => {
                const item = getEquipped(slot.type);
                const Icon = slot.icon;
                return (
                  <div key={slot.type} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="p-2 bg-slate-800 rounded-md">
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 capitalize">{slot.label}</p>
                      <p className="text-sm font-medium text-slate-200 truncate">{item ? item.name : 'Empty Slot'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
            <h2 className="text-lg font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 flex items-center gap-1.5"><Target className="w-3.5 h-3.5"/> Total XP</span>
                <span className="text-sm font-bold text-amber-400">{profile.total_xp?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> Quests Done</span>
                <span className="text-sm font-bold text-slate-200">{totalQuests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Member Since</span>
                <span className="text-sm font-bold text-slate-200">{formatDate(profile.created_at)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
