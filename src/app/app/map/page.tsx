import MapClient from './map-client';

export const metadata = {
  title: 'World Map | LifeQuest',
};

export default function MapPage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-8">
      <MapClient />
    </div>
  );
}
