"use client";

import React from 'react';
import { Card } from '@/lib/api/scryfall';
import { DeckCard } from './DeckBuilder';
import DeckAffiliateLinks from './DeckAffiliateLinks';

interface CardGridProps {
  cards: Card[];
  onAddToDeck?: (card: Card) => void;
  className?: string;
}

export default function CardGrid({ cards, onAddToDeck, className = "" }: CardGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {cards.map(card => (
        <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Card Image */}
          <div className="relative">
            <img 
              src={card.image_uris?.normal || card.image_uris?.png || card.image_uris?.large || '/card-back.png'} 
              alt={card.name}
              className="w-full h-auto"
            />
            {onAddToDeck && (
              <button
                onClick={() => onAddToDeck(card)}
                className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Card Info */}
          <div className="p-3">
            <h3 className="text-md font-semibold mb-1 truncate">{card.name}</h3>
            <p className="text-xs text-gray-600 mb-2 truncate">{card.type_line}</p>
            
            {/* Price Info (placeholder) */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-xs text-gray-500">Market</p>
                <p className="text-sm font-semibold">${(card.prices?.usd || '0.00')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Foil</p>
                <p className="text-sm font-semibold">${(card.prices?.usd_foil || '0.00')}</p>
              </div>
            </div>
            
            {/* Affiliate Links */}
            <div className="flex space-x-2">
              <a 
                href={`https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=${encodeURIComponent(card.name)}&utm_campaign=affiliate&utm_medium=api&utm_source=YOUR_TCGPLAYER_AFFILIATE_ID`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs text-center rounded hover:bg-blue-700 transition"
              >
                TCGPlayer
              </a>
              <a 
                href={`https://www.cardkingdom.com/catalog/search?search=header&filter%5Bname%5D=${encodeURIComponent(card.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-2 py-1 bg-green-600 text-white text-xs text-center rounded hover:bg-green-700 transition"
              >
                Card Kingdom
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
