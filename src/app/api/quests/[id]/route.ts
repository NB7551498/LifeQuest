import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateQuestSchema } from '@/lib/validation/schemas';
import { calculateQuestRewards } from '@/lib/rpg/xp-engine';

export async function GET(
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

    const { data, error } = await supabase
      .from('quests')
      .select(`
        *,
        quest_completions (*)
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching quest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
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

    const { data: existingQuest, error: fetchError } = await supabase
      .from('quests')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingQuest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    if (existingQuest.status !== 'active') {
      return NextResponse.json({ error: 'Cannot update a completed or cancelled quest' }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = updateQuestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error }, { status: 400 });
    }

    const updateData = validationResult.data;
    const finalUpdate: any = { ...updateData };

    // Convert date-only "YYYY-MM-DD" input to a full ISO timestamp
    if (finalUpdate.due_date) {
      finalUpdate.due_date = `${finalUpdate.due_date}T23:59:59`;
    }

    if (updateData.difficulty && updateData.difficulty !== existingQuest.difficulty) {
      const rewards = calculateQuestRewards(updateData.difficulty);
      finalUpdate.xp_reward = rewards.xp;
      finalUpdate.gold_reward = rewards.gold;
    }

    const { data, error } = await supabase
      .from('quests')
      .update(finalUpdate)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating quest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
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

    const { data: existingQuest, error: fetchError } = await supabase
      .from('quests')
      .select('status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingQuest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    if (existingQuest.status === 'completed') {
      return NextResponse.json({ error: 'Cannot delete a completed quest' }, { status: 400 });
    }

    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
