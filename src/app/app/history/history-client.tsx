"use client";

import { useState } from 'react';
import { Transaction } from '@/lib/types/database';
import { formatRelativeTime } from '@/lib/utils';
import { Star, Coins, Trophy, Flame, Swords, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HistoryClientProps {
  initialTransactions: Transaction[];
}

type FilterType = 'All' | 'XP' | 'Gold' | 'Achievements' | 'Streaks';

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'xp_earned': return <Star className="w-5 h-5 text-amber-500" />;
    case 'gold_earned': return <Coins className="w-5 h-5 text-yellow-500" />;
    case 'gold_spent': return <Coins className="w-5 h-5 text-red-500" />;
    case 'achievement_xp':
    case 'achievement_gold': return <Trophy className="w-5 h-5 text-purple-500" />;
    case 'streak_bonus': return <Flame className="w-5 h-5 text-orange-500" />;
    default: return <Swords className="w-5 h-5 text-slate-400" />;
  }
};

const getTransactionColor = (type: string) => {
  switch (type) {
    case 'xp_earned': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    case 'gold_earned': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'gold_spent': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'achievement_xp':
    case 'achievement_gold': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    case 'streak_bonus': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    default: return 'text-slate-400 bg-slate-800 border-slate-700';
  }
};

const getAmountColor = (type: string, amount: number) => {
  if (type === 'gold_spent' || amount < 0) return 'text-red-500';
  return 'text-emerald-400';
};

const getAmountPrefix = (type: string, amount: number) => {
  if (type === 'gold_spent' || amount < 0) return '-';
  return '+';
};

export function HistoryClient({ initialTransactions }: HistoryClientProps) {
  const [filter, setFilter] = useState<FilterType>('All');
  
  const filters: FilterType[] = ['All', 'XP', 'Gold', 'Achievements', 'Streaks'];

  const filteredTransactions = initialTransactions.filter(t => {
    switch (filter) {
      case 'XP': return t.type === 'xp_earned' || t.type === 'achievement_xp';
      case 'Gold': return t.type === 'gold_earned' || t.type === 'gold_spent' || t.type === 'achievement_gold';
      case 'Achievements': return t.type === 'achievement_xp' || t.type === 'achievement_gold';
      case 'Streaks': return t.type === 'streak_bonus';
      default: return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
              filter === f 
                ? "bg-slate-800 text-white border-slate-600 shadow-md"
                : "bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <Swords className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-slate-300 mb-2">No history found</h3>
            <p className="text-slate-500 max-w-sm">
              {filter === 'All' 
                ? "You haven't completed any actions yet. Start your journey by completing quests!" 
                : `No transactions found for the "${filter}" filter.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            <AnimatePresence mode="popLayout">
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-4 sm:p-5 flex items-center gap-4 hover:bg-slate-800/30 transition-colors"
                >
                  <div className={cn(
                    "p-3 rounded-xl border flex-shrink-0",
                    getTransactionColor(transaction.type)
                  )}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium truncate">
                      {transaction.description || (
                        transaction.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                      )}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {formatRelativeTime(new Date(transaction.created_at))}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className={cn(
                      "flex items-center gap-1 font-bold text-lg",
                      getAmountColor(transaction.type, transaction.amount)
                    )}>
                      {transaction.type === 'gold_spent' || transaction.amount < 0 ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                      <span>{Math.abs(transaction.amount)}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {transaction.type.includes('gold') ? 'Gold' : transaction.type.includes('xp') ? 'XP' : 'Bonus'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
