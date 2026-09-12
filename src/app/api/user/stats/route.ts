import { NextResponse } from 'next/server';
import { readDB } from '@/lib/storage/json-db';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer token_', '') || 'demo-user';

    const db = readDB();
    const user = db.users.find((u) => u._id === userId) || db.users[0];

    const todosCompleted = db.todos.filter(
      (t) => (t.user === userId || t.user === 'demo-user') && t.done
    ).length;

    if (!user) {
      return NextResponse.json({
        level: 1,
        xp: 0,
        totalXP: 0,
        quizzesCompleted: 0,
        correctAnswers: 0,
        todosCompleted,
        categoryScores: {
          python: { played: 0, correct: 0 },
          java: { played: 0, correct: 0 },
          gk: { played: 0, correct: 0 },
          news: { played: 0, correct: 0 },
          dosdonts: { played: 0, correct: 0 },
        },
      });
    }

    return NextResponse.json({
      level: user.level,
      xp: user.xp,
      totalXP: user.totalXP,
      quizzesCompleted: user.quizzesCompleted,
      correctAnswers: user.correctAnswers,
      todosCompleted,
      categoryScores: user.categoryScores,
    });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}
