import { createClient } from '@/lib/supabase/server';
import InventoryClient from './inventory-client';

export const metadata = {
  title: 'Inventory | LifeQuest',
};

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className="p-8 text-slate-400">Not authenticated</div>;
  }

  const { data: inventoryData, error } = await supabase
    .from('inventory')
    .select('*, items(*)')
    .eq('user_id', user.id);

  if (error) {
    return <div className="p-8 text-red-400">Error loading inventory</div>;
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <InventoryClient initialInventory={inventoryData || []} />
    </div>
  );
}
