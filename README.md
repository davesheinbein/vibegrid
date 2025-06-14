# Grid Royale

_Created by David Sheinbein. All rights reserved by Noble Beasts Corporation._

[GitHub Repository](https://github.com/davesheinbein/vibegrid.git)

Grid Royale is a collaborative and competitive word grouping puzzle game inspired by the "Connections" genre. Players must group words into sets based on hidden relationships, with daily puzzles, custom puzzles, and real-time multiplayer VS modes.

## How to Play

- Each puzzle presents a grid of words. The number of words and sets can vary, but there are always an even number of groups, and the number of sets is determined by the grid's rows and columns.
- Your goal is to group the words into sets, where each set shares a hidden connection (such as synonyms, categories, or themes).
- Select or drag words to form a group, then submit your guess. You receive feedback on whether your group is correct, partially correct, or incorrect.
- Continue grouping until all sets are found.

## Game Modes & Rules

### Daily Puzzle

- One new puzzle is released each day for all players.
- Everyone solves the same puzzle and can compare results.
- You have a limited number of mistakes before the puzzle locks for the day.

### Custom Puzzles

- Create your own puzzles and share them with friends or the community.
- Custom puzzles can have any valid grid size and group structure.
- No mistake limit unless set by the puzzle creator.

### VS Mode

- Compete in real-time against friends or bots.
- Both players solve the same puzzle simultaneously.
- The first to correctly group all sets wins, or the player with the most correct groups when time runs out.
- Incorrect guesses may incur a time penalty.

### Practice

- Play unlimited solo puzzles, either randomly generated or user-created.
- No mistake or time limits.
- Great for learning and improving your skills.

## Core Features

- **Word Grouping:** Drag or select words to form groups. Submit when you think a group is correct.
- **Feedback:** Get feedback on correct/incorrect groups, partial matches, and streaks.
- **Achievements:** Unlock badges for milestones and special feats.
- **Leaderboards:** Track top players globally, by season, and among friends.
- **Notifications:** Receive updates for achievements, friend activity, and system events.
- **Admin Tools:** Manage users, approve puzzles, and monitor live matches.

## Entity Relationship Diagram (ERD)

```
User ─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
                 │             │             │             │             │             │             │
           (1)  Progression    │        Achievement        Friend        Notification  Customization  Match
                 │             │             │             │             │             │             │
                 ▼             ▼             ▼             ▼             ▼             ▼             ▼
              Progression   Achievement   Friend         Notification  Customization  Match         Puzzle

User
- id (PK)
- email
- name
- xp
- level
- settings (Json)
- stats (Json)
- ...

Achievement
- id (PK)
- label
- description
- tier
- ...

UserAchievement
- id (PK)
- userId (FK)
- achievementId (FK)
- unlockedAt

Friend
- id (PK)
- userId (FK)
- friendId (FK)
- status (pending/accepted)
- createdAt

Notification
- id (PK)
- userId (FK)
- type
- message
- read
- createdAt

Customization
- id (PK)
- userId (FK)
- slot (theme, font, emote, border, background)
- itemId
- equipped

Match
- id (PK)
- player1Id (FK)
- player2Id (FK)
- winnerId (FK)
- puzzleId (FK)
- startedAt
- endedAt
- moves (Json)

Puzzle
- id (PK)
- authorId (FK)
- words (Json)
- groups (Json)
- difficulty
- isDaily
- createdAt

Progression
- id (PK)
- userId (FK)
- xp
- level
- streak
```

## Tech Stack

- Next.js (API routes, SSR, frontend)
- TypeScript
- Prisma ORM (PostgreSQL)
- React, Redux
- Socket.IO (real-time multiplayer)
- Web Push (notifications)

## Development

- All backend logic is in `/src/pages/api/` and `/src/lib/`.
- Database access via Prisma client in `/src/server/prismaClient.ts`.
- See `/prisma/schema.prisma` for the full DB schema.

## Running Locally

1. Clone the repo:
   ```sh
   git clone https://github.com/davesheinbein/vibegrid.git
   cd vibegrid
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at http://localhost:3000
4. Open Prisma Studio to view and edit the database:
   ```sh
   npx prisma studio
   ```

---

For more, see the code and comments in `/src/pages/api/` and `/src/lib/`.
