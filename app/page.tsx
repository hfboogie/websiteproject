import SearchPage from '@/components/SearchPage';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12 lg:p-24">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-2">MTG Card Search</h1>
        <p className="text-center text-gray-600 mb-8">
          Search for Magic: The Gathering cards using natural language
        </p>
        
        <SearchPage />
      </div>
    </main>
  );
}
