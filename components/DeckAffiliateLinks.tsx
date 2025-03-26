"use client";

import React from 'react';
import { DeckCard } from '@/components/DeckBuilder';

interface DeckAffiliateLinksProps {
  cards: DeckCard[];
  deckName: string;
  className?: string;
}

export default function DeckAffiliateLinks({ cards, deckName, className = "" }: DeckAffiliateLinksProps) {
  // This would be your actual TCGPlayer affiliate ID
  const tcgPlayerAffiliateId = "YOUR_TCGPLAYER_AFFILIATE_ID";
  
  // Generate TCGPlayer Mass Entry link
  const getTCGPlayerMassEntryLink = () => {
    // Format cards for TCGPlayer mass entry
    const cardList = cards.map(card => `${card.count} ${card.name}`).join('||');
    const encodedList = encodeURIComponent(cardList);
    const encodedDeckName = encodeURIComponent(deckName);
    
    return `https://www.tcgplayer.com/massentry?productline=Magic&utm_campaign=affiliate&utm_medium=api&utm_source=${tcgPlayerAffiliateId}&c=${encodedList}&partner=${tcgPlayerAffiliateId}&utm_term=${encodedDeckName}`;
  };

  // Calculate total estimated deck price (very rough estimate)
  const estimateDeckPrice = () => {
    // In a real implementation, you would use actual pricing data from an API
    // This is just a placeholder calculation
    let total = 0;
    cards.forEach(card => {
      // Rough price estimate based on rarity
      let cardPrice = 0.25; // common default
      if (card.rarity === 'uncommon') cardPrice = 0.5;
      if (card.rarity === 'rare') cardPrice = 2;
      if (card.rarity === 'mythic') cardPrice = 5;
      
      total += cardPrice * card.count;
    });
    
    return total.toFixed(2);
  };

  return (
    <div className={`${className}`}>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Purchase Options</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-600 mb-1">Estimated Deck Value:</p>
            <p className="text-xl font-bold">${estimateDeckPrice()}</p>
            <p className="text-xs text-gray-500">Prices are estimates only</p>
          </div>
          <div className="flex flex-col gap-2">
            <a 
              href={getTCGPlayerMassEntryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition flex items-center justify-center"
            >
              <span className="mr-2">Buy Deck on TCGPlayer</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // In a real implementation, this would generate a shareable decklist
                alert('Shareable decklist feature coming soon!');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 text-center rounded hover:bg-gray-300 transition flex items-center justify-center"
            >
              <span className="mr-2">Share Decklist</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">Affiliate Information</h3>
        <p className="text-sm text-gray-600">
          Card prices and purchase options are provided through our affiliate partners. 
          When you purchase through these links, we may earn a commission at no additional cost to you.
        </p>
      </div>
    </div>
  );
}
