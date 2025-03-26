"use client";

import React from 'react';
import { Card } from '@/lib/api/scryfall';
import AffiliateLinks from './AffiliateLinks';

interface CardDisplayProps {
  card: Card;
  onAddToDeck?: (card: Card) => void;
  className?: string;
}

export default function CardDisplay({ card, onAddToDeck, className = "" }: CardDisplayProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
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
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{card.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{card.type_line}</p>
        <p className="text-sm mb-4">{card.oracle_text}</p>
        
        {/* Price Info (placeholder) */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500">Market Price</p>
            <p className="font-semibold">${(card.prices?.usd || '0.00')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Foil Price</p>
            <p className="font-semibold">${(card.prices?.usd_foil || '0.00')}</p>
          </div>
        </div>
        
        {/* Affiliate Links */}
        <AffiliateLinks card={card} />
      </div>
    </div>
  );
}
