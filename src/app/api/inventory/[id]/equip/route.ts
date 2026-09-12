import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { equipItemSchema } from '@/lib/validation/schemas';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const body = await request.json();
    const validationResult = equipItemSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error }, { status: 400 });
    }

    const { equipped } = validationResult.data;

    const { data: inventoryItem, error: invError } = await supabase
      .from('inventory')
      .select(`
        *,
        item:items (*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (invError || !inventoryItem) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    if (inventoryItem.item.type === 'consumable') {
      return NextResponse.json({ error: 'Cannot equip consumable items' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    if (equipped) {
      const { data: equippedItems } = await adminSupabase
        .from('inventory')
        .select(`id, item:items (type)`)
        .eq('user_id', user.id)
        .eq('equipped', true);

      if (equippedItems) {
        const toUnequip = equippedItems.filter((ei: any) => ei.item.type === inventoryItem.item.type);
        for (const item of toUnequip) {
          await adminSupabase.from('inventory').update({ equipped: false }).eq('id', item.id);
        }
      }
    }

    const { data: updatedItem, error: updateError } = await adminSupabase
      .from('inventory')
      .update({ equipped: equipped })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error equipping item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
