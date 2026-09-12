import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/storage/json-db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDB();
    const todoIndex = db.todos.findIndex((t) => t._id === id);

    if (todoIndex === -1) {
      return NextResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    db.todos[todoIndex].done = !db.todos[todoIndex].done;
    writeDB(db);

    return NextResponse.json(db.todos[todoIndex]);
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}
