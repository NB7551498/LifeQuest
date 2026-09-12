import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateProfileSchema } from '@/lib/validation/schemas';
import { calculateLevelFromXp } from '@/lib/rpg/xp-engine';
import { readDB, writeDB } from '@/lib/storage/json-db';
import { DEMO_PROFILE } from '@/lib/auth/demo-helper';

export async function GET() {
  try {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const [{ data: profile }, { data: characterStats }, { data: streak }] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('character_stats').select('*').eq('user_id', user.id).single(),
          supabase.from('streaks').select('*').eq('user_id', user.id).single()
        ]);

        if (profile) {
          const levelInfo = calculateLevelFromXp(profile.total_xp);
          return NextResponse.json({
            ...profile,
            levelInfo,
            character_stats: characterStats || DEMO_PROFILE.character_stats,
            streak: streak || DEMO_PROFILE.streak
          });
        }
      }
    } catch {}

    const db = readDB();
    const profile = db.profile || DEMO_PROFILE;
    const levelInfo = calculateLevelFromXp(profile.total_xp || 2480);

    return NextResponse.json({
      ...profile,
      levelInfo,
      character_stats: profile.character_stats || DEMO_PROFILE.character_stats,
      streak: profile.streak || DEMO_PROFILE.streak
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(DEMO_PROFILE);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const validationResult = updateProfileSchema.safeParse(body);
        if (validationResult.success) {
          const { data, error } = await supabase
            .from('profiles')
            .update(validationResult.data)
            .eq('id', user.id)
            .select()
            .single();

          if (!error && data) return NextResponse.json(data);
        }
      }
    } catch {}

    const db = readDB();
    db.profile = {
      ...(db.profile || DEMO_PROFILE),
      ...body
    };
    writeDB(db);

    return NextResponse.json(db.profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
