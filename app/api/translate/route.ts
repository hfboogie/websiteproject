import { NextResponse } from 'next/server';
import { translateToScryfallSyntax } from '@/lib/api/openai';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const translatedQuery = await translateToScryfallSyntax(query);
    
    return NextResponse.json({ translatedQuery });
  } catch (error) {
    console.error('Error translating query:', error);
    return NextResponse.json(
      { error: 'Failed to translate query' },
      { status: 500 }
    );
  }
}
