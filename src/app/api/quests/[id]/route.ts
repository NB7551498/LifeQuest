import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateQuestSchema } from '@/lib/validation/schemas';
import { calculateQuestRewards } from '@/lib/rpg/xp-engine';
import { readDB, writeDB } from '@/lib/storage/json-db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('quests')
          .select(`*, quest_completions (*)`)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (!error && data) return NextResponse.json(data);
      }
    } catch {}

    const db = readDB();
    const quest = db.quests.find((q) => q.id === id);
    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    return NextResponse.json(quest);
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
    const { id } = await params;
    const body = await request.json();

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: existingQuest } = await supabase
          .from('quests')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (existingQuest && existingQuest.status === 'active') {
          const validationResult = updateQuestSchema.safeParse(body);
          if (validationResult.success) {
            const updateData = validationResult.data;
            const finalUpdate: any = { ...updateData };
            if (finalUpdate.due_date) finalUpdate.due_date = `${finalUpdate.due_date}T23:59:59`;
            if (updateData.difficulty && updateData.difficulty !== existingQuest.difficulty) {
              const rewards = calculateQuestRewards(updateData.difficulty);
              finalUpdate.xp_reward = rewards.xp;
              finalUpdate.gold_reward = rewards.gold;
            }

            const { data, error } = await supabase
              .from('quests')
              .update(finalUpdate)
              .eq('id', id)
              .single();

            if (!error && data) return NextResponse.json(data);
          }
        }
      }
    } catch {}

    const db = readDB();
    const questIndex = db.quests.findIndex((q) => q.id === id);
    if (questIndex === -1) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    db.quests[questIndex] = {
      ...db.quests[questIndex],
      ...body,
    };
    writeDB(db);

    return NextResponse.json(db.quests[questIndex]);
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
    const { id } = await params;

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from('quests').delete().eq('id', id).eq('user_id', user.id);
        if (!error) return NextResponse.json({ success: true });
      }
    } catch {}

    const db = readDB();
    const questIndex = db.quests.findIndex((q) => q.id === id);
    if (questIndex !== -1) {
      db.quests.splice(questIndex, 1);
      writeDB(db);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
