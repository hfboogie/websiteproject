"use client";

import React from 'react';
import { Card } from '@/lib/api/scryfall';

interface AffiliateLinksProps {
  card: Card;
  className?: string;
}

export default function AffiliateLinks({ card, className = "" }: AffiliateLinksProps) {
  // This would be your actual TCGPlayer affiliate ID
  const tcgPlayerAffiliateId = "YOUR_TCGPLAYER_AFFILIATE_ID";
  
  // Generate TCGPlayer affiliate link
  const getTCGPlayerLink = (cardName: string) => {
    const encodedName = encodeURIComponent(cardName);
    return `https://www.tcgplayer.com/search/magic/product?productLineName=magic&q=${encodedName}&utm_campaign=affiliate&utm_medium=api&utm_source=${tcgPlayerAffiliateId}`;
  };

  // Generate Card Kingdom affiliate link
  const getCardKingdomLink = (cardName: string) => {
    const encodedName = encodeURIComponent(cardName);
    return `https://www.cardkingdom.com/catalog/search?search=header&filter%5Bname%5D=${encodedName}`;
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      <a 
        href={getTCGPlayerLink(card.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
      >
        TCGPlayer
      </a>
      <a 
        href={getCardKingdomLink(card.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
      >
        Card Kingdom
      </a>
    </div>
  );
}
