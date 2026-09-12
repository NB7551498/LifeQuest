import { createClient } from '@/lib/supabase/server';
import ShopClient from './shop-client';

export const metadata = {
  title: 'Shop | LifeQuest',
};

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-slate-400">Not authenticated</div>;
  }

  // Fetch items, profile (for gold), and inventory
  const [itemsRes, profileRes, inventoryRes] = await Promise.all([
    supabase.from('items').select('*').order('price', { ascending: true }),
    supabase.from('profiles').select('gold').eq('id', user.id).single(),
    supabase.from('inventory').select('item_id, quantity').eq('user_id', user.id)
  ]);

  const items = itemsRes.data || [];
  const goldBalance = profileRes.data?.gold || 0;
  const inventory = inventoryRes.data || [];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <ShopClient 
        initialItems={items} 
        initialGold={goldBalance} 
        inventory={inventory} 
      />
    </div>
  );
}
