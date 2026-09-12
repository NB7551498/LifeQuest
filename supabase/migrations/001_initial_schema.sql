-- 001_initial_schema.sql

-- Enable UUID extension just in case (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- Triggers Setup
-- ==========================================

-- Generic function to update the updated_at column
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ==========================================
-- Tables
-- ==========================================

-- 1. profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  gold INTEGER DEFAULT 0,
  title TEXT DEFAULT 'Novice',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger for profiles updated_at
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 2. character_stats
CREATE TABLE character_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  intellect INTEGER DEFAULT 0,
  strength INTEGER DEFAULT 0,
  vitality INTEGER DEFAULT 0,
  discipline INTEGER DEFAULT 0,
  creativity INTEGER DEFAULT 0,
  social INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger for character_stats updated_at
CREATE TRIGGER set_character_stats_updated_at
BEFORE UPDATE ON character_stats
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 3. quests
CREATE TABLE quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- e.g. 'coding', 'fitness', 'learning', 'health', 'creative', 'social', 'other'
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  xp_reward INTEGER NOT NULL,
  gold_reward INTEGER NOT NULL,
  attribute TEXT NOT NULL CHECK (attribute IN ('intellect', 'strength', 'vitality', 'discipline', 'creativity', 'social')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  due_date TIMESTAMPTZ,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 4. quest_completions
CREATE TABLE quest_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  xp_earned INTEGER NOT NULL,
  gold_earned INTEGER NOT NULL,
  attribute_xp INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- 5. streaks
CREATE TABLE streaks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger for streaks updated_at
CREATE TRIGGER set_streaks_updated_at
BEFORE UPDATE ON streaks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 6. items (shop catalog)
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('weapon', 'shield', 'badge', 'theme', 'consumable')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
  price INTEGER NOT NULL,
  icon TEXT NOT NULL,
  effect TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. inventory
CREATE TABLE inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- 8. achievements
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL, -- 'quests', 'streaks', 'levels', 'attributes', 'economy'
  condition_type TEXT NOT NULL, -- 'quests_completed', 'streak_days', 'level_reached', 'attribute_total', 'gold_earned', 'items_purchased', 'quests_completed_daily'
  condition_value INTEGER NOT NULL,
  reward_xp INTEGER DEFAULT 0,
  reward_gold INTEGER DEFAULT 0
);

-- 9. user_achievements
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- 10. transactions
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'xp_earned', 'gold_earned', 'gold_spent', 'achievement_xp', 'achievement_gold', 'streak_bonus'
  amount INTEGER NOT NULL,
  description TEXT,
  reference_type TEXT, -- 'quest', 'achievement', 'shop', 'streak'
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ==========================================
-- Auto-Creation Trigger on Auth.Users
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 1;
BEGIN
  -- Generate a basic username based on email or id
  base_username := COALESCE(
    split_part(NEW.email, '@', 1),
    'user_' || substr(NEW.id::text, 1, 8)
  );
  
  final_username := base_username;
  
  -- Ensure uniqueness of generated username
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := base_username || counter::text;
    counter := counter + 1;
  END LOOP;

  -- 1. Create Profile
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (NEW.id, final_username, NEW.raw_user_meta_data->>'avatar_url');

  -- 2. Create Character Stats
  INSERT INTO public.character_stats (user_id)
  VALUES (NEW.id);

  -- 3. Create Streaks
  INSERT INTO public.streaks (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

-- Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- profiles: Users can read/update their own row
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- character_stats: Users can read/update their own row
CREATE POLICY "Users can read own character_stats" ON character_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own character_stats" ON character_stats FOR UPDATE USING (auth.uid() = user_id);

-- quests: Users can CRUD their own quests
CREATE POLICY "Users can read own quests" ON quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quests" ON quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quests" ON quests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quests" ON quests FOR DELETE USING (auth.uid() = user_id);

-- quest_completions: Users can read their own, insert their own
CREATE POLICY "Users can read own quest_completions" ON quest_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quest_completions" ON quest_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- streaks: Users can read/update their own
CREATE POLICY "Users can read own streaks" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON streaks FOR UPDATE USING (auth.uid() = user_id);

-- items: All authenticated users can read (shop is public)
CREATE POLICY "Items are viewable by all authenticated users" ON items FOR SELECT TO authenticated USING (true);

-- inventory: Users can read their own, insert their own
CREATE POLICY "Users can read own inventory" ON inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory" ON inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inventory" ON inventory FOR UPDATE USING (auth.uid() = user_id);

-- achievements: All authenticated users can read
CREATE POLICY "Achievements are viewable by all authenticated users" ON achievements FOR SELECT TO authenticated USING (true);

-- user_achievements: Users can read their own, insert their own
CREATE POLICY "Users can read own user_achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- transactions: Users can read their own, insert their own
CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- Indexes
-- ==========================================

-- quests
CREATE INDEX idx_quests_user_status ON quests(user_id, status);
CREATE INDEX idx_quests_user_created ON quests(user_id, created_at);

-- quest_completions
CREATE INDEX idx_quest_completions_user_completed ON quest_completions(user_id, completed_at);

-- transactions
CREATE INDEX idx_transactions_user_created ON transactions(user_id, created_at);

-- inventory
CREATE INDEX idx_inventory_user ON inventory(user_id);
