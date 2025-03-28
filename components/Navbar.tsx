"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === "authenticated" ? (
              <div className="relative ml-3">
                <div className="flex items-center">
                  {session.user?.image && (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={session.user.image}
                      alt={`${session.user.name}'s profile`}
                    />
                  )}
                  <span className="ml-2 text-sm text-gray-700">
                    {session.user?.name}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="ml-4 px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            href="/"
            className="text-gray-600 hover:bg-blue-50 hover:text-blue-600 block pl-3 pr-4 py-2 text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Search
          </Link>
          <Link 
            href="/deck-builder"
            className="text-gray-600 hover:bg-blue-50 hover:text-blue-600 block pl-3 pr-4 py-2 text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Deck Builder
          </Link>
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          {status === "authenticated" ? (
            <div className="flex items-center px-4">
              {session.user?.image && (
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={session.user.image}
                    alt={`${session.user.name}'s profile`}
                  />
                </div>
              )}
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {session.user?.name}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {session.user?.email}
                </div>
              </div>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setIsMenuOpen(false);
                }}
                className="ml-auto bg-blue-600 flex-shrink-0 p-1 rounded-full text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Sign out</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-1 px-2">
              <Link
                href="/auth/signin"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
