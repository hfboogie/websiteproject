"use client";

import { useState } from 'react';

// Updated to use the API route instead of direct OpenAI client
export async function translateToScryfallSyntax(query: string): Promise<string> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to translate query');
    }

    const data = await response.json();
    return data.translatedQuery;
  } catch (error) {
    console.error('Error translating query to Scryfall syntax:', error);
    throw new Error('Failed to translate natural language query to Scryfall syntax');
  }
}
