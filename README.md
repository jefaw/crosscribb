# Cross Cribbs

A web-based card game that combines elements of Cribbage with a grid-based gameplay, built using Next.js and React.

## Game Overview

Cross Cribbs is a 2-player card game played on a 5x5 grid. Players take turns placing cards to create scoring combinations in both rows and columns, similar to Cribbage scoring rules.

## Game Rules

### Setup
- The game is played on a 5x5 grid
- Each player starts with 12 cards
- A center card is placed in the middle of the board (position 2,2)
- Players take turns placing cards on empty spots

### Scoring System

The game uses three main scoring components:

1. **Pairs**
   - 2 points for a pair (2 of a kind)
   - 6 points for three of a kind
   - 12 points for four of a kind

2. **Runs**
   - 3 points for a run of 3 cards
   - 4 points for a run of 4 cards
   - 5 points for a run of 5 cards
   - Multiplied by the number of cards in the run if duplicates exist

3. **Fifteens**
   - 2 points for each combination of cards that sums to 15
   - Face cards (J, Q, K) count as 10
   - Aces count as 1

### Winning
- Scores are calculated for both rows and columns
- The player with the higher score (rows vs columns) wins the round
- The winner earns the difference in points between the row and column scores
- The game keeps track of total scores across rounds

## Technical Implementation

### Core Components

1. **Game Logic** (`useCribbs.js`)
   - Manages game state
   - Handles turn-based gameplay
   - Controls card placement
   - Calculates scores

2. **Card System**
   - `Card.js`: Represents individual cards with properties:
     - Name (ace through king)
     - Value (1-13)
     - Suit (spades, clubs, hearts, diamonds)
     - Image source
   - `Deck.js`: Manages the deck of cards:
     - Creates and shuffles the deck
     - Deals cards to players

3. **Board System**
   - `Board.js`: Renders the 5x5 game grid
   - `Spot.js`: Individual grid positions that:
     - Accept card placements
     - Handle drag and drop functionality
     - Display played cards

4. **Scoring System** (`helpers.js`)
   - Complex scoring algorithms for:
     - Finding pairs
     - Identifying runs
     - Calculating fifteen combinations
   - Transposes board for column scoring
   - Tracks both round and total scores

### Game Flow

1. **Initialization**
   ```javascript
   - Create and shuffle deck
   - Place center card
   - Deal cards to players
   ```

2. **Gameplay Loop**
   ```javascript
   - Player selects card
   - Card is placed on board
   - Turn switches to other player
   - Process repeats until board is full
   ```

3. **Round End**
   ```javascript
   - Calculate row and column scores
   - Determine winner
   - Update total scores
   - Display round summary
   ```

4. **Round Reset**
   ```javascript
   - Clear board
   - Create new deck
   - Deal new hands
   - Preserve total scores
   ```

## UI Features

- Modern, responsive design using Tailwind CSS
- Drag and drop card placement
- Visual feedback for current turn
- Card count display
- Detailed round summary screen
- Score breakdown showing pairs, runs, and fifteens

## Development

Built with:
- Next.js
- React
- Tailwind CSS
- Modern JavaScript (ES6+)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

Feel free to submit issues and enhancement requests!
