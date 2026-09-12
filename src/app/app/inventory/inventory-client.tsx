"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Shield, Sword, Medal, Palette, FlaskConical, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RARITIES } from '@/lib/rpg/constants';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Simple toast helper (replaces sonner)
function showToast(message: string) {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 z-50 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemAnim = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
};

const CATEGORIES = ['All', 'Weapon', 'Shield', 'Badge', 'Theme', 'Consumable'];

export default function InventoryClient({ initialInventory }: any) {
  const router = useRouter();
  const [inventory, setInventory] = useState(initialInventory);
  const [category, setCategory] = useState('All');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleEquip = async (invItem: any) => {
    setLoadingId(invItem.id);
    try {
      const res = await fetch(`/api/inventory/${invItem.id}/equip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipped: !invItem.equipped })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to equip item');
      }

      // Update local state: unequip old item of same type, equip new one
      setInventory((prev: any) => prev.map((item: any) => {
        if (item.items.type === invItem.items.type) {
          return { ...item, equipped: item.id === invItem.id ? !invItem.equipped : false };
        }
        return item;
      }));
      
      showToast(invItem.equipped ? `Unequipped ${invItem.items.name}` : `Equipped ${invItem.items.name}`);
      router.refresh();
    } catch (err: any) {
      showToast(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  let filtered = inventory.filter((inv: any) => 
    category === 'All' || inv.items.type.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-amber-500" />
            Inventory
          </h1>
          <p className="text-slate-400 mt-1">Manage your gear and consumables.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              category === cat 
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" 
                : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {inventory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed text-center px-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Your inventory is empty</h3>
          <p className="text-slate-400 mb-6 max-w-sm">You haven't acquired any items yet. Visit the shop to gear up!</p>
          <Link href="/shop" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]">
            Visit Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filtered.map((inv: any) => {
              const item = inv.items;
              const isConsumable = item.type === 'consumable';
              const rarityInfo = RARITIES[item.rarity as keyof typeof RARITIES] || RARITIES.common;
              
              return (
                <motion.div 
                  key={inv.id}
                  layout
                  variants={itemAnim}
                  className={cn(
                    "relative overflow-hidden bg-slate-900/60 border rounded-2xl p-5 flex flex-col transition-all",
                    inv.equipped ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : rarityInfo.borderColor || 'border-slate-800'
                  )}
                >
                  {inv.equipped && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                      Equipped
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center bg-slate-800 border",
                        inv.equipped ? "border-amber-500 text-amber-500" : rarityInfo.borderColor || 'border-slate-700'
                      )}
                    >
                      {item.icon_url ? (
                        <img src={item.icon_url} alt={item.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-2xl">{item.type === 'weapon' ? '⚔️' : item.type === 'shield' ? '🛡️' : item.type === 'badge' ? '🏅' : item.type === 'theme' ? '🎨' : '🧪'}</span>
                      )}
                    </div>
                    
                    {isConsumable && (
                      <span className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold px-2 py-1 rounded-md">
                        x{inv.quantity}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 mb-6">
                    <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
                    <div className="mt-3">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide",
                        rarityInfo.color || 'text-slate-400',
                        (rarityInfo.borderColor || 'border-slate-700').replace('border', 'bg').replace('-500', '-500/10')
                      )}>
                        {item.rarity} {item.type}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {!isConsumable && (
                      <button
                        onClick={() => handleEquip(inv)}
                        disabled={loadingId === inv.id}
                        className={cn(
                          "w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2",
                          inv.equipped
                            ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                            : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30"
                        )}
                      >
                        {loadingId === inv.id 
                          ? 'Updating...' 
                          : inv.equipped ? 'Unequip' : 'Equip'
                        }
                      </button>
                    )}
                    
                    {isConsumable && (
                      <button
                        disabled={true}
                        className="w-full py-2.5 rounded-lg font-bold text-sm bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                      >
                        Use (Coming Soon)
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filtered.length === 0 && inventory.length > 0 && (
            <div className="col-span-full py-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed">
              <p className="text-slate-400">No items found in this category.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
