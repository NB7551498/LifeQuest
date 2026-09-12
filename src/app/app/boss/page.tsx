import BossClient from './boss-client';

export const metadata = {
  title: 'Boss Battles | LifeQuest',
};

export default function BossPage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-8">
      <BossClient />
    </div>
  );
}
