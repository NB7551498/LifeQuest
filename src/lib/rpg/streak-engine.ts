import { STREAK_MILESTONES } from './constants';

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  isNewDay: boolean;       // true if this is the first activity today
  streakBroken: boolean;   // true if streak was reset
}

export interface StreakBonus {
  bonusXp: number;
  bonusGold: number;
}

export interface StreakMilestone {
  days: number;
  bonusXp: number;
  bonusGold: number;
  label: string;
}

export interface WeekDay {
  date: string;
  dayLabel: string; // M, T, W, T, F, S, S
  completed: boolean;
}

/**
 * Calculates the new streak status based on the last activity date.
 * Relies on YYYY-MM-DD date strings to avoid timezone complications.
 * 
 * @param lastActivityDate - The date string of the last recorded activity (YYYY-MM-DD) or null.
 * @param currentDate - The current date string (YYYY-MM-DD).
 * @param currentStreak - The current streak count before this activity.
 * @param longestStreak - The historical longest streak count.
 * @returns The updated streak result.
 */
export function calculateStreak(
  lastActivityDate: string | null,
  currentDate: string,
  currentStreak: number,
  longestStreak: number
): StreakResult {
  if (!lastActivityDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, longestStreak),
      isNewDay: true,
      streakBroken: false,
    };
  }

  if (lastActivityDate === currentDate) {
    return {
      currentStreak,
      longestStreak,
      isNewDay: false,
      streakBroken: false,
    };
  }

  // To check if last activity was yesterday, parse them as local dates (YYYY-MM-DD forces UTC if not careful, but splitting gives local parts)
  const [lYear, lMonth, lDay] = lastActivityDate.split('-').map(Number);
  const [cYear, cMonth, cDay] = currentDate.split('-').map(Number);
  
  const lastDate = new Date(lYear, lMonth - 1, lDay);
  const currDate = new Date(cYear, cMonth - 1, cDay);
  
  const diffTime = currDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    const newStreak = currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, longestStreak),
      isNewDay: true,
      streakBroken: false,
    };
  }

  return {
    currentStreak: 1,
    longestStreak: Math.max(1, longestStreak),
    isNewDay: true,
    streakBroken: true, // Activity was > 1 day ago
  };
}

/**
 * Calculates daily bonus rewards based on the current active streak length.
 * 
 * @param currentStreak - The current daily streak count.
 * @returns The daily streak bonus for XP and gold.
 */
export function getStreakBonus(currentStreak: number): StreakBonus {
  if (currentStreak < 1) return { bonusXp: 0, bonusGold: 0 };
  
  if (currentStreak <= 2) {
    return { bonusXp: 5, bonusGold: 2 };
  } else if (currentStreak <= 6) {
    return { bonusXp: 10, bonusGold: 5 };
  } else if (currentStreak <= 13) {
    return { bonusXp: 20, bonusGold: 10 };
  } else if (currentStreak <= 29) {
    return { bonusXp: 30, bonusGold: 15 };
  } else {
    return { bonusXp: 50, bonusGold: 25 };
  }
}

/**
 * Checks if a streak milestone was just crossed between the previous and new streak lengths.
 * 
 * @param previousStreak - The streak length before the update.
 * @param newStreak - The streak length after the update.
 * @returns The milestone crossed, or null if no milestone was crossed.
 */
export function checkStreakMilestone(previousStreak: number, newStreak: number): StreakMilestone | null {
  for (const milestone of STREAK_MILESTONES) {
    if (previousStreak < milestone.days && newStreak >= milestone.days) {
      return milestone;
    }
  }
  return null;
}

/**
 * Retrieves the weekly activity status given an array of completion dates.
 * Always returns 7 days ending with the reference date or aligned to a specific week format (Mon-Sun).
 * Assuming standard 7 days ending on referenceDate for simplicity here, or aligned to the week containing referenceDate.
 * 
 * @param completionDates - Array of dates when activities were completed (YYYY-MM-DD).
 * @param referenceDate - The reference date (YYYY-MM-DD) representing today.
 * @returns Array of WeekDay representing the 7 days of the week.
 */
export function getWeekActivity(completionDates: string[], referenceDate: string): WeekDay[] {
  const [rYear, rMonth, rDay] = referenceDate.split('-').map(Number);
  const refDateObj = new Date(rYear, rMonth - 1, rDay);
  
  // Align to Monday as start of week
  const dayOfWeek = refDateObj.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 is Sunday
  
  const monday = new Date(refDateObj);
  monday.setDate(monday.getDate() - diffToMonday);

  const daysLabel = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekDays: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    weekDays.push({
      date: dateStr,
      dayLabel: daysLabel[i],
      completed: completionDates.includes(dateStr),
    });
  }

  return weekDays;
}
