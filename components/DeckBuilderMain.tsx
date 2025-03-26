"use client";

import { useState } from 'react';
import { Card } from '@/lib/api/scryfall';
import { searchCards } from '@/lib/api/scryfall';
import { translateToScryfallSyntax } from '@/lib/api/openai';
import CardGrid from './CardGrid';

interface DeckBuilderMainProps {
  deck: any;
  searchResults: Card[];
  setSearchResults: (results: Card[]) => void;
  addCardToDeck: (card: Card) => void;
  removeCardFromDeck: (cardId: string) => void;
  moveCardToCategory: (cardId: string, category: string) => void;
  activeCategory: string | null;
}

export default function DeckBuilderMain({
  deck,
  searchResults,
  setSearchResults,
  addCardToDeck,
  removeCardFromDeck,
  moveCardToCategory,
  activeCategory
}: DeckBuilderMainProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedQuery, setTranslatedQuery] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'deck'>('search');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setTranslatedQuery(null);
    setSearchResults([]);
    
    try {
      // Translate natural language query to Scryfall syntax
      const translated = await translateToScryfallSyntax(query);
      setTranslatedQuery(translated);
      
      // Search cards using the translated query
      const results = await searchCards(translated);
      setSearchResults(results.data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search cards');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter deck cards by active category
  const filteredDeckCards = activeCategory
    ? deck.cards.filter((card: any) => card.category === activeCategory)
    : deck.cards;

  // Group cards by category
  const cardsByCategory = deck.cards.reduce((acc: any, card: any) => {
    const category = card.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(card);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4 border-b">
        <div className="flex">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'search'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('search')}
          >
            Search Cards
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'deck'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('deck')}
          >
            Deck ({deck.cards.reduce((total: number, card: any) => total + card.count, 0)})
          </button>
        </div>
      </div>

      {activeTab === 'search' && (
        <div>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for cards to add to your deck..."
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          {translatedQuery && !error && (
            <div className="p-4 mb-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Translated to Scryfall syntax:</p>
              <p className="font-mono text-gray-800">{translatedQuery}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Search Results ({searchResults.length} cards)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((card) => (
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
                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={() => addCardToDeck(card)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Add to Deck
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && !isLoading && query && (
            <div className="p-4 my-4 text-amber-700 bg-amber-100 rounded-lg">
              <p>No cards found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'deck' && (
        <div>
          {deck.cards.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-xl font-medium text-gray-600 mb-2">Your deck is empty</h3>
              <p className="text-gray-500">Search for cards and add them to your deck</p>
            </div>
          ) : activeCategory ? (
            <div>
              <h2 className="text-xl font-bold mb-4">{activeCategory} ({filteredDeckCards.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredDeckCards.map((card: any) => (
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
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">{card.name}</h3>
                        <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">x{card.count}</span>
                      </div>
                      <p className="text-sm text-gray-600">{card.type_line}</p>
                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={() => removeCardFromDeck(card.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                        <select
                          value={card.category || ''}
                          onChange={(e) => moveCardToCategory(card.id, e.target.value)}
                          className="text-sm border rounded p-1"
                        >
                          {deck.categories.map((category: string) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4">All Cards ({deck.cards.length})</h2>
              {Object.entries(cardsByCategory).map(([category, cards]: [string, any]) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">{category} ({cards.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cards.map((card: any) => (
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
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">{card.name}</h3>
                            <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">x{card.count}</span>
                          </div>
                          <p className="text-sm text-gray-600">{card.type_line}</p>
                          <div className="mt-3 flex justify-between">
                            <button
                              onClick={() => removeCardFromDeck(card.id)}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              Remove
                            </button>
                            <select
                              value={card.category || ''}
                              onChange={(e) => moveCardToCategory(card.id, e.target.value)}
                              className="text-sm border rounded p-1"
                            >
                              {deck.categories.map((category: string) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
