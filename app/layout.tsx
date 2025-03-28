import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MTG Assistant',
  description: 'Magic: The Gathering deck building and card search with AI-powered natural language search',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-header-bg border-t border-border py-6">
              <div className="container mx-auto px-4">
                <p className="text-center text-foreground/70 text-sm">
                  © {new Date().getFullYear()} MTG Assistant. Not affiliated with Wizards of the Coast.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
