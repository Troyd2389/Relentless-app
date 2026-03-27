import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: 'connected' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/demo', async (_req, res) => {
  const users = await prisma.user.findMany({ include: { posts: true } });
  res.json(users);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Relentless app running at http://localhost:${port}`);
});
