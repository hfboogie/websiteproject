# MTG Deck Builder & Card Search

A comprehensive Magic: The Gathering web application that combines natural language card search, deck building, and card purchasing capabilities.

## Features

- **Natural Language Search**: Use plain English to search for cards, powered by OpenAI's API
- **Scryfall Integration**: Access Scryfall's extensive card database with advanced filtering and sorting
- **Deck Building**: Create, save, and organize your decks with intuitive drag-and-drop functionality
- **Deck Evaluation**: Get suggestions to improve your deck's mana base and overall power
- **Card Purchasing**: Buy cards through affiliate links to major retailers

## Tech Stack

- Next.js with TypeScript
- Tailwind CSS for styling
- OpenAI API for natural language processing
- Scryfall API for card data
- Database for user accounts and deck storage

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/hfboogie/websiteproject.git
   cd websiteproject
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app`: Next.js application routes and pages
- `/components`: Reusable React components
- `/lib`: Utility functions and API clients
- `/public`: Static assets
- `/styles`: Global styles and Tailwind configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details.
