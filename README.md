# Relentless App (MVP)

A production-minded MVP for the first real **Relentless coaching platform**.

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite (local)
- NextAuth credentials auth (email/password)

## Features Implemented
- Working email/password auth
- Registration page
- Role-based redirects and route protection
  - `COACH -> /coach-dashboard`
  - `CLIENT -> /client-dashboard`
- Client dashboard with:
  - Relentless score overview + trend
  - Score breakdown pillars
  - Score history trend chart + latest entries
  - Consistency and adherence
  - Habit tracking table
  - Training/coaching panel
  - Functional check-in submission form (writes to DB)
- Coach dashboard with:
  - Client operations table
  - Priority alerts
  - Insights cards
  - Click-through client detail view
- Prisma schema with required models and relationships
- Seed script with realistic demo data

## Demo Accounts
- `coach@relentless.com / password123`
- `client1@relentless.com / password123`
- `client2@relentless.com / password123`

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Run migration:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed demo data:
   ```bash
   npm run prisma:seed
   ```
5. Start dev server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000`

## Prisma Commands
- Generate client: `npm run prisma:generate`
- Create migration: `npm run prisma:migrate`
- Seed data: `npm run prisma:seed`

## Notes on architecture
- Separated data-access layer in `src/lib/data.ts`
- Explicit role enforcement in server pages and middleware
- Models designed for future expansion into score engine + recommendations + AI guidance
