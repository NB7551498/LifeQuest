"use client";

import { useState, useMemo } from "react";
import { QuestCard } from "@/components/rpg/quest-card";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, ATTRIBUTES, DIFFICULTIES } from "@/lib/rpg/constants";
type Quest = any;

interface QuestsClientProps {
  initialQuests: Quest[];
}

export function QuestsClient({ initialQuests }: QuestsClientProps) {
  const [quests, setQuests] = useState(initialQuests);
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "all">("active");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [attributeFilter, setAttributeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const filteredQuests = useMemo(() => {
    return quests.filter((quest) => {
      // Tab filter
      if (activeTab === "active" && quest.status !== "active") return false;
      if (activeTab === "completed" && quest.status !== "completed") return false;
      
      // Dropdown filters
      if (categoryFilter !== "all" && quest.category !== categoryFilter) return false;
      if (attributeFilter !== "all" && quest.attribute !== attributeFilter) return false;
      if (difficultyFilter !== "all" && quest.difficulty !== difficultyFilter) return false;

      return true;
    });
  }, [quests, activeTab, categoryFilter, attributeFilter, difficultyFilter]);

  const handleCompleteQuest = async (questId: string) => {
    // Optimistic update
    setQuests((prev) => 
      prev.map(q => q.id === questId ? { ...q, status: "completed" } : q)
    );

    try {
      const response = await fetch(`/api/quests/${questId}/complete`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to complete quest");
      }
    } catch (error) {
      console.error(error);
      // Revert on error
      setQuests((prev) => 
        prev.map(q => q.id === questId ? { ...q, status: "active" } : q)
      );
    }
  };

  const [questToAbandon, setQuestToAbandon] = useState<Quest | null>(null);

  const confirmAbandonQuest = async () => {
    if (!questToAbandon) return;
    const questId = questToAbandon.id;
    setQuestToAbandon(null);

    setQuests((prev) => prev.filter(q => q.id !== questId));
    
    try {
      const response = await fetch(`/api/quests/${questId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to abandon quest");
      }
    } catch (error) {
      console.error(error);
      setQuests(initialQuests);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          ⚔️ Quest Log
        </h1>
        <Link 
          href="/quests/new" 
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl transition-all shadow-lg shadow-orange-950/40 font-bold text-sm flex items-center gap-1.5"
        >
          + Create Quest
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          {(["active", "completed", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? "bg-amber-500 text-slate-950 font-bold" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-800 border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-amber-500"
          >
            <option value="all">All Categories</option>
            {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{CATEGORIES[c as keyof typeof CATEGORIES].label}</option>)}
          </select>

          <select 
            value={attributeFilter}
            onChange={(e) => setAttributeFilter(e.target.value)}
            className="bg-slate-800 border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-amber-500"
          >
            <option value="all">All Attributes</option>
            {Object.keys(ATTRIBUTES).map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <select 
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-slate-800 border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-amber-500"
          >
            <option value="all">All Difficulties</option>
            {Object.keys(DIFFICULTIES).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredQuests.length > 0 ? (
            filteredQuests.map((quest) => (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative group">
                  <QuestCard 
                    quest={quest} 
                    onComplete={quest.status === "active" ? () => handleCompleteQuest(quest.id) : undefined} 
                  />
                  {quest.status === "active" && (
                    <button 
                      onClick={() => setQuestToAbandon(quest)}
                      className="absolute top-3 right-3 opacity-80 group-hover:opacity-100 transition-opacity bg-red-950/80 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-900/90 hover:text-white flex items-center gap-1 shadow-md"
                    >
                      🗑️ Abandon Quest
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-900/40 border border-slate-800 border-dashed rounded-xl p-12 text-center text-slate-400"
            >
              <p>No quests found matching your filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Abandon Quest Modal Dialog */}
      <AnimatePresence>
        {questToAbandon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-red-500/50 rounded-2xl p-6 max-w-md w-full shadow-[0_0_30px_rgba(239,68,68,0.2)] text-center space-y-4"
            >
              <div className="text-4xl">⚠️</div>
              <h3 className="text-xl font-bold text-white tracking-wide uppercase">ABANDON THIS QUEST?</h3>
              <p className="text-sm text-slate-300">
                Are you sure you want to abandon <span className="text-amber-400 font-semibold">"{questToAbandon.title}"</span>?
                <br /><span className="text-slate-400 text-xs mt-1 block">You will lose this active quest. Your completed history remains intact.</span>
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setQuestToAbandon(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={confirmAbandonQuest}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-red-900/30"
                >
                  🗑️ ABANDON
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
