import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  xpRequiredForLevel,
  totalXpForLevel,
  calculateLevelFromXp,
  calculateQuestRewards,
  calculateStreak,
  getStreakBonus,
  checkStreakMilestone,
  getTitleForLevel,
  getNextTitle,
  checkNewAchievements,
  Achievement,
} from '../index';

describe('LifeQuest RPG Engine', () => {
  describe('XP & Level Engine', () => {
    test('xpRequiredForLevel uses non-linear formula (100 * level^1.5)', () => {
      assert.strictEqual(xpRequiredForLevel(1), 100);
      assert.strictEqual(xpRequiredForLevel(2), 282); // floor(100 * 2^1.5) = floor(282.84) = 282
      assert.strictEqual(xpRequiredForLevel(3), 519); // floor(100 * 3^1.5) = floor(519.61) = 519
      assert.strictEqual(xpRequiredForLevel(4), 800);
      assert.strictEqual(xpRequiredForLevel(10), 3162);
    });

    test('totalXpForLevel accumulates correctly', () => {
      assert.strictEqual(totalXpForLevel(1), 0);
      assert.strictEqual(totalXpForLevel(2), 100);
      assert.strictEqual(totalXpForLevel(3), 100 + 282);
    });

    test('calculateLevelFromXp returns accurate LevelInfo', () => {
      // 0 XP -> Level 1 (0 / 100 XP)
      const level1 = calculateLevelFromXp(0);
      assert.strictEqual(level1.level, 1);
      assert.strictEqual(level1.currentLevelXp, 0);
      assert.strictEqual(level1.xpForNextLevel, 100);
      assert.strictEqual(level1.progress, 0);

      // 50 XP -> Level 1 (50 / 100 XP)
      const level1Half = calculateLevelFromXp(50);
      assert.strictEqual(level1Half.level, 1);
      assert.strictEqual(level1Half.currentLevelXp, 50);
      assert.strictEqual(level1Half.progress, 0.5);

      // 100 XP -> Level 2 (0 / 282 XP)
      const level2 = calculateLevelFromXp(100);
      assert.strictEqual(level2.level, 2);
      assert.strictEqual(level2.currentLevelXp, 0);
      assert.strictEqual(level2.xpForNextLevel, 282);

      // 382 XP -> Level 3 (0 / 519 XP)
      const level3 = calculateLevelFromXp(382);
      assert.strictEqual(level3.level, 3);
      assert.strictEqual(level3.currentLevelXp, 0);
    });

    test('calculateQuestRewards scales by difficulty multiplier', () => {
      const easy = calculateQuestRewards('easy');
      const medium = calculateQuestRewards('medium');
      const hard = calculateQuestRewards('hard');

      assert.strictEqual(easy.xp, 30);
      assert.strictEqual(easy.gold, 10);
      assert.strictEqual(medium.xp, 60);
      assert.strictEqual(medium.gold, 20);
      assert.strictEqual(hard.xp, 90);
      assert.strictEqual(hard.gold, 30);
    });
  });

  describe('Streak Engine', () => {
    test('first activity ever initializes streak to 1', () => {
      const res = calculateStreak(null, '2026-09-12', 0, 0);
      assert.strictEqual(res.currentStreak, 1);
      assert.strictEqual(res.longestStreak, 1);
      assert.strictEqual(res.isNewDay, true);
      assert.strictEqual(res.streakBroken, false);
    });

    test('same-day activity maintains current streak', () => {
      const res = calculateStreak('2026-09-12', '2026-09-12', 5, 5);
      assert.strictEqual(res.currentStreak, 5);
      assert.strictEqual(res.isNewDay, false);
      assert.strictEqual(res.streakBroken, false);
    });

    test('next consecutive day increments streak', () => {
      const res = calculateStreak('2026-09-11', '2026-09-12', 5, 5);
      assert.strictEqual(res.currentStreak, 6);
      assert.strictEqual(res.longestStreak, 6);
      assert.strictEqual(res.isNewDay, true);
      assert.strictEqual(res.streakBroken, false);
    });

    test('missed day resets streak to 1', () => {
      const res = calculateStreak('2026-09-09', '2026-09-12', 10, 10);
      assert.strictEqual(res.currentStreak, 1);
      assert.strictEqual(res.longestStreak, 10);
      assert.strictEqual(res.isNewDay, true);
      assert.strictEqual(res.streakBroken, true);
    });

    test('streak milestone triggers correctly', () => {
      const milestone3 = checkStreakMilestone(2, 3);
      assert.notStrictEqual(milestone3, null);
      assert.strictEqual(milestone3?.days, 3);

      const noMilestone = checkStreakMilestone(3, 4);
      assert.strictEqual(noMilestone, null);

      const milestone7 = checkStreakMilestone(6, 7);
      assert.strictEqual(milestone7?.days, 7);
    });
  });

  describe('Title & Achievement Engines', () => {
    test('getTitleForLevel maps levels to correct RPG titles', () => {
      assert.strictEqual(getTitleForLevel(1), 'Novice');
      assert.strictEqual(getTitleForLevel(4), 'Novice');
      assert.strictEqual(getTitleForLevel(5), 'Apprentice');
      assert.strictEqual(getTitleForLevel(10), 'Adventurer');
      assert.strictEqual(getTitleForLevel(50), 'Master');
      assert.strictEqual(getTitleForLevel(100), 'Legend');
    });

    test('getNextTitle returns upcoming title threshold', () => {
      const next = getNextTitle(7);
      assert.strictEqual(next?.title, 'Adventurer');
      assert.strictEqual(next?.levelRequired, 10);
    });

    test('checkNewAchievements detects unearned milestones', () => {
      const sampleAchievements: Achievement[] = [
        {
          id: 'first_quest',
          name: 'First Blood',
          description: 'Complete 1 quest',
          icon: '⚔️',
          rewardXp: 50,
          rewardGold: 25,
          evaluate: (stats) => stats.totalQuestsCompleted >= 1,
        },
        {
          id: 'streak_7',
          name: 'On Fire',
          description: '7-day streak',
          icon: '🔥',
          rewardXp: 150,
          rewardGold: 100,
          evaluate: (stats) => stats.currentStreak >= 7,
        },
      ];

      const unlocked = checkNewAchievements(
        {
          totalQuestsCompleted: 1,
          currentStreak: 2,
          currentLevel: 1,
          totalAttributeXp: {},
          totalGoldEarned: 10,
          totalItemsPurchased: 0,
          questsCompletedToday: 1,
        },
        sampleAchievements,
        []
      );

      assert.strictEqual(unlocked.length, 1);
      assert.strictEqual(unlocked[0].id, 'first_quest');
    });
  });
});
