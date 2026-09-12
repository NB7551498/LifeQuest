import { NextResponse } from 'next/server';

const CATEGORIES = [
  { id: 'python', name: 'Python', questionCount: 6 },
  { id: 'java', name: 'Java', questionCount: 6 },
  { id: 'gk', name: 'General Knowledge', questionCount: 6 },
  { id: 'news', name: 'Current News', questionCount: 6 },
  { id: 'dosdonts', name: "Do's & Don'ts", questionCount: 6 },
];

export async function GET() {
  return NextResponse.json(CATEGORIES);
}
