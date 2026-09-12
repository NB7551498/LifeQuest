import fs from 'fs';
import path from 'path';

export interface UserRecord {
  _id: string;
  username: string;
  email: string;
  password?: string;
  level: number;
  xp: number;
  totalXP: number;
  quizzesCompleted: number;
  correctAnswers: number;
  categoryScores: Record<string, { played: number; correct: number }>;
  createdAt: string;
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

interface DBData {
  users: UserRecord[];
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
      const initial: DBData = { users: [], todos: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { users: [], todos: [] };
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
