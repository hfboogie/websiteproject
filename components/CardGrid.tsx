import { Card } from '@/lib/api/scryfall';

interface CardGridProps {
  cards: Card[];
  isLoading: boolean;
}

export default function CardGrid({ cards, isLoading }: CardGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="p-4 my-4 text-amber-700 bg-amber-100 rounded-lg">
        <p>No cards found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Search Results ({cards.length} cards)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {card.image_uris?.normal ? (
              <img 
                src={card.image_uris.normal} 
                alt={card.name} 
                className="w-full h-auto"
              />
            ) : card.card_faces && card.card_faces[0].image_uris?.normal ? (
              <img 
                src={card.card_faces[0].image_uris.normal} 
                alt={card.name} 
                className="w-full h-auto"
              />
            ) : (
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
            <div className="p-3">
              <h3 className="font-bold text-lg">{card.name}</h3>
              <p className="text-sm text-gray-600">{card.type_line}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-600">{card.set_name} ({card.set.toUpperCase()})</p>
                {card.prices?.usd && (
                  <p className="text-sm font-medium">${card.prices.usd}</p>
                )}
              </div>
              <div className="mt-3 flex justify-between">
                <a 
                  href={card.scryfall_uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  View on Scryfall
                </a>
                {card.purchase_uris?.tcgplayer && (
                  <a 
                    href={card.purchase_uris.tcgplayer} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Buy on TCGPlayer
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
