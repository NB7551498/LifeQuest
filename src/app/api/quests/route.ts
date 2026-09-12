import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createQuestSchema } from '@/lib/validation/schemas';
import { calculateQuestRewards } from '@/lib/rpg/xp-engine';
import { readDB, writeDB, QuestRecord } from '@/lib/storage/json-db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category');
    const attribute = searchParams.get('attribute');
    const day = searchParams.get('day');

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        let query = supabase
          .from('quests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (status !== 'all') query = query.eq('status', status);
        if (category) query = query.eq('category', category);
        if (attribute) query = query.eq('attribute', attribute);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return NextResponse.json(data);
        }
      }
    } catch {}

    // Fallback to local persistent JSON database
    const db = readDB();
    let quests = [...db.quests];

    if (status !== 'all') {
      quests = quests.filter((q) => q.status === status);
    }
    if (category && category !== 'all') {
      quests = quests.filter((q) => q.category === category);
    }
    if (attribute && attribute !== 'all') {
      quests = quests.filter((q) => q.attribute === attribute);
    }
    if (day) {
      quests = quests.filter((q) => q.day === day || !q.day);
    }

    return NextResponse.json(quests);
  } catch (error) {
    const db = readDB();
    return NextResponse.json(db.quests || []);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = createQuestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error }, { status: 400 });
    }

    const questData = validationResult.data;
    const rewards = calculateQuestRewards(questData.difficulty);
    const dueDate = questData.due_date ? `${questData.due_date}T23:59:59` : null;

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('quests')
          .insert({
            user_id: user.id,
            title: questData.title,
            description: questData.description,
            difficulty: questData.difficulty,
            category: questData.category,
            attribute: questData.attribute,
            status: 'active',
            due_date: dueDate,
            is_recurring: questData.is_recurring ?? false,
            xp_reward: rewards.xp,
            gold_reward: rewards.gold
          })
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json(data, { status: 201 });
        }
      }
    } catch {}

    // Fallback to local persistent JSON database
    const newQuest: QuestRecord = {
      id: `quest-${crypto.randomUUID()}`,
      user_id: 'demo-hero-id',
      title: questData.title,
      description: questData.description || '',
      category: questData.category,
      difficulty: questData.difficulty,
      xp_reward: rewards.xp,
      gold_reward: rewards.gold,
      attribute: questData.attribute,
      status: 'active',
      due_date: dueDate,
      is_recurring: questData.is_recurring ?? false,
      created_at: new Date().toISOString(),
      day: (body.day as string) || 'today',
      priority: (body.priority as any) || 'medium',
    };

    const db = readDB();
    db.quests.unshift(newQuest);
    writeDB(db);

    return NextResponse.json(newQuest, { status: 201 });
  } catch (error) {
    console.error('Error creating quest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
