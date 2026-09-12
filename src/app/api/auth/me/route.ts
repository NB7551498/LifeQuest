import { NextResponse } from 'next/server';
import { readDB } from '@/lib/storage/json-db';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  const userId = token ? token.replace('token_', '') : null;

  const db = readDB();
  const user = db.users.find((u) => u._id === userId) || db.users[0];

  if (!user) {
    return NextResponse.json(
      { user: { id: 'demo-user', username: 'Demo Hero', email: 'demo@lifequest.app' } },
      { status: 200 }
    );
  }

  return NextResponse.json({
    user: { id: user._id, username: user.username, email: user.email },
  });
}
