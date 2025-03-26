"use client";

import React, { useState } from 'react';
import { DeckCard } from '@/components/DeckBuilder';
import { OpenAI } from 'openai';

interface AIAnalysisProps {
  cards: DeckCard[];
  format: string;
  deckName: string;
}

export default function AIAnalysis({ cards, format, deckName }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = async () => {
    if (cards.length === 0) {
      setError("Please add cards to your deck before requesting an AI analysis.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare deck data for the AI
      const deckData = {
        name: deckName,
        format: format,
        cards: cards.map(card => ({
          name: card.name,
          count: card.count,
          type: card.type_line,
          cmc: card.cmc,
          colors: card.colors || [],
        }))
      };

      // Call the API route for AI analysis
      const response = await fetch('/api/analyze-deck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deckData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI analysis');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing your deck');
      console.error('Error generating AI analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI Deck Analysis</h2>
        <button
          onClick={generateAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          {loading ? 'Analyzing...' : 'Analyze My Deck'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {!analysis && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <p>Click "Analyze My Deck" to get personalized recommendations and insights from our AI.</p>
          <p className="mt-2 text-sm">The AI will evaluate your deck's strategy, synergies, and potential improvements.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Analyzing your deck... This may take a moment.</p>
        </div>
      )}

      {analysis && (
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br/>') }} />
        </div>
      )}
    </div>
  );
}
