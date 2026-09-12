"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, CheckCircle2, Swords, Compass, Sparkles, MapPin } from "lucide-react";

interface MapNode {
  id: string;
  name: string;
  subtitle: string;
  minLevel: number;
  icon: string;
  status: "completed" | "unlocked" | "locked";
  link: string;
  actionText: string;
}

const MAP_NODES: MapNode[] = [
  {
    id: "node-1",
    name: "Hero Start Camp",
    subtitle: "The origin of your productivity journey.",
    minLevel: 1,
    icon: "🏕️",
    status: "completed",
    link: "/app/dashboard",
    actionText: "Visit Camp",
  },
  {
    id: "node-2",
    name: "Scholar's Haven",
    subtitle: "Test your intellect and expand your domain knowledge.",
    minLevel: 3,
    icon: "📚",
    status: "unlocked",
    link: "/app/quizzes",
    actionText: "Enter Arena",
  },
  {
    id: "node-3",
    name: "Logic Cave",
    subtitle: "Solve pattern puzzles and train rapid reasoning.",
    minLevel: 5,
    icon: "🧩",
    status: "unlocked",
    link: "/app/games",
    actionText: "Play Mini-Games",
  },
  {
    id: "node-4",
    name: "Mountain of Discipline",
    subtitle: "Maintain daily streaks to climb higher.",
    minLevel: 10,
    icon: "🏔️",
    status: "unlocked",
    link: "/app/quests",
    actionText: "View Daily Quests",
  },
  {
    id: "node-5",
    name: "Dragon's Lair",
    subtitle: "Confront procrastination bosses with real-world quest strikes.",
    minLevel: 15,
    icon: "🐉",
    status: "locked",
    link: "/app/boss",
    actionText: "Confront Boss",
  },
];

export default function MapClient() {
  const [selectedNode, setSelectedNode] = useState<MapNode>(MAP_NODES[1]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300">
            🗺️ World Adventure Map
          </h1>
          <p className="text-slate-400 mt-1">Journey across the realm of productivity to unlock new areas and quests!</p>
        </div>
      </div>

      {/* World Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Visual Map Path */}
        <div className="lg:col-span-2 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-8 space-y-12 shadow-2xl relative">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Realm Map Trail</span>
          </div>

          <div className="relative space-y-12 max-w-md mx-auto">
            {/* Connecting Line */}
            <div className="absolute left-8 top-6 bottom-6 w-1 bg-gradient-to-b from-emerald-500 via-amber-500 to-slate-800 z-0" />

            {MAP_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;

              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setSelectedNode(node)}
                  className={`relative z-10 flex items-center gap-6 p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                    isSelected
                      ? "bg-slate-800 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                      : node.status === "locked"
                      ? "bg-slate-950/60 border-slate-900 opacity-60"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 border-2 ${
                      node.status === "completed"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : node.status === "unlocked"
                        ? "bg-amber-500/20 border-amber-500 text-amber-400"
                        : "bg-slate-800 border-slate-700 text-slate-500"
                    }`}
                  >
                    {node.status === "locked" ? <Lock className="w-6 h-6" /> : node.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white truncate">{node.name}</span>
                      {node.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{node.subtitle}</p>
                  </div>

                  <div className="text-right shrink-0">
                    {node.status === "locked" ? (
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                        Level {node.minLevel}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                        {node.status}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 space-y-6 shadow-xl sticky top-20">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span className="text-4xl">{selectedNode.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedNode.name}</h2>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                Required Level: {selectedNode.minLevel}
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">{selectedNode.subtitle}</p>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="font-bold text-white uppercase tracking-wider">Node Features:</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>Interactive progression node</li>
              <li>Awards area completion XP</li>
              <li>Connects to core RPG trials</li>
            </ul>
          </div>

          {selectedNode.status !== "locked" ? (
            <Link
              href={selectedNode.link}
              className="block w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-center hover:shadow-lg transition-all"
            >
              {selectedNode.actionText} →
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-3.5 px-6 rounded-xl bg-slate-800 text-slate-500 font-bold cursor-not-allowed text-center"
            >
              🔒 Reach Level {selectedNode.minLevel} to Unlock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
