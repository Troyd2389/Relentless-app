import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@relentless.local' },
    update: { name: 'Demo Admin', role: 'ADMIN' },
    create: {
      email: 'admin@relentless.local',
      name: 'Demo Admin',
      role: 'ADMIN'
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@relentless.local' },
    update: { name: 'Demo User', role: 'USER' },
    create: {
      email: 'user@relentless.local',
      name: 'Demo User',
      role: 'USER'
    }
  });

  await prisma.post.upsert({
    where: { id: 1 },
    update: {
      title: 'Welcome to Relentless',
      body: 'Prisma + SQLite is now initialized correctly.',
      published: true,
      authorId: admin.id
    },
    create: {
      id: 1,
      title: 'Welcome to Relentless',
      body: 'Prisma + SQLite is now initialized correctly.',
      published: true,
      authorId: admin.id
    }
  });

  await prisma.post.upsert({
    where: { id: 2 },
    update: {
      title: 'Getting Started',
      body: 'Run npm run prisma:migrate && npm run prisma:seed to populate local data.',
      published: true,
      authorId: user.id
    },
    create: {
      id: 2,
      title: 'Getting Started',
      body: 'Run npm run prisma:migrate && npm run prisma:seed to populate local data.',
      published: true,
      authorId: user.id
    }
  });

  const totals = await Promise.all([
    prisma.user.count(),
    prisma.post.count()
  ]);

  console.log(`Seed complete: ${totals[0]} users, ${totals[1]} posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
