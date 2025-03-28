# MTG Deck Builder Website Project

This project is a Magic: The Gathering deck building website with AI-powered natural language search capabilities, user authentication, and deck evaluation features.

## Features

- **Natural Language Search**: Search for cards using plain English queries that get translated to Scryfall syntax
- **Deck Building**: Create and organize decks with automatic card categorization
- **User Authentication**: Email/password login and account management
- **Deck Evaluation**: Analyze deck statistics and get improvement suggestions
- **AI Analysis**: Get AI-powered subjective analysis of your deck (coming soon)
- **TCGPlayer Integration**: Purchase cards through affiliate links (coming soon)

## Technology Stack

- **Frontend**: Next.js with TypeScript, Tailwind CSS, and App Router
- **Authentication**: NextAuth.js with Prisma adapter
- **APIs**: Scryfall API for card data, OpenAI API for natural language processing
- **Database**: SQLite (development), PostgreSQL (production)

## Development Status

The project is currently in active development with the following components implemented:

- ✅ Basic Next.js application structure
- ✅ Scryfall API integration
- ✅ Natural language search using OpenAI API
- ✅ Deck building functionality
- ✅ User authentication (email/password)
- ✅ Deck evaluation statistics
- 🔄 Visual design improvements (in progress)
- 🔄 Card organization enhancements (in progress)
- ⏳ Google OAuth integration (placeholder)
- ⏳ AI-powered deck analysis (planned)
- ⏳ TCGPlayer affiliate integration (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hfboogie/websiteproject.git
cd websiteproject
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-change-in-production"
OPENAI_API_KEY="your-openai-api-key"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

- `/app`: Next.js App Router pages and API routes
- `/components`: React components
- `/lib`: Utility functions and API clients
- `/prisma`: Database schema and client
- `/public`: Static assets
- `/design`: UX design documentation and mockups

## Contributing

Please read the [CONTINUATION.md](./CONTINUATION.md) file for details on the current development status and next steps.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
