import { NextResponse } from 'next/server';
import { readDB, writeDB, UserRecord } from '@/lib/storage/json-db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'All fields required' }, { status: 400 });
    }

    const db = readDB();
    const existing = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase()
    );

    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const newUser: UserRecord = {
      _id: crypto.randomUUID(),
      username,
      email,
      password, // stored locally
      level: 1,
      xp: 0,
      totalXP: 0,
      gold: 100,
      quizzesCompleted: 0,
      correctAnswers: 0,
      categoryScores: {
        python: { played: 0, correct: 0 },
        java: { played: 0, correct: 0 },
        gk: { played: 0, correct: 0 },
        news: { played: 0, correct: 0 },
        dosdonts: { played: 0, correct: 0 },
      },
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDB(db);

    const token = `token_${newUser._id}`;
    return NextResponse.json(
      {
        token,
        user: { id: newUser._id, username: newUser.username, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}
