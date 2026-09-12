import { NextResponse } from 'next/server';
import { readDB } from '@/lib/storage/json-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'All fields required' }, { status: 400 });
    }

    const db = readDB();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = `token_${user._id}`;
    return NextResponse.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}
