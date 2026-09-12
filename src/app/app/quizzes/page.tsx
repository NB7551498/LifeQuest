import QuizzesClient from './quizzes-client';

export const metadata = {
  title: 'Knowledge Arena & Quizzes | LifeQuest',
};

export default function QuizzesPage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-8">
      <QuizzesClient />
    </div>
  );
}
