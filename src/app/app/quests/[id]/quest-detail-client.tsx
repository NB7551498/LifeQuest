"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Trash2, Calendar, Repeat, Award, Info } from "lucide-react";
import { formatDate, getDifficultyStars } from "@/lib/utils";
import { calculateQuestRewards } from "@/lib/rpg/xp-engine";
type Quest = any;
type QuestCompletion = any;

interface QuestDetailClientProps {
  initialQuest: Quest;
  completionHistory: QuestCompletion[];
}

export function QuestDetailClient({ initialQuest, completionHistory }: QuestDetailClientProps) {
  const router = useRouter();
  const [quest, setQuest] = useState(initialQuest);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const rewards = calculateQuestRewards(quest.difficulty);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const response = await fetch(`/api/quests/${quest.id}/complete`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to complete quest");
      }
      
      setQuest({ ...quest, status: "completed" });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to abandon this quest? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/quests/${quest.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quest");
      }
      
      router.push("/quests");
      router.refresh();
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/quests" className="flex items-center text-slate-400 hover:text-white transition-colors w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Quests
      </Link>

      <div className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className={`p-8 border-b border-slate-700 relative overflow-hidden ${quest.status === 'completed' ? 'bg-green-900/20' : ''}`}>
          {quest.status === 'completed' && (
            <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 border border-green-500/50 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> COMPLETED
            </div>
          )}
          
          <div className="flex gap-2 items-center mb-4">
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
              {quest.category}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700">
              {quest.attribute}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold flex items-center gap-1 border border-slate-700 text-yellow-500">
              {getDifficultyStars(quest.difficulty)} <span className="text-slate-400 ml-1 capitalize">{quest.difficulty}</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">{quest.title}</h1>
          
          {quest.description && (
            <p className="text-slate-300 mt-4 whitespace-pre-wrap">{quest.description}</p>
          )}
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" /> Quest Details
            </h2>
            
            <div className="space-y-4">
              {quest.due_date && (
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Due Date</p>
                    <p className="font-medium">{formatDate(quest.due_date)}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Repeat className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Recurrence</p>
                  <p className="font-medium capitalize">
                    {quest.is_recurring ? (quest.recurring_interval || "daily") : "One-time quest"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Award className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Rewards</p>
                  <p className="font-medium">
                    <span className="text-green-400">+{rewards.xp} XP</span> • <span className="text-yellow-400">+{rewards.gold} Gold</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* History */}
          {quest.is_recurring && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Check className="w-5 h-5 text-indigo-400" /> Completion History
              </h2>
              
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                {completionHistory.length > 0 ? (
                  <ul className="space-y-3">
                    {completionHistory.map((comp) => (
                      <li key={comp.id} className="flex justify-between items-center text-sm">
                        <span className="text-slate-300">{formatDate(comp.completed_at)}</span>
                        <div className="flex gap-2 text-xs">
                          <span className="text-green-400">+{comp.xp_earned} XP</span>
                          <span className="text-yellow-400">+{comp.gold_earned} G</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm italic text-center py-4">No completions yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/50 flex flex-wrap gap-4">
          {quest.status === "active" && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="flex-1 min-w-[200px] py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              {isCompleting ? "Completing..." : "Complete Quest"}
            </button>
          )}
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            {isDeleting ? "Abandoning..." : "Abandon"}
          </button>
        </div>
      </div>
    </div>
  );
}
