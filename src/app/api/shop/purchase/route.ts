import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { purchaseItemSchema } from '@/lib/validation/schemas';
import { readDB, writeDB } from '@/lib/storage/json-db';
import { DEMO_ITEMS } from '@/lib/auth/demo-helper';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = purchaseItemSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error }, { status: 400 });
    }

    const { item_id } = validationResult.data;
    const quantity = 1;

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const adminSupabase = createAdminClient();
        const { data: item } = await adminSupabase.from('items').select('*').eq('id', item_id).single();
        const { data: profile } = await adminSupabase.from('profiles').select('gold').eq('id', user.id).single();

        if (item && profile && profile.gold >= item.price) {
          const totalCost = item.price;
          await adminSupabase.from('profiles').update({ gold: profile.gold - totalCost }).eq('id', user.id);
          await adminSupabase.from('inventory').insert({ user_id: user.id, item_id, quantity, equipped: false });

          return NextResponse.json({
            success: true,
            item,
            quantity,
            cost: totalCost,
            remainingGold: profile.gold - totalCost
          });
        }
      }
    } catch {}

    // Local DB fallback
    const db = readDB();
    const item = DEMO_ITEMS.find((i) => i.id === item_id) || DEMO_ITEMS[0];
    const currentGold = db.profile?.gold || 450;

    if (currentGold < item.price) {
      return NextResponse.json({ error: 'Insufficient gold' }, { status: 400 });
    }

    const remainingGold = currentGold - item.price;
    db.profile = { ...(db.profile || {}), gold: remainingGold };
    db.inventory = db.inventory || [];
    db.inventory.push({
      id: `inv-${Date.now()}`,
      user_id: 'demo-hero-id',
      item_id,
      quantity,
      equipped: false,
      items: item
    });

    writeDB(db);

    return NextResponse.json({
      success: true,
      item,
      quantity,
      cost: item.price,
      remainingGold
    });
  } catch (error) {
    console.error('Error purchasing item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
