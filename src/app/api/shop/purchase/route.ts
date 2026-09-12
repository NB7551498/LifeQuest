import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { purchaseItemSchema } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = purchaseItemSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error }, { status: 400 });
    }

    const { item_id } = validationResult.data;
    const quantity = 1;
    const adminSupabase = createAdminClient();

    const { data: item, error: itemError } = await adminSupabase
      .from('items')
      .select('*')
      .eq('id', item_id)
      .single();

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('gold')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 500 });
    }

    const totalCost = item.price * quantity;

    if (profile.gold < totalCost) {
      return NextResponse.json({ error: 'Insufficient gold' }, { status: 400 });
    }

    const { data: inventoryItem } = await adminSupabase
      .from('inventory')
      .select('*')
      .eq('user_id', user.id)
      .eq('item_id', item_id)
      .single();

    if (item.type !== 'consumable' && inventoryItem) {
      return NextResponse.json({ error: 'Item already owned' }, { status: 400 });
    }

    await adminSupabase.from('profiles').update({
      gold: profile.gold - totalCost
    }).eq('id', user.id);

    if (item.type === 'consumable' && inventoryItem) {
      await adminSupabase.from('inventory').update({
        quantity: inventoryItem.quantity + quantity
      }).eq('id', inventoryItem.id);
    } else {
      await adminSupabase.from('inventory').insert({
        user_id: user.id,
        item_id: item_id,
        quantity: quantity,
        equipped: false
      });
    }

    await adminSupabase.from('transactions').insert({
      user_id: user.id,
      type: 'gold_spent',
      amount: totalCost,
      description: 'Shop purchase',
      reference_type: 'shop',
      reference_id: item_id
    });

    return NextResponse.json({
      success: true,
      item,
      quantity,
      cost: totalCost,
      remainingGold: profile.gold - totalCost
    });
  } catch (error) {
    console.error('Error purchasing item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
