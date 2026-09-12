import assert from 'node:assert';
import { test, describe } from 'node:test';
import {
  calculateReactionReward,
  calculateMemoryReward,
  calculateSprintReward,
  calculateLogicReward,
} from '../games-engine';
import { calculateQuestDamage, INITIAL_BOSSES } from '../boss-engine';
import { QUIZ_CATEGORIES } from '../quiz-data';

describe('Mini-Games, Quizzes & Boss Battle Mechanics', () => {
  describe('Mini-Games Scoring & Rewards', () => {
    test('calculateReactionReward assigns correct rank and rewards based on millisecond speed', () => {
      const fast = calculateReactionReward(180);
      assert.strictEqual(fast.rank, 'Mythic');
      assert.strictEqual(fast.xp, 120);

      const slow = calculateReactionReward(450);
      assert.strictEqual(slow.rank, 'Common');
      assert.strictEqual(slow.xp, 25);
    });

    test('calculateMemoryReward rewards high accuracy matching', () => {
      const perfect = calculateMemoryReward(6, 6, 6);
      assert.strictEqual(perfect.rank, 'Mythic');
      assert.strictEqual(perfect.xp >= 100, true);
    });

    test('calculateSprintReward scales XP and gold per correct answer', () => {
      const sprint = calculateSprintReward(5);
      assert.strictEqual(sprint.xp, 125);
      assert.strictEqual(sprint.gold, 50);
      assert.strictEqual(sprint.rank, 'Legendary');
    });

    test('calculateLogicReward scales with room dungeon depth', () => {
      const room5 = calculateLogicReward(5);
      assert.strictEqual(room5.xp, 150);
      assert.strictEqual(room5.gold, 75);
    });
  });

  describe('Boss Battles & Quest Damage', () => {
    test('calculateQuestDamage assigns correct HP damage based on quest difficulty', () => {
      assert.strictEqual(calculateQuestDamage('easy'), 15);
      assert.strictEqual(calculateQuestDamage('medium'), 35);
      assert.strictEqual(calculateQuestDamage('hard'), 75);
    });

    test('INITIAL_BOSSES contains valid quest damage criteria and rewards', () => {
      assert.strictEqual(INITIAL_BOSSES.length >= 3, true);
      const examBoss = INITIAL_BOSSES.find((b) => b.id === 'boss-exam');
      assert.notStrictEqual(examBoss, undefined);
      assert.strictEqual(examBoss?.rewardTitle, 'Master Scholar');
    });
  });

  describe('Quiz Data Catalog', () => {
    test('QUIZ_CATEGORIES contains Programming, Academics, and General Knowledge', () => {
      assert.strictEqual(QUIZ_CATEGORIES.length >= 3, true);
      const prog = QUIZ_CATEGORIES.find((c) => c.id === 'programming');
      assert.notStrictEqual(prog, undefined);
      assert.strictEqual(prog?.attribute, 'intellect');
    });
  });
});
