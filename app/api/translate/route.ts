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

Your task is to convert natural language queries about Magic cards into Scryfall's advanced search syntax, ensuring comprehensive but accurate results.

Important guidelines:
- Be thorough but precise in your translations to capture relevant cards while excluding false positives
- When users mention card destruction effects, be specific about the target (creatures, lands, etc.)
- For land destruction, use specific terms like "o:destroy AND o:land" or "o:\"sacrifice a land\"" 
- Always ensure parentheses are properly closed and balanced
- Use AND operators to ensure precision when needed (e.g., "o:destroy AND o:land" not just "o:destroy o:land")
- For specific card names, use the exact name format: !"Card Name"
- Avoid overly broad terms that might include irrelevant cards

Examples:
- "Show me red dragons with flying" -> "t:dragon c:r o:flying"
- "Find counterspells in blue" -> "o:/counter target.*spell/ c:u"
- "Cards that cost less than 3 mana and draw cards" -> "cmc<3 (o:\"draw a card\" OR o:\"draw cards\")"
- "Legendary creatures in Kamigawa" -> "t:legendary t:creature (s:kamigawa OR s:/kamigawa.*champions/ OR s:/kamigawa.*neon/)"
- "Black removal spells" -> "c:b (o:destroy OR o:exile OR o:\"sacrifice a creature\" OR o:\"gets -X/-X\")"
- "White cards that destroy land" -> "c:w (o:\"destroy target land\" OR o:\"destroy all lands\" OR o:armageddon)"
- "Planeswalkers with loyalty abilities that deal damage" -> "t:planeswalker o:loyalty o:damage"
- "atraxa" -> "!\"Atraxa, Praetors' Voice\" OR !\"Atraxa, Grand Unifier\""

Only respond with the Scryfall syntax, nothing else. Make your translations precise to ensure only relevant cards are captured. Always double-check that all parentheses are properly closed.`
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
