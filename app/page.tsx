"use client";

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 px-4 bg-card-bg rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to <span className="text-primary">MTG Assistant</span>
        </h1>
        <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
          Your AI-powered companion for Magic: The Gathering deck building, card search, and deck evaluation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/deck-builder" className="btn-primary text-center py-3 px-6 text-lg">
            Build a Deck
          </Link>
          <Link href="/search" className="btn-secondary text-center py-3 px-6 text-lg">
            Search Cards
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Natural Language Search</h2>
          <p className="text-foreground/70">
            Search for cards using plain English. Our AI translates your queries into precise Scryfall syntax.
          </p>
        </div>

        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Deck Building</h2>
          <p className="text-foreground/70">
            Create and organize your decks with automatic categorization and custom organization options.
          </p>
        </div>

        <div className="card p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Deck Evaluation</h2>
          <p className="text-foreground/70">
            Analyze your deck's mana curve, color balance, and get AI-powered suggestions for improvements.
          </p>
        </div>
      </section>

      <section className="card p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary/10 rounded-full p-2 mr-4">
              <span className="text-primary font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Create an Account</h3>
              <p className="text-foreground/70">Sign up to save your decks and access all features.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary/10 rounded-full p-2 mr-4">
              <span className="text-primary font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Search for Cards</h3>
              <p className="text-foreground/70">Use natural language to find exactly what you need.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary/10 rounded-full p-2 mr-4">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Build Your Deck</h3>
              <p className="text-foreground/70">Add cards, organize them, and get instant feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Space */}
      <div className="p-4 bg-secondary-bg rounded-lg text-center">
        <p className="text-foreground/50 text-sm mb-2">Advertisement</p>
        <div className="bg-card-bg h-24 flex items-center justify-center border border-border rounded">
          <p className="text-foreground/30">Ad Space - 728x90</p>
        </div>
      </div>
    </div>
  );
}
