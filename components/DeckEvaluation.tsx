"use client";

import React from 'react';
import { DeckCard } from '@/components/DeckBuilder';
import { DeckStats, DeckRecommendation, analyzeDeck, generateRecommendations, getCardSuggestions } from '@/lib/deckEvaluation';

interface DeckEvaluationProps {
  cards: DeckCard[];
}

export default function DeckEvaluation({ cards }: DeckEvaluationProps) {
  const deckStats = analyzeDeck(cards);
  const recommendations = generateRecommendations(deckStats);
  const suggestions = getCardSuggestions(deckStats, recommendations);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Deck Evaluation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Deck Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cards:</span>
              <span className="font-medium">{deckStats.totalCards}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unique Cards:</span>
              <span className="font-medium">{deckStats.uniqueCards}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Mana Value:</span>
              <span className="font-medium">{deckStats.averageCmc.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Land Count:</span>
              <span className="font-medium">{deckStats.landCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recommended Land Count:</span>
              <span className="font-medium">{deckStats.recommendedLandCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Color Identity:</span>
              <span className="font-medium">{deckStats.colorIdentity.join('/')}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Mana Curve</h3>
          <div className="h-40 flex items-end space-x-2">
            {Object.entries(deckStats.manaCurve).map(([cmc, count]) => {
              const maxCount = Math.max(...Object.values(deckStats.manaCurve));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              
              return (
                <div key={cmc} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-200 rounded-t" style={{ height: `${height}%` }}>
                    <div className="w-full h-full bg-blue-500 rounded-t flex items-center justify-center text-white text-xs">
                      {count > 0 && count}
                    </div>
                  </div>
                  <div className="mt-1 text-xs">{cmc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Card Type Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(deckStats.typeDistribution).map(([type, count]) => (
            <div key={type} className="bg-gray-100 p-3 rounded">
              <div className="text-lg font-medium">{count}</div>
              <div className="text-sm text-gray-600">{type}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Color Distribution</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {Object.entries(deckStats.colorDistribution).map(([color, count]) => {
            const colorClass = {
              'W': 'bg-yellow-100 text-yellow-800',
              'U': 'bg-blue-100 text-blue-800',
              'B': 'bg-gray-800 text-white',
              'R': 'bg-red-100 text-red-800',
              'G': 'bg-green-100 text-green-800',
              'C': 'bg-gray-100 text-gray-800'
            }[color] || 'bg-gray-100';
            
            return (
              <div key={color} className={`p-3 rounded ${colorClass}`}>
                <div className="text-lg font-medium">{count}</div>
                <div className="text-sm">{color === 'C' ? 'Colorless' : color}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {recommendations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const severityClass = {
                'low': 'bg-blue-50 border-blue-200',
                'medium': 'bg-yellow-50 border-yellow-200',
                'high': 'bg-red-50 border-red-200'
              }[rec.severity];
              
              return (
                <div key={index} className={`p-4 rounded border ${severityClass}`}>
                  <h4 className="font-semibold">{rec.message}</h4>
                  {rec.details && <p className="text-sm mt-1">{rec.details}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {Object.keys(suggestions).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Card Suggestions</h3>
          <div className="space-y-6">
            {Object.entries(suggestions).map(([category, cards]) => {
              const categoryName = {
                'lands': 'Land Suggestions',
                'low_cost_cards': 'Low-Cost Card Suggestions',
                'creatures': 'Creature Suggestions'
              }[category] || 'Card Suggestions';
              
              return (
                <div key={category}>
                  <h4 className="font-medium text-lg mb-2">{categoryName}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {cards.map((card, i) => (
                      <li key={i}>{card}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
