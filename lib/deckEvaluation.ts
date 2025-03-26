"use client";

import { Card, DeckCard } from '@/components/DeckBuilder';

export interface DeckStats {
  totalCards: number;
  uniqueCards: number;
  averageCmc: number;
  manaCurve: Record<string, number>;
  colorDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  landCount: number;
  nonlandCount: number;
  recommendedLandCount: number;
  colorIdentity: string[];
}

export interface DeckRecommendation {
  type: 'land' | 'curve' | 'balance' | 'synergy' | 'general';
  severity: 'low' | 'medium' | 'high';
  message: string;
  details?: string;
  suggestedCards?: string[];
}

export function analyzeDeck(cards: DeckCard[]): DeckStats {
  // Count total cards including multiples
  const totalCards = cards.reduce((total, card) => total + card.count, 0);
  
  // Count unique cards
  const uniqueCards = cards.length;
  
  // Calculate average CMC (excluding lands)
  const nonLands = cards.filter(card => !card.type_line.toLowerCase().includes('land'));
  const totalCmc = nonLands.reduce((total, card) => total + (card.cmc * card.count), 0);
  const nonLandCount = nonLands.reduce((total, card) => total + card.count, 0);
  const averageCmc = nonLandCount > 0 ? totalCmc / nonLandCount : 0;
  
  // Calculate mana curve
  const manaCurve: Record<string, number> = {
    '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7+': 0
  };
  
  nonLands.forEach(card => {
    const cmcKey = card.cmc >= 7 ? '7+' : Math.floor(card.cmc).toString();
    manaCurve[cmcKey] += card.count;
  });
  
  // Calculate color distribution
  const colorDistribution: Record<string, number> = {
    'W': 0, 'U': 0, 'B': 0, 'R': 0, 'G': 0, 'C': 0
  };
  
  cards.forEach(card => {
    if (card.colors && card.colors.length > 0) {
      card.colors.forEach(color => {
        if (colorDistribution[color] !== undefined) {
          colorDistribution[color] += card.count;
        }
      });
    } else {
      colorDistribution['C'] += card.count;
    }
  });
  
  // Calculate type distribution
  const typeDistribution: Record<string, number> = {
    'Creature': 0,
    'Instant': 0,
    'Sorcery': 0,
    'Artifact': 0,
    'Enchantment': 0,
    'Planeswalker': 0,
    'Land': 0,
    'Other': 0
  };
  
  cards.forEach(card => {
    const typeLine = card.type_line.toLowerCase();
    
    if (typeLine.includes('creature')) {
      typeDistribution['Creature'] += card.count;
    } else if (typeLine.includes('instant')) {
      typeDistribution['Instant'] += card.count;
    } else if (typeLine.includes('sorcery')) {
      typeDistribution['Sorcery'] += card.count;
    } else if (typeLine.includes('artifact')) {
      typeDistribution['Artifact'] += card.count;
    } else if (typeLine.includes('enchantment')) {
      typeDistribution['Enchantment'] += card.count;
    } else if (typeLine.includes('planeswalker')) {
      typeDistribution['Planeswalker'] += card.count;
    } else if (typeLine.includes('land')) {
      typeDistribution['Land'] += card.count;
    } else {
      typeDistribution['Other'] += card.count;
    }
  });
  
  // Count lands
  const landCount = cards
    .filter(card => card.type_line.toLowerCase().includes('land'))
    .reduce((total, card) => total + card.count, 0);
  
  // Determine color identity
  const colorIdentity = Array.from(
    new Set(
      cards.flatMap(card => card.color_identity || [])
    )
  ).sort();
  
  // Calculate recommended land count based on average CMC
  let recommendedLandCount = 0;
  
  if (averageCmc < 1.5) {
    recommendedLandCount = Math.round(totalCards * 0.33); // 33% lands for very low curve
  } else if (averageCmc < 2.5) {
    recommendedLandCount = Math.round(totalCards * 0.36); // 36% lands for low curve
  } else if (averageCmc < 3.5) {
    recommendedLandCount = Math.round(totalCards * 0.38); // 38% lands for medium curve
  } else if (averageCmc < 4.5) {
    recommendedLandCount = Math.round(totalCards * 0.40); // 40% lands for high curve
  } else {
    recommendedLandCount = Math.round(totalCards * 0.42); // 42% lands for very high curve
  }
  
  return {
    totalCards,
    uniqueCards,
    averageCmc,
    manaCurve,
    colorDistribution,
    typeDistribution,
    landCount,
    nonlandCount,
    recommendedLandCount,
    colorIdentity
  };
}

export function generateRecommendations(deckStats: DeckStats): DeckRecommendation[] {
  const recommendations: DeckRecommendation[] = [];
  
  // Land count recommendations
  const landDifference = deckStats.recommendedLandCount - deckStats.landCount;
  if (Math.abs(landDifference) >= 3) {
    const severity = Math.abs(landDifference) >= 5 ? 'high' : 'medium';
    if (landDifference > 0) {
      recommendations.push({
        type: 'land',
        severity,
        message: `Consider adding ${landDifference} more lands`,
        details: `Based on your average mana value of ${deckStats.averageCmc.toFixed(2)}, we recommend around ${deckStats.recommendedLandCount} lands. You currently have ${deckStats.landCount}.`
      });
    } else {
      recommendations.push({
        type: 'land',
        severity,
        message: `Consider removing ${Math.abs(landDifference)} lands`,
        details: `Based on your average mana value of ${deckStats.averageCmc.toFixed(2)}, we recommend around ${deckStats.recommendedLandCount} lands. You currently have ${deckStats.landCount}.`
      });
    }
  }
  
  // Mana curve recommendations
  const curveTotal = Object.values(deckStats.manaCurve).reduce((sum, count) => sum + count, 0);
  
  // Check for top-heavy curve
  const highCmcCount = (deckStats.manaCurve['5'] || 0) + (deckStats.manaCurve['6'] || 0) + (deckStats.manaCurve['7+'] || 0);
  const highCmcPercentage = curveTotal > 0 ? (highCmcCount / curveTotal) * 100 : 0;
  
  if (highCmcPercentage > 30) {
    recommendations.push({
      type: 'curve',
      severity: highCmcPercentage > 40 ? 'high' : 'medium',
      message: 'Your mana curve is top-heavy',
      details: `${highCmcPercentage.toFixed(1)}% of your non-land cards cost 5 or more mana. Consider adding more low-cost cards to improve early game presence.`
    });
  }
  
  // Check for missing early plays
  const lowCmcCount = (deckStats.manaCurve['1'] || 0) + (deckStats.manaCurve['2'] || 0);
  const lowCmcPercentage = curveTotal > 0 ? (lowCmcCount / curveTotal) * 100 : 0;
  
  if (lowCmcPercentage < 25) {
    recommendations.push({
      type: 'curve',
      severity: lowCmcPercentage < 15 ? 'high' : 'medium',
      message: 'You may lack early game plays',
      details: `Only ${lowCmcPercentage.toFixed(1)}% of your non-land cards cost 1-2 mana. Consider adding more low-cost cards to improve your early game.`
    });
  }
  
  // Color balance recommendations
  if (deckStats.colorIdentity.length > 1) {
    const colorCounts = deckStats.colorIdentity.map(color => deckStats.colorDistribution[color] || 0);
    const maxColorCount = Math.max(...colorCounts);
    const minColorCount = Math.min(...colorCounts);
    
    // If one color has more than twice the cards of another color
    if (maxColorCount > minColorCount * 2 && minColorCount > 0) {
      const dominantColors = deckStats.colorIdentity.filter(
        color => (deckStats.colorDistribution[color] || 0) === maxColorCount
      );
      
      const weakColors = deckStats.colorIdentity.filter(
        color => (deckStats.colorDistribution[color] || 0) === minColorCount
      );
      
      recommendations.push({
        type: 'balance',
        severity: 'medium',
        message: 'Your color balance may need adjustment',
        details: `You have significantly more ${dominantColors.join('/')} cards than ${weakColors.join('/')} cards. Consider balancing your colors or adjusting your mana base accordingly.`
      });
    }
  }
  
  // Creature count recommendations
  const creaturePercentage = deckStats.nonlandCount > 0 
    ? (deckStats.typeDistribution['Creature'] / deckStats.nonlandCount) * 100 
    : 0;
  
  if (creaturePercentage < 20) {
    recommendations.push({
      type: 'general',
      severity: creaturePercentage < 10 ? 'high' : 'medium',
      message: 'Your deck may need more creatures',
      details: `Only ${creaturePercentage.toFixed(1)}% of your non-land cards are creatures. Most decks benefit from having more creatures to establish board presence.`
    });
  }
  
  return recommendations;
}

export function getCardSuggestions(deckStats: DeckStats, recommendations: DeckRecommendation[]): Record<string, string[]> {
  const suggestions: Record<string, string[]> = {};
  
  // Land suggestions
  const landRec = recommendations.find(rec => rec.type === 'land');
  if (landRec) {
    if (landRec.message.includes('adding')) {
      suggestions['lands'] = [];
      
      // Suggest lands based on color identity
      if (deckStats.colorIdentity.length > 1) {
        // Multi-color deck
        suggestions['lands'].push('Dual lands appropriate for your colors');
        
        if (deckStats.colorIdentity.length >= 3) {
          suggestions['lands'].push('Triome lands');
          suggestions['lands'].push('Command Tower');
        }
        
        suggestions['lands'].push('Fetch lands');
        suggestions['lands'].push('Shock lands');
      } else if (deckStats.colorIdentity.length === 1) {
        // Mono-color deck
        const color = deckStats.colorIdentity[0];
        const basicLandName = {
          'W': 'Plains',
          'U': 'Island',
          'B': 'Swamp',
          'R': 'Mountain',
          'G': 'Forest',
          'C': 'Wastes'
        }[color] || 'Basic lands';
        
        suggestions['lands'].push(basicLandName);
        suggestions['lands'].push('Utility lands');
      }
    }
  }
  
  // Low curve suggestions
  const curveRec = recommendations.find(rec => rec.type === 'curve' && rec.message.includes('early game'));
  if (curveRec) {
    suggestions['low_cost_cards'] = [];
    
    // Suggest low-cost cards based on color identity
    deckStats.colorIdentity.forEach(color => {
      switch (color) {
        case 'W':
          suggestions['low_cost_cards'].push('Swords to Plowshares');
          suggestions['low_cost_cards'].push('Path to Exile');
          break;
        case 'U':
          suggestions['low_cost_cards'].push('Counterspell');
          suggestions['low_cost_cards'].push('Brainstorm');
          break;
        case 'B':
          suggestions['low_cost_cards'].push('Fatal Push');
          suggestions['low_cost_cards'].push('Thoughtseize');
          break;
        case 'R':
          suggestions['low_cost_cards'].push('Lightning Bolt');
          suggestions['low_cost_cards'].push('Ragavan, Nimble Pilferer');
          break;
        case 'G':
          suggestions['low_cost_cards'].push('Llanowar Elves');
          suggestions['low_cost_cards'].push('Birds of Paradise');
          break;
      }
    });
    
    // Add some colorless options
    suggestions['low_cost_cards'].push('Sol Ring');
    suggestions['low_cost_cards'].push('Arcane Signet');
  }
  
  // Creature suggestions
  const creatureRec = recommendations.find(rec => rec.message.includes('more creatures'));
  if (creatureRec) {
    suggestions['creatures'] = [];
    
    // Suggest creatures based on color identity and mana curve
    if (deckStats.averageCmc > 3.5) {
      // High curve deck - suggest value creatures
      suggestions['creatures'].push('Card draw creatures');
      suggestions['creatures'].push('Utility creatures with ETB effects');
    } else {
      // Low curve deck - suggest aggressive creatures
      suggestions['creatures'].push('Efficient low-cost creatures');
      suggestions['creatures'].push('Creatures with evasion');
    }
    
    // Color-specific suggestions
    deckStats.colorIdentity.forEach(color => {
      switch (color) {
        case 'W':
          suggestions['creatures'].push('Protection or hatebear creatures');
          break;
        case 'U':
          suggestions['creatures'].push('Flash creatures with ETB effects');
          break;
        case 'B':
          suggestions['creatures'].push('Creatures with death triggers');
          break;
        case 'R':
          suggestions['creatures'].push('Aggressive creatures with haste');
          break;
        case 'G':
          suggestions['creatures'].push('Mana dorks or ramp creatures');
          break;
      }
    });
  }
  
  return suggestions;
}
