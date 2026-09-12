import fs from 'fs';
import path from 'path';
import { DEMO_PROFILE, DEMO_QUESTS, DEMO_INVENTORY } from '@/lib/auth/demo-helper';

export interface UserRecord {
  _id: string;
  username: string;
  email: string;
  password?: string;
  level: number;
  xp: number;
  totalXP: number;
  gold: number;
  quizzesCompleted: number;
  correctAnswers: number;
  categoryScores: Record<string, { played: number; correct: number }>;
  createdAt: string;
}

export interface QuestRecord {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xp_reward: number;
  gold_reward: number;
  attribute: string;
  status: 'active' | 'completed';
  due_date?: string | null;
  is_recurring?: boolean;
  created_at: string;
  day?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TodoRecord {
  _id: string;
  user: string;
  text: string;
  priority: 'low' | 'medium' | 'high';
  done: boolean;
  day: string;
  createdAt: string;
}

export interface DBData {
  users: UserRecord[];
  quests: QuestRecord[];
  profile: any;
  inventory: any[];
  todos: TodoRecord[];
}

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

function ensureDB(): DBData {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial: DBData = {
        users: [
          {
            _id: 'demo-hero-id',
            username: DEMO_PROFILE.username,
            email: DEMO_PROFILE.email,
            level: DEMO_PROFILE.level,
            xp: DEMO_PROFILE.total_xp % 100,
            totalXP: DEMO_PROFILE.total_xp,
            gold: DEMO_PROFILE.gold,
            quizzesCompleted: 0,
            correctAnswers: 0,
            categoryScores: {},
            createdAt: new Date().toISOString(),
          },
        ],
        quests: DEMO_QUESTS as QuestRecord[],
        profile: DEMO_PROFILE,
        inventory: DEMO_INVENTORY,
        todos: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.quests) data.quests = DEMO_QUESTS;
    if (!data.profile) data.profile = DEMO_PROFILE;
    if (!data.inventory) data.inventory = DEMO_INVENTORY;
    if (!data.todos) data.todos = [];
    return data;
  } catch {
    return {
      users: [],
      quests: DEMO_QUESTS as QuestRecord[],
      profile: DEMO_PROFILE,
      inventory: DEMO_INVENTORY,
      todos: [],
    };
  }
}

export function readDB(): DBData {
  return ensureDB();
}

export function writeDB(data: DBData): void {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}
