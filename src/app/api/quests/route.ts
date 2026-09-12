import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createQuestSchema } from '@/lib/validation/schemas';
import { calculateQuestRewards } from '@/lib/rpg/xp-engine';
import { DEMO_QUESTS } from '@/lib/auth/demo-helper';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(DEMO_QUESTS);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const category = searchParams.get('category');
    const attribute = searchParams.get('attribute');

    let query = supabase
      .from('quests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (attribute) {
      query = query.eq('attribute', attribute);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json(DEMO_QUESTS);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(DEMO_QUESTS);
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createQuestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: validationResult.error }, { status: 400 });
    }

    const questData = validationResult.data;
    const rewards = calculateQuestRewards(questData.difficulty);

    // Convert date-only "YYYY-MM-DD" input to a full ISO timestamp
    const dueDate = questData.due_date ? `${questData.due_date}T23:59:59` : null;

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

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating quest:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
