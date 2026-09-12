import GamesClient from './games-client';

export const metadata = {
  title: 'Mini-Games | LifeQuest',
};

export default function GamesPage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-8">
      <GamesClient />
    </div>
  );
}
