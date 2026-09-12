import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/storage/json-db';

export async function DELETE(
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

    db.todos.splice(todoIndex, 1);
    writeDB(db);

    return NextResponse.json({ message: 'Deleted' });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Server error' }, { status: 500 });
  }
}
