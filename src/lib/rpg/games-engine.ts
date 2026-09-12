export interface GameReward {
  xp: number;
  gold: number;
  attributeXp: number;
  attribute: string;
  rank: 'Mythic' | 'Legendary' | 'Epic' | 'Rare' | 'Common';
}

/**
 * Calculates rewards for the ⚡ Reaction Challenge mini-game based on response time in ms.
 */
export function calculateReactionReward(reactionMs: number): GameReward {
  if (reactionMs <= 200) {
    return { xp: 120, gold: 50, attributeXp: 40, attribute: 'discipline', rank: 'Mythic' };
  } else if (reactionMs <= 280) {
    return { xp: 80, gold: 30, attributeXp: 25, attribute: 'discipline', rank: 'Legendary' };
  } else if (reactionMs <= 380) {
    return { xp: 50, gold: 20, attributeXp: 15, attribute: 'discipline', rank: 'Rare' };
  } else {
    return { xp: 25, gold: 10, attributeXp: 10, attribute: 'discipline', rank: 'Common' };
  }
}

/**
 * Calculates rewards for the 🧠 Memory Cards trial based on pairs matched and total moves taken.
 */
export function calculateMemoryReward(pairsMatched: number, movesTaken: number, totalPairs: number = 6): GameReward {
  const accuracyRatio = Math.max(0, 1 - (movesTaken - totalPairs) / (totalPairs * 2));
  const xp = Math.floor(100 * accuracyRatio) + pairsMatched * 10;
  const gold = Math.floor(40 * accuracyRatio);

  let rank: GameReward['rank'] = 'Common';
  if (accuracyRatio >= 0.9) rank = 'Mythic';
  else if (accuracyRatio >= 0.75) rank = 'Legendary';
  else if (accuracyRatio >= 0.5) rank = 'Rare';

  return {
    xp: Math.max(20, xp),
    gold: Math.max(10, gold),
    attributeXp: Math.max(15, Math.floor(xp * 0.4)),
    attribute: 'intellect',
    rank,
  };
}

/**
 * Calculates rewards for 🔢 Number Sprint based on questions answered correctly in 10s.
 */
export function calculateSprintReward(correctCount: number): GameReward {
  const xp = correctCount * 25;
  const gold = correctCount * 10;

  let rank: GameReward['rank'] = 'Common';
  if (correctCount >= 8) rank = 'Mythic';
  else if (correctCount >= 5) rank = 'Legendary';
  else if (correctCount >= 3) rank = 'Rare';

  return {
    xp: Math.max(15, xp),
    gold: Math.max(5, gold),
    attributeXp: Math.max(10, Math.floor(xp * 0.35)),
    attribute: 'intellect',
    rank,
  };
}

/**
 * Calculates rewards for 🧩 Logic Dungeon based on room level cleared.
 */
export function calculateLogicReward(roomLevel: number): GameReward {
  const xp = roomLevel * 30;
  const gold = roomLevel * 15;

  let rank: GameReward['rank'] = 'Common';
  if (roomLevel >= 8) rank = 'Mythic';
  else if (roomLevel >= 5) rank = 'Legendary';
  else if (roomLevel >= 3) rank = 'Rare';

  return {
    xp: Math.max(25, xp),
    gold: Math.max(10, gold),
    attributeXp: Math.max(15, Math.floor(xp * 0.4)),
    attribute: 'intellect',
    rank,
  };
}
