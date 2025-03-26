/**
 * OpenAI API Client
 * 
 * This module provides functions to interact with the OpenAI API
 * for translating natural language queries into Scryfall syntax.
 */

import { OpenAI } from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Translates a natural language query into Scryfall syntax
 * 
 * @param query - The natural language query to translate
 * @returns Promise with the translated Scryfall syntax
 */
export async function translateToScryfallSyntax(query: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that translates natural language queries about Magic: The Gathering cards into Scryfall syntax.
          
Examples:
- "Show me red dragons with flying" -> "t:dragon c:r o:flying"
- "Find counterspells in blue" -> "o:counter o:spell c:u"
- "Cards that cost less than 3 mana and draw cards" -> "cmc<3 o:"draw a card""
- "Legendary creatures in Kamigawa" -> "t:legendary t:creature s:kamigawa"
- "Black removal spells" -> "c:b (o:destroy OR o:exile)"
- "Planeswalkers with loyalty abilities that deal damage" -> "t:planeswalker o:loyalty o:damage"

Only respond with the Scryfall syntax, nothing else. If you're unsure about how to translate a specific part of the query, use the most likely interpretation based on context.`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    return response.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error('Error translating query to Scryfall syntax:', error);
    throw new Error('Failed to translate natural language query to Scryfall syntax');
  }
}
