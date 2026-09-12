-- seed.sql

-- ==========================================
-- Seed Items (12 items)
-- ==========================================
INSERT INTO items (name, description, type, rarity, price, icon, effect) VALUES
('Iron Shield', 'A sturdy iron shield to protect against minor setbacks.', 'shield', 'common', 150, '🛡️', 'Blocks minor damage'),
('Wooden Sword', 'A basic training sword for novices.', 'weapon', 'common', 100, '🗡️', 'Slight attack boost'),
('Bronze Helm', 'Protects your head and gives a small confidence boost.', 'shield', 'uncommon', 250, '⛑️', 'Improves focus'),
('Shadow Blade', 'A dark blade that strikes swiftly.', 'weapon', 'uncommon', 300, '⚔️', 'Agility boost'),
('Crystal Shield', 'A magical shield that deflects negative energy.', 'shield', 'rare', 500, '🔮', 'Magic protection'),
('Flame Sword', 'A sword imbued with the power of fire.', 'weapon', 'rare', 600, '🔥', 'Extra damage'),
('Night Theme', 'Unlocks the dark and mysterious night theme.', 'theme', 'rare', 750, '🌌', 'Changes app appearance'),
('Forest Theme', 'Unlocks the calming forest theme.', 'theme', 'uncommon', 400, '🌲', 'Changes app appearance'),
('Hero Badge', 'A mark of a true hero.', 'badge', 'epic', 1000, '👑', 'Shows off your status'),
('Dragon Slayer Badge', 'Only given to those who have slain a dragon.', 'badge', 'legendary', 2000, '🐉', 'Ultimate status symbol'),
('Streak Freeze', 'Protects your streak for one missed day.', 'consumable', 'rare', 500, '❄️', 'Preserves streak on miss'),
('XP Potion', 'Double XP for your next completed quest.', 'consumable', 'epic', 800, '⚗️', '2x XP on next quest');


-- ==========================================
-- Seed Achievements (15 achievements)
-- ==========================================
INSERT INTO achievements (name, description, icon, category, condition_type, condition_value, reward_xp, reward_gold) VALUES
('First Blood', 'Complete your first quest', '🏆', 'quests', 'quests_completed', 1, 50, 25),
('Getting Started', 'Complete 5 quests', '⚡', 'quests', 'quests_completed', 5, 100, 50),
('Quest Warrior', 'Complete 25 quests', '⚔️', 'quests', 'quests_completed', 25, 250, 100),
('Quest Master', 'Complete 100 quests', '👑', 'quests', 'quests_completed', 100, 500, 250),
('On Fire', 'Reach a 7-day streak', '🔥', 'streaks', 'streak_days', 7, 150, 100),
('Unstoppable', 'Reach a 30-day streak', '💪', 'streaks', 'streak_days', 30, 500, 300),
('Immortal Streak', 'Reach a 100-day streak', '♾️', 'streaks', 'streak_days', 100, 1000, 500),
('Adventurer', 'Reach level 10', '🗺️', 'levels', 'level_reached', 10, 200, 100),
('Warrior', 'Reach level 25', '⚔️', 'levels', 'level_reached', 25, 500, 250),
('Legend', 'Reach level 50', '🌟', 'levels', 'level_reached', 50, 1000, 500),
('Scholar', 'Reach 500 total intellect', '🧠', 'attributes', 'attribute_total', 500, 200, 100),
('Titan', 'Reach 500 total strength', '💪', 'attributes', 'attribute_total', 500, 200, 100),
('Wealthy', 'Earn 5000 total gold', '💰', 'economy', 'gold_earned', 5000, 300, 200),
('Collector', 'Purchase 5 items from the shop', '🎒', 'economy', 'items_purchased', 5, 200, 100),
('Speed Runner', 'Complete 5 quests in one day', '⚡', 'quests', 'quests_completed_daily', 5, 300, 150);
