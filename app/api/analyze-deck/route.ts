import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

interface Card {
  name: string;
  count: number;
  type: string;
  cmc: number;
  colors: string[];
}

interface DeckData {
  name: string;
  format: string;
  cards: Card[];
}

export async function POST(request: Request) {
  try {
    const deckData: DeckData = await request.json();
    
    if (!deckData || !deckData.cards || deckData.cards.length === 0) {
      return NextResponse.json(
        { error: 'Valid deck data is required' },
        { status: 400 }
      );
    }

    // Initialize the OpenAI client with API key from server environment
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare deck information for the AI
    const deckInfo = prepareDeckInfo(deckData);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert Magic: The Gathering deck analyst and coach. Your task is to provide detailed, insightful analysis of MTG decks with constructive feedback and specific suggestions for improvement.

Your analysis should include:
1. Overall deck strategy assessment
2. Strengths and weaknesses evaluation
3. Synergy analysis between cards
4. Specific card recommendations (cards to add and remove)
5. Gameplay tips and key interactions to be aware of

Format your response in clear sections with HTML formatting (using <h3>, <p>, <ul>, etc.) for better readability. Be specific, insightful, and constructive in your feedback.`
        },
        {
          role: "user",
          content: `Please analyze my ${deckData.format} deck named "${deckData.name}". Here's the deck information:

${deckInfo}

Please provide a detailed analysis with specific suggestions for improvement. Include cards I should consider adding or removing, and explain why these changes would improve the deck.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const analysis = response.choices[0].message.content?.trim() || '';
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error analyzing deck:', error);
    return NextResponse.json(
      { error: 'Failed to analyze deck' },
      { status: 500 }
    );
  }
}

function prepareDeckInfo(deckData: DeckData): string {
  // Group cards by type
  const cardsByType: Record<string, Card[]> = {};
  
  deckData.cards.forEach(card => {
    const type = determineCardType(card.type);
    if (!cardsByType[type]) {
      cardsByType[type] = [];
    }
    cardsByType[type].push(card);
  });
  
  // Calculate some basic stats
  const totalCards = deckData.cards.reduce((sum, card) => sum + card.count, 0);
  const averageCmc = deckData.cards
    .filter(card => !card.type.toLowerCase().includes('land'))
    .reduce((sum, card) => sum + (card.cmc * card.count), 0) / 
    deckData.cards
      .filter(card => !card.type.toLowerCase().includes('land'))
      .reduce((sum, card) => sum + card.count, 0);
  
  const colorDistribution: Record<string, number> = {};
  deckData.cards.forEach(card => {
    card.colors.forEach(color => {
      colorDistribution[color] = (colorDistribution[color] || 0) + card.count;
    });
  });
  
  // Format the deck information
  let deckInfo = `Deck Name: ${deckData.name}\n`;
  deckInfo += `Format: ${deckData.format}\n`;
  deckInfo += `Total Cards: ${totalCards}\n`;
  deckInfo += `Average Mana Value: ${averageCmc.toFixed(2)}\n\n`;
  
  // Add color distribution
  deckInfo += `Color Distribution:\n`;
  Object.entries(colorDistribution).forEach(([color, count]) => {
    deckInfo += `- ${color}: ${count} cards\n`;
  });
  deckInfo += `\n`;
  
  // Add cards by type
  Object.entries(cardsByType).forEach(([type, cards]) => {
    deckInfo += `${type} (${cards.reduce((sum, card) => sum + card.count, 0)}):\n`;
    cards.forEach(card => {
      deckInfo += `${card.count}x ${card.name} (${card.cmc} MV)\n`;
    });
    deckInfo += `\n`;
  });
  
  return deckInfo;
}

function determineCardType(typeLine: string): string {
  const lowerTypeLine = typeLine.toLowerCase();
  
  if (lowerTypeLine.includes('creature')) {
    return 'Creatures';
  } else if (lowerTypeLine.includes('planeswalker')) {
    return 'Planeswalkers';
  } else if (lowerTypeLine.includes('instant')) {
    return 'Instants';
  } else if (lowerTypeLine.includes('sorcery')) {
    return 'Sorceries';
  } else if (lowerTypeLine.includes('artifact')) {
    return 'Artifacts';
  } else if (lowerTypeLine.includes('enchantment')) {
    return 'Enchantments';
  } else if (lowerTypeLine.includes('land')) {
    return 'Lands';
  } else {
    return 'Other';
  }
}
