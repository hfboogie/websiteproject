"use client";

import React, { useState } from 'react';
import { Card } from '@/lib/api/scryfall';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DeckBuilderSidebar from './DeckBuilderSidebar';
import DeckBuilderMain from './DeckBuilderMain';
import AutocompleteInput from './AutocompleteInput';
import DeckEvaluation from './DeckEvaluation';
import AIAnalysis from './AIAnalysis';
import { getCardByExactName, getCardByFuzzyName } from '@/lib/api/scryfall';

export interface DeckCard extends Card {
  count: number;
  category?: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  format: string;
  cards: DeckCard[];
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const defaultCategories = ['Commander', 'Creatures', 'Instants', 'Sorceries', 'Artifacts', 'Enchantments', 'Planeswalkers', 'Lands'];

export default function DeckBuilder() {
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Deck>({
    id: crypto.randomUUID(),
    name: 'New Deck',
    description: '',
    format: 'commander',
    cards: [],
    categories: [...defaultCategories],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [quickAddError, setQuickAddError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'evaluation' | 'ai'>('builder');

  const addCardToDeck = (card: Card) => {
    setDeck(prevDeck => {
      // Check if card already exists in deck
      const existingCardIndex = prevDeck.cards.findIndex(c => c.id === card.id);
      
      if (existingCardIndex >= 0) {
        // Increment count if card already exists
        const updatedCards = [...prevDeck.cards];
        updatedCards[existingCardIndex] = {
          ...updatedCards[existingCardIndex],
          count: updatedCards[existingCardIndex].count + 1
        };
        
        return {
          ...prevDeck,
          cards: updatedCards,
          updatedAt: new Date()
        };
      } else {
        // Add new card with count 1
        const category = determineCardCategory(card);
        
        return {
          ...prevDeck,
          cards: [...prevDeck.cards, { ...card, count: 1, category }],
          updatedAt: new Date()
        };
      }
    });
  };

  const handleQuickAddCard = async (cardName: string) => {
    setQuickAddError(null);
    try {
      // First try exact match
      try {
        const card = await getCardByExactName(cardName);
        addCardToDeck(card);
        return;
      } catch (error) {
        // If exact match fails, try fuzzy match
        try {
          const card = await getCardByFuzzyName(cardName);
          addCardToDeck(card);
          return;
        } catch (fuzzyError) {
          throw new Error(`Card not found: ${cardName}`);
        }
      }
    } catch (error) {
      console.error('Error adding card:', error);
      setQuickAddError(error instanceof Error ? error.message : 'Failed to add card');
    }
  };

  const removeCardFromDeck = (cardId: string) => {
    setDeck(prevDeck => {
      const existingCardIndex = prevDeck.cards.findIndex(c => c.id === cardId);
      
      if (existingCardIndex >= 0) {
        const card = prevDeck.cards[existingCardIndex];
        
        if (card.count > 1) {
          // Decrement count if more than 1
          const updatedCards = [...prevDeck.cards];
          updatedCards[existingCardIndex] = {
            ...card,
            count: card.count - 1
          };
          
          return {
            ...prevDeck,
            cards: updatedCards,
            updatedAt: new Date()
          };
        } else {
          // Remove card if count is 1
          return {
            ...prevDeck,
            cards: prevDeck.cards.filter(c => c.id !== cardId),
            updatedAt: new Date()
          };
        }
      }
      
      return prevDeck;
    });
  };

  const updateDeckInfo = (info: Partial<Deck>) => {
    setDeck(prevDeck => ({
      ...prevDeck,
      ...info,
      updatedAt: new Date()
    }));
  };

  const addCategory = (category: string) => {
    if (!deck.categories.includes(category)) {
      setDeck(prevDeck => ({
        ...prevDeck,
        categories: [...prevDeck.categories, category],
        updatedAt: new Date()
      }));
    }
  };

  const removeCategory = (category: string) => {
    // Don't remove if cards are using this category
    const categoryInUse = deck.cards.some(card => card.category === category);
    
    if (!categoryInUse) {
      setDeck(prevDeck => ({
        ...prevDeck,
        categories: prevDeck.categories.filter(c => c !== category),
        updatedAt: new Date()
      }));
    }
  };

  const moveCardToCategory = (cardId: string, category: string) => {
    setDeck(prevDeck => {
      const updatedCards = prevDeck.cards.map(card => 
        card.id === cardId ? { ...card, category } : card
      );
      
      return {
        ...prevDeck,
        cards: updatedCards,
        updatedAt: new Date()
      };
    });
  };

  const determineCardCategory = (card: Card): string => {
    const typeLine = card.type_line.toLowerCase();
    
    if (typeLine.includes('creature')) {
      return 'Creatures';
    } else if (typeLine.includes('instant')) {
      return 'Instants';
    } else if (typeLine.includes('sorcery')) {
      return 'Sorceries';
    } else if (typeLine.includes('artifact')) {
      return 'Artifacts';
    } else if (typeLine.includes('enchantment')) {
      return 'Enchantments';
    } else if (typeLine.includes('planeswalker')) {
      return 'Planeswalkers';
    } else if (typeLine.includes('land')) {
      return 'Lands';
    } else {
      return 'Other';
    }
  };

  const saveDeck = () => {
    // In a real app, this would save to a database
    // For now, we'll save to localStorage
    const decks = JSON.parse(localStorage.getItem('mtg-decks') || '[]');
    const existingDeckIndex = decks.findIndex((d: Deck) => d.id === deck.id);
    
    if (existingDeckIndex >= 0) {
      decks[existingDeckIndex] = deck;
    } else {
      decks.push(deck);
    }
    
    localStorage.setItem('mtg-decks', JSON.stringify(decks));
    alert('Deck saved successfully!');
  };

  const loadDeck = (deckId: string) => {
    const decks = JSON.parse(localStorage.getItem('mtg-decks') || '[]');
    const deckToLoad = decks.find((d: Deck) => d.id === deckId);
    
    if (deckToLoad) {
      setDeck(deckToLoad);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Quick Add Card</h2>
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-grow">
              <AutocompleteInput 
                onCardSelected={handleQuickAddCard}
                placeholder="Type a card name to add to your deck..."
              />
            </div>
          </div>
          {quickAddError && (
            <div className="mt-2 text-red-600 text-sm">
              {quickAddError}
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('builder')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'builder'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Deck Builder
            </button>
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'evaluation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Deck Evaluation
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ai'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Analysis
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'builder' && (
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="lg:w-1/3 xl:w-1/4">
            <DeckBuilderSidebar 
              deck={deck}
              updateDeckInfo={updateDeckInfo}
              addCategory={addCategory}
              removeCategory={removeCategory}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              saveDeck={saveDeck}
            />
          </div>
          <div className="lg:w-2/3 xl:w-3/4">
            <DeckBuilderMain 
              deck={deck}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              addCardToDeck={addCardToDeck}
              removeCardFromDeck={removeCardFromDeck}
              moveCardToCategory={moveCardToCategory}
              activeCategory={activeCategory}
            />
          </div>
        </div>
      )}
      
      {activeTab === 'evaluation' && (
        <DeckEvaluation cards={deck.cards} />
      )}
      
      {activeTab === 'ai' && (
        <AIAnalysis 
          cards={deck.cards} 
          format={deck.format} 
          deckName={deck.name} 
        />
      )}
    </DndProvider>
  );
}
