"use client";

import { useState } from 'react';
import { Deck } from './DeckBuilder';

interface DeckBuilderSidebarProps {
  deck: Deck;
  updateDeckInfo: (info: Partial<Deck>) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  saveDeck: () => void;
}

export default function DeckBuilderSidebar({
  deck,
  updateDeckInfo,
  addCategory,
  removeCategory,
  activeCategory,
  setActiveCategory,
  saveDeck
}: DeckBuilderSidebarProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isEditingDeckInfo, setIsEditingDeckInfo] = useState(false);
  const [deckName, setDeckName] = useState(deck.name);
  const [deckDescription, setDeckDescription] = useState(deck.description);
  const [deckFormat, setDeckFormat] = useState(deck.format);

  // Calculate deck stats
  const totalCards = deck.cards.reduce((total, card) => total + card.count, 0);
  const cardsByType = deck.cards.reduce((acc, card) => {
    const type = card.type_line.includes('Creature') 
      ? 'Creatures' 
      : card.type_line.includes('Land') 
        ? 'Lands' 
        : 'Spells';
    
    acc[type] = (acc[type] || 0) + card.count;
    return acc;
  }, {} as Record<string, number>);

  const handleSaveDeckInfo = () => {
    updateDeckInfo({
      name: deckName,
      description: deckDescription,
      format: deckFormat
    });
    setIsEditingDeckInfo(false);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Deck Info */}
      <div className="mb-6">
        {isEditingDeckInfo ? (
          <div className="space-y-3">
            <div>
              <label htmlFor="deckName" className="block text-sm font-medium text-gray-700">
                Deck Name
              </label>
              <input
                type="text"
                id="deckName"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="deckFormat" className="block text-sm font-medium text-gray-700">
                Format
              </label>
              <select
                id="deckFormat"
                value={deckFormat}
                onChange={(e) => setDeckFormat(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="standard">Standard</option>
                <option value="modern">Modern</option>
                <option value="commander">Commander</option>
                <option value="legacy">Legacy</option>
                <option value="vintage">Vintage</option>
                <option value="pauper">Pauper</option>
                <option value="pioneer">Pioneer</option>
                <option value="brawl">Brawl</option>
                <option value="historic">Historic</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            <div>
              <label htmlFor="deckDescription" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="deckDescription"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditingDeckInfo(false)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDeckInfo}
                className="px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">{deck.name}</h2>
              <button
                type="button"
                onClick={() => setIsEditingDeckInfo(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
            <p className="text-sm text-gray-600 capitalize mb-1">{deck.format}</p>
            {deck.description && (
              <p className="text-sm text-gray-600 mb-2">{deck.description}</p>
            )}
            <div className="mt-4">
              <button
                type="button"
                onClick={saveDeck}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Deck
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Deck Stats */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Deck Stats</h3>
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm mb-1">Total Cards: <span className="font-medium">{totalCards}</span></p>
          <p className="text-sm mb-1">Creatures: <span className="font-medium">{cardsByType.Creatures || 0}</span></p>
          <p className="text-sm mb-1">Spells: <span className="font-medium">{cardsByType.Spells || 0}</span></p>
          <p className="text-sm">Lands: <span className="font-medium">{cardsByType.Lands || 0}</span></p>
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Categories</h3>
        </div>
        <div className="space-y-1 mb-3">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              activeCategory === null
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Cards
          </button>
          {deck.categories.map((category) => (
            <div key={category} className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`flex-grow text-left px-3 py-2 rounded-md text-sm ${
                  activeCategory === category
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="text-red-600 hover:text-red-800 p-1"
                title="Remove category"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category"
            className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-3 py-2 border border-transparent rounded-r-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
