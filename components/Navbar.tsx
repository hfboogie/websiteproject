"use client";

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                MTG Assistant
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/"
                className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Search
              </Link>
              <Link 
                href="/deck-builder"
                className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Deck Builder
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href="/"
            className="text-gray-600 hover:bg-blue-50 hover:text-blue-600 block pl-3 pr-4 py-2 text-base font-medium"
          >
            Search
          </Link>
          <Link 
            href="/deck-builder"
            className="text-gray-600 hover:bg-blue-50 hover:text-blue-600 block pl-3 pr-4 py-2 text-base font-medium"
          >
            Deck Builder
          </Link>
        </div>
      </div>
    </nav>
  );
}
