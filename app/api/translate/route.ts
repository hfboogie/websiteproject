import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Initialize the OpenAI client with API key from server environment
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert Magic: The Gathering card database specialist that translates natural language queries into precise Scryfall syntax.

Your task is to convert natural language queries about Magic cards into Scryfall's advanced search syntax, ensuring comprehensive results.

Important guidelines:
- Be thorough and inclusive in your translations to capture all relevant cards
- When users mention card destruction effects, include all variations (destroy, sacrifice, exile, etc.)
- For land destruction, include mass land destruction and targeted land destruction
- Always use parentheses to group logical operations
- Use OR operators liberally to include all possible variations of effects
- Consider synonyms and related terms in your translations

Examples:
- "Show me red dragons with flying" -> "t:dragon c:r o:flying"
- "Find counterspells in blue" -> "o:/counter.*spell/ c:u OR o:/counter target.*spell/ c:u"
- "Cards that cost less than 3 mana and draw cards" -> "cmc<3 (o:"draw a card" OR o:"draw cards")"
- "Legendary creatures in Kamigawa" -> "t:legendary t:creature (s:kamigawa OR s:/kamigawa.*champions/ OR s:/kamigawa.*neon/)"
- "Black removal spells" -> "c:b (o:destroy OR o:exile OR o:"sacrifice a creature" OR o:"gets -X/-X")"
- "White cards that destroy land" -> "c:w (o:destroy o:land OR o:"sacrifice a land" OR o:"sacrifice all lands" OR o:"destroy all lands" OR o:armageddon)"
- "Planeswalkers with loyalty abilities that deal damage" -> "t:planeswalker o:loyalty o:damage"

Only respond with the Scryfall syntax, nothing else. Make your translations as comprehensive as possible to ensure all relevant cards are captured.`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    const translatedQuery = response.choices[0].message.content?.trim() || '';
    
    return NextResponse.json({ translatedQuery });
  } catch (error) {
    console.error('Error translating query:', error);
    return NextResponse.json(
      { error: 'Failed to translate natural language query to Scryfall syntax' },
      { status: 500 }
    );
  }
}
