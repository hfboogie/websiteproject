"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    closeMenus();
  };

  return (
    <nav className="bg-header-bg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                MTG Assistant
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/'
                    ? 'tab-active'
                    : 'tab-inactive'
                }`}
                onClick={closeMenus}
              >
                Home
              </Link>
              <Link
                href="/deck-builder"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/deck-builder'
                    ? 'tab-active'
                    : 'tab-inactive'
                }`}
                onClick={closeMenus}
              >
                Deck Builder
              </Link>
              <Link
                href="/search"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/search'
                    ? 'tab-active'
                    : 'tab-inactive'
                }`}
                onClick={closeMenus}
              >
                Card Search
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    id="user-menu-button"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    onClick={toggleUserMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                    </div>
                  </button>
                </div>
                {isUserMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-card-bg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <div className="px-4 py-2 text-sm text-foreground border-b border-border">
                      Signed in as <span className="font-medium">{session.user?.email}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-card-hover"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                      onClick={closeMenus}
                    >
                      Your Profile
                    </Link>
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-card-hover"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/auth/signin"
                  className="btn-secondary"
                  onClick={closeMenus}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-primary"
                  onClick={closeMenus}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-card-hover focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/'
                  ? 'border-primary text-primary bg-card-hover'
                  : 'border-transparent text-foreground hover:bg-card-hover hover:border-primary/50 hover:text-primary'
              }`}
              onClick={closeMenus}
            >
              Home
            </Link>
            <Link
              href="/deck-builder"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/deck-builder'
                  ? 'border-primary text-primary bg-card-hover'
                  : 'border-transparent text-foreground hover:bg-card-hover hover:border-primary/50 hover:text-primary'
              }`}
              onClick={closeMenus}
            >
              Deck Builder
            </Link>
            <Link
              href="/search"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                pathname === '/search'
                  ? 'border-primary text-primary bg-card-hover'
                  : 'border-transparent text-foreground hover:bg-card-hover hover:border-primary/50 hover:text-primary'
              }`}
              onClick={closeMenus}
            >
              Card Search
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            {session ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-foreground">
                      {session.user?.name || 'User'}
                    </div>
                    <div className="text-sm font-medium text-foreground/70">
                      {session.user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-foreground hover:bg-card-hover"
                    onClick={closeMenus}
                  >
                    Your Profile
                  </Link>
                  <button
                    className="w-full text-left block px-4 py-2 text-base font-medium text-foreground hover:bg-card-hover"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-4">
                <Link
                  href="/auth/signin"
                  className="block w-full py-2 text-base font-medium text-foreground hover:bg-card-hover rounded-md"
                  onClick={closeMenus}
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full py-2 text-base font-medium text-primary hover:bg-card-hover rounded-md"
                  onClick={closeMenus}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
