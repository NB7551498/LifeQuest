import { createClient } from '@/lib/supabase/server';
import ShopClient from './shop-client';
import { DEMO_ITEMS, DEMO_PROFILE, DEMO_INVENTORY } from '@/lib/auth/demo-helper';

export const metadata = {
  title: 'Shop | LifeQuest',
};

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let items: any[] = DEMO_ITEMS;
  let goldBalance = DEMO_PROFILE.gold;
  let inventory: any[] = DEMO_INVENTORY;

  if (user) {
    const [itemsRes, profileRes, inventoryRes] = await Promise.all([
      supabase.from('items').select('*').order('price', { ascending: true }),
      supabase.from('profiles').select('gold').eq('id', user.id).single(),
      supabase.from('inventory').select('item_id, quantity').eq('user_id', user.id)
    ]);

    if (itemsRes.data && itemsRes.data.length > 0) items = itemsRes.data;
    if (profileRes.data) goldBalance = profileRes.data.gold;
    if (inventoryRes.data) inventory = inventoryRes.data;
  }

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
