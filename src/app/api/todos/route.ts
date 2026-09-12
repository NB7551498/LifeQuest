import { NextResponse } from 'next/server';
import { readDB, writeDB, TodoRecord } from '@/lib/storage/json-db';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day');
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer token_', '') || 'demo-user';

    const db = readDB();
    let todos = db.todos.filter((t) => t.user === userId || t.user === 'demo-user');
    if (day) {
      todos = todos.filter((t) => t.day === day);
    }

    todos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(todos);
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, priority, day } = body;
    const authHeader = request.headers.get('authorization');
    const userId = authHeader?.replace('Bearer token_', '') || 'demo-user';

    if (!text || !text.trim()) {
      return NextResponse.json({ message: 'Text required' }, { status: 400 });
    }

    const todo: TodoRecord = {
      _id: crypto.randomUUID(),
      user: userId,
      text: text.trim(),
      priority: priority || 'medium',
      done: false,
      day: day || 'today',
      createdAt: new Date().toISOString(),
    };

    const db = readDB();
    db.todos.push(todo);
    writeDB(db);

    return NextResponse.json(todo, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}
