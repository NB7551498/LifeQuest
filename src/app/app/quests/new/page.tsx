"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, ATTRIBUTES, DIFFICULTIES } from "@/lib/rpg/constants";
import { calculateQuestRewards } from "@/lib/rpg/xp-engine";
import { createQuestSchema } from "@/lib/validation/schemas";
import { getDifficultyStars } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewQuestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: Object.keys(CATEGORIES)[0],
    attribute: Object.keys(ATTRIBUTES)[0],
    difficulty: "easy",
    due_date: "",
    is_recurring: false,
    recurring_interval: "daily",
  });

  const rewards = calculateQuestRewards(formData.difficulty as keyof typeof DIFFICULTIES);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as keyof typeof CATEGORIES;
    // Auto-suggest attribute based on category
    const suggestedAttribute = CATEGORIES[newCategory]?.suggestedAttribute || formData.attribute;
    setFormData({ ...formData, category: newCategory, attribute: suggestedAttribute });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate
      const validatedData = createQuestSchema.parse(formData);

      const response = await fetch("/api/quests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to create quest");
      }

      window.location.href = "/app/quests";
    } catch (err: any) {
      setError(err.errors ? err.errors[0].message : err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Link href="/app/quests" className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Quests
      </Link>

      <div className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <div className="bg-slate-800/80 p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📜</span> Create New Quest
          </h1>
          <p className="text-slate-400 mt-1">Design your next challenge.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1">Quest Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="e.g., Run 5km"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 min-h-[100px] focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Add details about your quest..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.keys(CATEGORIES).map(c => (
                    <option key={c} value={c}>{CATEGORIES[c as keyof typeof CATEGORIES].label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1">Primary Attribute</label>
                <select
                  value={formData.attribute}
                  onChange={(e) => setFormData({ ...formData, attribute: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.keys(ATTRIBUTES).map(a => (
                    <option key={a} value={a}>{a} - {ATTRIBUTES[a as keyof typeof ATTRIBUTES].label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(DIFFICULTIES).map((diff) => (
                  <label
                    key={diff}
                    className={`
                      cursor-pointer rounded-lg border p-3 flex flex-col items-center justify-center gap-1 transition-all
                      ${formData.difficulty === diff 
                        ? 'bg-indigo-900/30 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                        : 'bg-slate-950 border-slate-700 hover:border-slate-500'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={diff}
                      checked={formData.difficulty === diff}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="sr-only"
                    />
                    <span className="capitalize font-medium text-slate-200">{diff}</span>
                    <span className="text-yellow-500 text-xs tracking-widest">{getDifficultyStars(diff as keyof typeof DIFFICULTIES)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rewards Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex justify-between items-center mt-2">
              <span className="text-sm text-slate-400">Expected Rewards:</span>
              <div className="flex gap-4">
                <span className="font-bold text-green-400">+{rewards.xp} XP</span>
                <span className="font-bold text-yellow-400">+{rewards.gold} Gold</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1">Due Date (Optional)</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1">Recurring?</label>
                <div className="flex items-center gap-3 mt-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.is_recurring}
                      onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                  
                  {formData.is_recurring && (
                    <select
                      value={formData.recurring_interval}
                      onChange={(e) => setFormData({ ...formData, recurring_interval: e.target.value })}
                      className="bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? "Crafting Quest..." : "⚔️ Create Quest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
