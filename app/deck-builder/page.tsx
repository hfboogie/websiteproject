import DeckBuilder from '@/components/DeckBuilder';

export default function DeckBuilderPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-2">Deck Builder</h1>
        <p className="text-center text-gray-600 mb-8">
          Build and manage your Magic: The Gathering decks
        </p>
        
        <DeckBuilder />
      </div>
    </main>
  );
}
