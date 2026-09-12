import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/storage/json-db';

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer token_', '') || 'demo-user';

    const db = readDB();
    const userIndex = db.users.findIndex((u) => u._id === userId);

    if (userIndex !== -1) {
      db.users[userIndex] = {
        ...db.users[userIndex],
        level: 1,
        xp: 0,
        totalXP: 0,
        quizzesCompleted: 0,
        correctAnswers: 0,
        categoryScores: {
          python: { played: 0, correct: 0 },
          java: { played: 0, correct: 0 },
          gk: { played: 0, correct: 0 },
          news: { played: 0, correct: 0 },
          dosdonts: { played: 0, correct: 0 },
        },
      };
    }

    db.todos = db.todos.filter((t) => t.user !== userId);
    writeDB(db);

    return NextResponse.json({ message: 'All data reset' });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}
