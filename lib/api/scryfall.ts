/**
 * Scryfall API Client
 * 
 * This module provides functions to interact with the Scryfall API
 * for searching and retrieving Magic: The Gathering card data.
 * 
 * API Documentation: https://scryfall.com/docs/api
 */

const SCRYFALL_API_BASE_URL = 'https://api.scryfall.com';

/**
 * Ensures parentheses are balanced in a query string
 * 
 * @param query - The query string to check and fix
 * @returns The query with balanced parentheses
 */
function ensureBalancedParentheses(query: string): string {
  let openCount = 0;
  let closeCount = 0;
  
  // Count open and close parentheses
  for (let i = 0; i < query.length; i++) {
    if (query[i] === '(') openCount++;
    if (query[i] === ')') closeCount++;
  }
  
  // Add missing closing parentheses
  if (openCount > closeCount) {
    return query + ')'.repeat(openCount - closeCount);
  }
  
  // Remove extra closing parentheses
  if (closeCount > openCount) {
    let result = '';
    let skipCount = closeCount - openCount;
    
    for (let i = 0; i < query.length; i++) {
      if (query[i] === ')' && skipCount > 0) {
        skipCount--;
        continue;
      }
      result += query[i];
    }
    
    return result;
  }
  
  return query;
}

/**
 * Search for cards using Scryfall's search syntax
 * 
 * @param query - The search query using Scryfall syntax
 * @param options - Additional search options
 * @returns Promise with search results
 */
export async function searchCards(query: string, options: SearchOptions = {}): Promise<SearchResult> {
  // Ensure parentheses are balanced
  const fixedQuery = ensureBalancedParentheses(query);
  
  const params = new URLSearchParams({
    q: fixedQuery,
    ...options.unique && { unique: options.unique },
    ...options.order && { order: options.order },
    ...options.dir && { dir: options.dir },
    ...options.includeExtras !== undefined && { include_extras: options.includeExtras.toString() },
    ...options.includeMultilingual !== undefined && { include_multilingual: options.includeMultilingual.toString() },
    ...options.includeVariations !== undefined && { include_variations: options.includeVariations.toString() },
    ...options.page && { page: options.page.toString() },
  });

  const url = `${SCRYFALL_API_BASE_URL}/cards/search?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MTG-Website/1.0',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ScryfallError(errorData.details, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ScryfallError) {
      throw error;
    }
    throw new ScryfallError('Failed to search cards', 500, { error: String(error) });
  }
}

/**
 * Get a card by its exact name
 * 
 * @param name - The exact card name to search for
 * @param options - Additional options
 * @returns Promise with the card data
 */
export async function getCardByExactName(name: string, options: NamedOptions = {}): Promise<Card> {
  const params = new URLSearchParams({
    exact: name,
    ...options.set && { set: options.set },
  });

  const url = `${SCRYFALL_API_BASE_URL}/cards/named?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MTG-Website/1.0',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ScryfallError(errorData.details, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ScryfallError) {
      throw error;
    }
    throw new ScryfallError('Failed to get card by exact name', 500, { error: String(error) });
  }
}

/**
 * Get a card by fuzzy name matching
 * 
 * @param name - The fuzzy card name to search for
 * @param options - Additional options
 * @returns Promise with the card data
 */
export async function getCardByFuzzyName(name: string, options: NamedOptions = {}): Promise<Card> {
  const params = new URLSearchParams({
    fuzzy: name,
    ...options.set && { set: options.set },
  });

  const url = `${SCRYFALL_API_BASE_URL}/cards/named?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MTG-Website/1.0',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ScryfallError(errorData.details, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ScryfallError) {
      throw error;
    }
    throw new ScryfallError('Failed to get card by fuzzy name', 500, { error: String(error) });
  }
}

/**
 * Get autocomplete suggestions for a card name
 * 
 * @param query - The partial card name to get suggestions for
 * @returns Promise with autocomplete suggestions
 */
export async function autocomplete(query: string): Promise<AutocompleteResult> {
  const params = new URLSearchParams({ q: query });
  const url = `${SCRYFALL_API_BASE_URL}/cards/autocomplete?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MTG-Website/1.0',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ScryfallError(errorData.details, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ScryfallError) {
      throw error;
    }
    throw new ScryfallError('Failed to get autocomplete suggestions', 500, { error: String(error) });
  }
}

/**
 * Get a random card
 * 
 * @param options - Options for filtering the random card
 * @returns Promise with a random card
 */
export async function getRandomCard(options: RandomCardOptions = {}): Promise<Card> {
  const params = new URLSearchParams({
    ...options.q && { q: options.q },
  });

  const url = `${SCRYFALL_API_BASE_URL}/cards/random?${params.toString()}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MTG-Website/1.0',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ScryfallError(errorData.details, response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ScryfallError) {
      throw error;
    }
    throw new ScryfallError('Failed to get random card', 500, { error: String(error) });
  }
}

/**
 * Custom error class for Scryfall API errors
 */
export class ScryfallError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ScryfallError';
    this.status = status;
    this.data = data;
  }
}

// Type definitions

export interface SearchOptions {
  unique?: 'cards' | 'art' | 'prints';
  order?: 'name' | 'set' | 'released' | 'rarity' | 'color' | 'usd' | 'tix' | 'eur' | 'cmc' | 'power' | 'toughness' | 'edhrec' | 'penny' | 'artist' | 'review';
  dir?: 'auto' | 'asc' | 'desc';
  includeExtras?: boolean;
  includeMultilingual?: boolean;
  includeVariations?: boolean;
  page?: number;
}

export interface NamedOptions {
  set?: string;
}

export interface RandomCardOptions {
  q?: string;
}

export interface SearchResult {
  object: 'list';
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: Card[];
}

export interface AutocompleteResult {
  object: 'catalog';
  total_values: number;
  data: string[];
}

export interface Card {
  id: string;
  name: string;
  layout: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  mana_cost?: string;
  cmc: number;
  type_line: string;
  oracle_text?: string;
  colors?: string[];
  color_identity: string[];
  legalities: Record<string, string>;
  set: string;
  set_name: string;
  collector_number: string;
  rarity: string;
  card_faces?: CardFace[];
  prices: {
    usd?: string;
    usd_foil?: string;
    usd_etched?: string;
    eur?: string;
    eur_foil?: string;
    tix?: string;
  };
  purchase_uris?: {
    tcgplayer?: string;
    cardmarket?: string;
    cardhoarder?: string;
  };
  [key: string]: any;
}

export interface CardFace {
  name: string;
  mana_cost?: string;
  type_line: string;
  oracle_text?: string;
  colors?: string[];
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  [key: string]: any;
}
