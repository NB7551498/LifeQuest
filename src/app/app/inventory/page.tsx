import { createClient } from '@/lib/supabase/server';
import InventoryClient from './inventory-client';
import { DEMO_INVENTORY } from '@/lib/auth/demo-helper';

export const metadata = {
  title: 'Inventory | LifeQuest',
};

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let inventoryData: any[] = DEMO_INVENTORY;

  if (user) {
    const { data: resData } = await supabase
      .from('inventory')
      .select('*, items(*)')
      .eq('user_id', user.id);

    if (resData && resData.length > 0) {
      inventoryData = resData;
    }
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <InventoryClient initialInventory={inventoryData || []} />
    </div>
  );
}
