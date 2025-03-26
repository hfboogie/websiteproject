"use client";

import { useState, useEffect } from 'react';
import { searchCards } from '@/lib/api/scryfall';
import { translateToScryfallSyntax } from '@/lib/api/openai';
import CardFilter, { FilterOptions } from '@/components/CardFilter';
import CardGrid from '@/components/CardGrid';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedQuery, setTranslatedQuery] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [filteredResults, setFilteredResults] = useState<any[] | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Apply filters whenever search results or filters change
  useEffect(() => {
    if (!searchResults) {
      setFilteredResults(null);
      return;
    }

    let results = [...searchResults];

    // Filter by colors
    if (filters.colors && filters.colors.length > 0) {
      results = results.filter(card => {
        const cardColors = card.colors || [];
        return filters.colors.some(color => cardColors.includes(color));
      });
    }

    // Filter by rarity
    if (filters.rarity && filters.rarity.length > 0) {
      results = results.filter(card => 
        filters.rarity?.includes(card.rarity)
      );
    }

    // Filter by type
    if (filters.type && filters.type.length > 0) {
      results = results.filter(card => {
        const typeLine = card.type_line.toLowerCase();
        return filters.type?.some(type => typeLine.includes(type.toLowerCase()));
      });
    }

    // Sort results
    if (filters.sortBy) {
      results.sort((a, b) => {
        let valueA, valueB;

        switch (filters.sortBy) {
          case 'name':
            valueA = a.name;
            valueB = b.name;
            break;
          case 'cmc':
            valueA = a.cmc;
            valueB = b.cmc;
            break;
          case 'color':
            valueA = (a.colors || []).length;
            valueB = (b.colors || []).length;
            break;
          case 'rarity':
            const rarityOrder = { common: 0, uncommon: 1, rare: 2, mythic: 3 };
            valueA = rarityOrder[a.rarity] || 0;
            valueB = rarityOrder[b.rarity] || 0;
            break;
          case 'released':
            valueA = a.released_at || '';
            valueB = b.released_at || '';
            break;
          case 'usd':
            valueA = parseFloat(a.prices?.usd || '0');
            valueB = parseFloat(b.prices?.usd || '0');
            break;
          case 'edhrec':
            valueA = a.edhrec_rank || Number.MAX_SAFE_INTEGER;
            valueB = b.edhrec_rank || Number.MAX_SAFE_INTEGER;
            break;
          default:
            valueA = a.name;
            valueB = b.name;
        }

        // Handle direction
        const direction = filters.sortDir === 'desc' ? -1 : 1;
        
        if (valueA < valueB) return -1 * direction;
        if (valueA > valueB) return 1 * direction;
        return 0;
      });
    }

    setFilteredResults(results);
  }, [searchResults, filters]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setTranslatedQuery(null);
    setSearchResults(null);
    setFilteredResults(null);
    
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

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for cards in plain English (e.g., 'red dragons with flying')"
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

      {searchResults && searchResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <CardFilter 
              onFilterChange={handleFilterChange} 
              totalCards={filteredResults?.length || 0} 
            />
          </div>
          <div className="lg:col-span-3">
            <CardGrid 
              cards={filteredResults || []} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {searchResults && searchResults.length === 0 && (
        <div className="p-4 my-4 text-amber-700 bg-amber-100 rounded-lg">
          <p>No cards found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}
