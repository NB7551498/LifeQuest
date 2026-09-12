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

  const handleDeleteQuest = async (questId: string) => {
    setQuests((prev) => prev.filter(q => q.id !== questId));
    
    try {
      const response = await fetch(`/api/quests/${questId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete quest");
      }
    } catch (error) {
      console.error(error);
      setQuests(initialQuests);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Quest Log</h1>
        <Link 
          href="/quests/new" 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-lg shadow-indigo-900/20 font-medium"
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
                  ? "bg-slate-700 text-white" 
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
            className="bg-slate-800 border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{CATEGORIES[c as keyof typeof CATEGORIES].label}</option>)}
          </select>

          <select 
            value={attributeFilter}
            onChange={(e) => setAttributeFilter(e.target.value)}
            className="bg-slate-800 border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500"
          >
            <option value="all">All Attributes</option>
            {Object.keys(ATTRIBUTES).map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <select 
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-slate-800 border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500"
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
                  <button 
                    onClick={() => handleDeleteQuest(quest.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-900/80 text-red-200 px-2 py-1 rounded text-xs hover:bg-red-800"
                  >
                    Delete
                  </button>
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
    </div>
  );
}
