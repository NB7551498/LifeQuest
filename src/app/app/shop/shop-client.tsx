"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Filter, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RARITIES } from '@/lib/rpg/constants';
import { useRouter } from 'next/navigation';

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
const SORTS = ['Price (Low to High)', 'Price (High to Low)', 'Rarity'];

export default function ShopClient({ initialItems, initialGold, inventory }: any) {
  const router = useRouter();
  const [gold, setGold] = useState(initialGold);
  const [ownedItems, setOwnedItems] = useState(inventory);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Price (Low to High)');
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const isOwned = (itemId: string, type: string) => {
    if (type === 'consumable') return false;
    return ownedItems.some((inv: any) => inv.item_id === itemId);
  };

  const handleBuy = async (item: any) => {
    if (gold < item.price) {
      showToast('Insufficient gold!');
      return;
    }
    
    if (confirm(`Buy ${item.name} for ${item.price} gold?`)) {
      setBuyingId(item.id);
      try {
        const res = await fetch('/api/shop/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_id: item.id })
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to purchase');
        }

        setGold((prev: number) => prev - item.price);
        setOwnedItems((prev: any) => [...prev, { item_id: item.id, quantity: 1 }]);
        showToast(`Purchased ${item.name}!`);
        router.refresh();
      } catch (err: any) {
        showToast(err.message);
      } finally {
        setBuyingId(null);
      }
    }
  };

  let filteredItems = initialItems.filter((item: any) => category === 'All' || item.type.toLowerCase() === category.toLowerCase());
  
  filteredItems.sort((a: any, b: any) => {
    if (sortBy === 'Price (Low to High)') return a.price - b.price;
    if (sortBy === 'Price (High to Low)') return b.price - a.price;
    if (sortBy === 'Rarity') {
      const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
      return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-amber-500" />
            Marketplace
          </h1>
          <p className="text-slate-400 mt-1">Spend your hard-earned gold on epic gear.</p>
        </div>
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl px-6 py-3 flex items-center gap-3 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          <Coins className="w-6 h-6 text-yellow-400" />
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Your Gold</p>
            <p className="text-xl font-bold text-yellow-400">{gold.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
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
        <select 
          className="bg-slate-900/60 border border-slate-800 text-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredItems.map((item: any) => {
            const owned = isOwned(item.id, item.type);
            const canAfford = gold >= item.price;
            const rarityInfo = RARITIES[item.rarity as keyof typeof RARITIES] || RARITIES.common;
            const isConsumable = item.type === 'consumable';

            return (
              <motion.div 
                key={item.id}
                layout
                variants={itemAnim}
                className={cn(
                  "relative overflow-hidden bg-slate-900/60 border rounded-2xl p-5 flex flex-col",
                  rarityInfo.borderColor || 'border-slate-800'
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center bg-slate-800 border",
                      rarityInfo.borderColor || 'border-slate-700'
                    )}
                  >
                    {/* Placeholder for icon based on type */}
                    {item.icon_url ? (
                      <img src={item.icon_url} alt={item.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-2xl">{item.type === 'weapon' ? '⚔️' : item.type === 'shield' ? '🛡️' : item.type === 'badge' ? '🏅' : item.type === 'theme' ? '🎨' : '🧪'}</span>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide",
                    rarityInfo.color || 'text-slate-400',
                    (rarityInfo.borderColor || 'border-slate-700').replace('border', 'bg').replace('-500', '-500/10')
                  )}>
                    {item.rarity}
                  </span>
                </div>

                <div className="flex-1 mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 font-bold text-yellow-400">
                    <Coins className="w-4 h-4" />
                    {item.price}
                  </div>

                  <button
                    onClick={() => handleBuy(item)}
                    disabled={(!canAfford && !owned) || (owned && !isConsumable) || buyingId === item.id}
                    className={cn(
                      "px-4 py-2 rounded-lg font-bold text-sm transition-all",
                      owned && !isConsumable 
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                        : canAfford 
                          ? "bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]" 
                          : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    )}
                  >
                    {buyingId === item.id ? 'Buying...' : (owned && !isConsumable) ? 'Owned' : 'Buy'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 border-dashed">
            <p className="text-slate-400">No items found matching your filters.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
