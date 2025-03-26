"use client";

import { useState } from 'react';

interface CardFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  totalCards: number;
}

export interface FilterOptions {
  colors?: string[];
  rarity?: string[];
  type?: string[];
  cmc?: [number, number];
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export default function CardFilter({ onFilterChange, totalCards }: CardFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    colors: [],
    rarity: [],
    type: [],
    cmc: [0, 16],
    sortBy: 'name',
    sortDir: 'asc'
  });

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors?.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...(filters.colors || []), color];
    
    updateFilters({ colors: newColors });
  };

  const handleRarityToggle = (rarity: string) => {
    const newRarity = filters.rarity?.includes(rarity)
      ? filters.rarity.filter(r => r !== rarity)
      : [...(filters.rarity || []), rarity];
    
    updateFilters({ rarity: newRarity });
  };

  const handleTypeToggle = (type: string) => {
    const newType = filters.type?.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...(filters.type || []), type];
    
    updateFilters({ type: newType });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sortBy: e.target.value });
  };

  const handleSortDirChange = (dir: 'asc' | 'desc') => {
    updateFilters({ sortDir: dir });
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const colorOptions = [
    { value: 'W', label: 'White', bgColor: 'bg-yellow-100' },
    { value: 'U', label: 'Blue', bgColor: 'bg-blue-500' },
    { value: 'B', label: 'Black', bgColor: 'bg-gray-800' },
    { value: 'R', label: 'Red', bgColor: 'bg-red-600' },
    { value: 'G', label: 'Green', bgColor: 'bg-green-600' },
    { value: 'C', label: 'Colorless', bgColor: 'bg-gray-400' }
  ];

  const rarityOptions = [
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'mythic', label: 'Mythic' }
  ];

  const typeOptions = [
    { value: 'creature', label: 'Creature' },
    { value: 'instant', label: 'Instant' },
    { value: 'sorcery', label: 'Sorcery' },
    { value: 'artifact', label: 'Artifact' },
    { value: 'enchantment', label: 'Enchantment' },
    { value: 'planeswalker', label: 'Planeswalker' },
    { value: 'land', label: 'Land' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'cmc', label: 'Mana Value' },
    { value: 'color', label: 'Color' },
    { value: 'rarity', label: 'Rarity' },
    { value: 'released', label: 'Release Date' },
    { value: 'usd', label: 'Price (USD)' },
    { value: 'edhrec', label: 'EDHREC Rank' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <span className="text-sm text-gray-600">{totalCards} cards found</span>
      </div>
      
      <div className="space-y-4">
        {/* Colors */}
        <div>
          <h3 className="text-sm font-medium mb-2">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map(color => (
              <button
                key={color.value}
                onClick={() => handleColorToggle(color.value)}
                className={`px-3 py-1 rounded-full text-sm ${
                  color.value === 'W' ? 'text-black' : 'text-white'
                } ${color.bgColor} ${
                  filters.colors?.includes(color.value) 
                    ? 'ring-2 ring-blue-500' 
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {color.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Rarity */}
        <div>
          <h3 className="text-sm font-medium mb-2">Rarity</h3>
          <div className="flex flex-wrap gap-2">
            {rarityOptions.map(rarity => (
              <button
                key={rarity.value}
                onClick={() => handleRarityToggle(rarity.value)}
                className={`px-3 py-1 border rounded-full text-sm ${
                  filters.rarity?.includes(rarity.value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {rarity.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Card Type */}
        <div>
          <h3 className="text-sm font-medium mb-2">Card Type</h3>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map(type => (
              <button
                key={type.value}
                onClick={() => handleTypeToggle(type.value)}
                className={`px-3 py-1 border rounded-full text-sm ${
                  filters.type?.includes(type.value)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sort Options */}
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <h3 className="text-sm font-medium mb-1">Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Direction</h3>
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleSortDirChange('asc')}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md ${
                  filters.sortDir === 'asc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Ascending
              </button>
              <button
                type="button"
                onClick={() => handleSortDirChange('desc')}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md ${
                  filters.sortDir === 'desc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Descending
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
