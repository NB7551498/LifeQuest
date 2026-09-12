"use client";

import { motion } from "framer-motion";
import { Coins, Shield, Sword, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types/database";

interface ItemCardProps {
  item: Item;
  owned?: boolean;
  equipped?: boolean;
  onBuy?: (itemId: string) => void;
  onEquip?: (itemId: string, equip: boolean) => void;
  canAfford?: boolean;
  isBuying?: boolean;
}

const RARITY_COLORS: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  common: { border: "border-slate-500", glow: "hover:shadow-[0_0_15px_rgba(100,116,139,0.3)]", text: "text-slate-400", bg: "bg-slate-500/10" },
  uncommon: { border: "border-green-500", glow: "hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]", text: "text-green-400", bg: "bg-green-500/10" },
  rare: { border: "border-blue-500", glow: "hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]", text: "text-blue-400", bg: "bg-blue-500/10" },
  epic: { border: "border-purple-500", glow: "hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]", text: "text-purple-400", bg: "bg-purple-500/10" },
  legendary: { border: "border-amber-500", glow: "hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]", text: "text-amber-400", bg: "bg-amber-500/10" },
};

export function ItemCard({
  item,
  owned = false,
  equipped = false,
  onBuy,
  onEquip,
  canAfford = false,
  isBuying = false,
}: ItemCardProps) {
  // @ts-ignore
  const rarity = item.rarity?.toLowerCase() || "common";
  const colors = RARITY_COLORS[rarity] || RARITY_COLORS.common;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "relative flex flex-col bg-slate-900/80 rounded-xl overflow-hidden transition-all",
        "border-2", colors.border, colors.glow,
        equipped && "ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950"
      )}
    >
      {equipped && (
        <div className="absolute top-0 right-0 bg-amber-500 text-xs font-bold px-2 py-1 rounded-bl-lg z-10 text-slate-950">
          EQUIPPED
        </div>
      )}

      <div className={cn("flex-1 p-5 flex flex-col items-center text-center", colors.bg)}>
        <div className="text-5xl mb-4 filter drop-shadow-lg">
          {/* @ts-ignore */}
          {item.icon || "📦"}
        </div>
        
        <h3 className="text-lg font-bold text-slate-100 mb-1">{/* @ts-ignore */ item.name}</h3>
        {/* @ts-ignore */}
        <p className="text-xs text-slate-400 mb-4 line-clamp-3 flex-1">{item.description}</p>
        
        <div className="flex gap-2 mb-2 w-full justify-center">
          <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border", colors.border, colors.text)}>
            {rarity}
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-slate-700 text-slate-300 bg-slate-800">
            {/* @ts-ignore */}
            {item.type || "Item"}
          </span>
        </div>
      </div>

      <div className="p-3 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center mt-auto">
        {!owned ? (
          <>
            <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
              <Coins className="w-4 h-4" />
              {/* @ts-ignore */}
              <span>{item.price || 0}</span>
            </div>
            {onBuy && (
              <button
                // @ts-ignore
                onClick={() => onBuy(item.id)}
                disabled={!canAfford || isBuying}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  canAfford
                    ? "bg-amber-500 text-slate-900 hover:bg-amber-400"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                )}
              >
                {isBuying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buy"}
              </button>
            )}
          </>
        ) : (
          <div className="w-full flex justify-between items-center">
            <span className="text-sm font-medium text-slate-400">Owned</span>
            {onEquip && (
              <button
                // @ts-ignore
                onClick={() => onEquip(item.id, !equipped)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all border",
                  equipped 
                    ? "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700" 
                    : "bg-slate-700 border-slate-500 text-white hover:bg-slate-600"
                )}
              >
                {equipped ? "Unequip" : "Equip"}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
