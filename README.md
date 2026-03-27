# Relentless App (Prisma + SQLite local setup)

This repository now includes a complete local Prisma setup using SQLite, a seed script, and a small Express app.

## 0) Environment file
Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

If your network blocks Prisma engine downloads (HTTP 403), set an internal mirror:

```bash
export PRISMA_ENGINES_MIRROR="https://<your-internal-prisma-mirror>"
```

## 1) Install dependencies
```bash
npm install
```

## 2) Run Prisma migrations
```bash
npm run prisma:migrate
```

## 3) Generate Prisma Client
```bash
npm run prisma:generate
```

## 4) Seed the database
```bash
npm run prisma:seed
```

## 5) Start the app
```bash
npm run dev
```

## 6) Verify demo users + data
In a second terminal, call:

```bash
curl -s http://localhost:3000/demo
```

You should see:
- `admin@relentless.local`
- `user@relentless.local`
- two demo posts

## One-command bootstrap
```bash
./scripts/bootstrap-prisma.sh
```

## Endpoints
- `GET /health` -> verifies DB connectivity
- `GET /demo` -> returns demo users and their posts
