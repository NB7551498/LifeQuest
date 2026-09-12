export interface TitleInfo {
  minLevel: number;
  title: string;
}

const TITLES: TitleInfo[] = [
  { minLevel: 1, title: 'Novice' },
  { minLevel: 5, title: 'Apprentice' },
  { minLevel: 10, title: 'Adventurer' },
  { minLevel: 15, title: 'Journeyman' },
  { minLevel: 20, title: 'Warrior' },
  { minLevel: 25, title: 'Veteran' },
  { minLevel: 30, title: 'Elite' },
  { minLevel: 40, title: 'Champion' },
  { minLevel: 50, title: 'Master' },
  { minLevel: 75, title: 'Grandmaster' },
  { minLevel: 100, title: 'Legend' },
];

/**
 * Retrieves the appropriate title for a given level.
 * 
 * @param level - The player's current level.
 * @returns The title string.
 */
export function getTitleForLevel(level: number): string {
  let currentTitle = TITLES[0].title;
  
  for (const t of TITLES) {
    if (level >= t.minLevel) {
      currentTitle = t.title;
    } else {
      break;
    }
  }
  
  return currentTitle;
}

/**
 * Determines the next available title and the level required to achieve it.
 * 
 * @param level - The player's current level.
 * @returns The next title and level requirement, or null if highest title achieved.
 */
export function getNextTitle(level: number): { title: string; levelRequired: number } | null {
  for (const t of TITLES) {
    if (t.minLevel > level) {
      return {
        title: t.title,
        levelRequired: t.minLevel,
      };
    }
  }
  return null;
}

/**
 * Returns all available titles.
 * 
 * @returns Array of all TitleInfo objects.
 */
export function getAllTitles(): TitleInfo[] {
  return [...TITLES];
}
