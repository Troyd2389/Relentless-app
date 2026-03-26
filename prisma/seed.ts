import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { subDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  await prisma.coachNote.deleteMany();
  await prisma.trainingPlan.deleteMany();
  await prisma.habitEntry.deleteMany();
  await prisma.workoutCheckIn.deleteMany();
  await prisma.scoreEntry.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  const coach = await prisma.user.create({
    data: {
      email: 'coach@relentless.com',
      passwordHash,
      name: 'Alex Mercer',
      role: 'COACH'
    }
  });

  const clientUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'client1@relentless.com',
        passwordHash,
        name: 'Jordan Blake',
        role: 'CLIENT'
      }
    }),
    prisma.user.create({
      data: {
        email: 'client2@relentless.com',
        passwordHash,
        name: 'Taylor Quinn',
        role: 'CLIENT'
      }
    })
  ]);

  const profiles = await Promise.all([
    prisma.clientProfile.create({
      data: {
        userId: clientUsers[0].id,
        coachId: coach.id,
        currentFocus: 'Improve aerobic base while maintaining strength quality.',
        currentStreak: 9,
        weeklyAssigned: 5,
        topPriorities: 'Zone 2 consistency | Sleep >7.5h | Daily mobility reset',
        nextRecommended: 'Complete the Thursday threshold intervals and submit recovery notes.',
        goals: 'Increase Relentless Score to 82 by June and run a 10K under 50 minutes.',
        status: 'On Track'
      }
    }),
    prisma.clientProfile.create({
      data: {
        userId: clientUsers[1].id,
        coachId: coach.id,
        currentFocus: 'Rebuild consistency and improve mobility limitations.',
        currentStreak: 3,
        weeklyAssigned: 4,
        topPriorities: 'Hit 8k steps daily | 3 strength sessions | Evening wind-down',
        nextRecommended: 'Book mobility review and complete two consecutive workout days.',
        goals: 'Improve body composition and reduce low back pain during lifting.',
        status: 'Needs Follow-Up'
      }
    })
  ]);

  for (const [index, profile] of profiles.entries()) {
    const baseline = index === 0 ? 72 : 61;
    for (let i = 0; i < 8; i++) {
      await prisma.scoreEntry.create({
        data: {
          clientProfileId: profile.id,
          date: subDays(new Date(), 7 * (7 - i)),
          relentlessScore: baseline + i - (index === 1 && i > 5 ? 2 : 0),
          cardio: baseline - 2 + i,
          strength: baseline + 1 + i,
          mobility: baseline - 4 + i,
          balance: baseline - 5 + i,
          bodyComposition: baseline - 3 + i,
          lifestyle: baseline - 1 + i,
          note: i === 7 ? 'Latest assessment' : null
        }
      });
    }

    for (let d = 0; d < 10; d++) {
      await prisma.workoutCheckIn.create({
        data: {
          clientProfileId: profile.id,
          date: subDays(new Date(), d),
          workoutCompleted: index === 0 ? d % 5 !== 0 : d % 3 !== 0,
          energy: Math.max(5, 8 - (index === 1 ? d % 4 : d % 3)),
          soreness: 3 + (d % 4),
          notes: d === 0 ? 'Felt strong on the main set.' : null
        }
      });
    }

    for (let d = 0; d < 7; d++) {
      await prisma.habitEntry.create({
        data: {
          clientProfileId: profile.id,
          date: subDays(new Date(), d),
          sleepHours: index === 0 ? 7.4 + (d % 2) * 0.4 : 6.5 + (d % 3) * 0.3,
          steps: index === 0 ? 9800 - d * 220 : 7600 - d * 180,
          strengthSessions: d < 3 ? 1 : 0,
          cardioSessions: d < 4 ? 1 : 0,
          mobilitySessions: d < 5 ? 1 : 0
        }
      });
    }

    await prisma.trainingPlan.create({
      data: {
        clientProfileId: profile.id,
        title: index === 0 ? 'Performance Block A' : 'Consistency Reset Block',
        summary:
          index === 0
            ? '4-day split with zone 2 and threshold intervals, plus mobility primers.'
            : '3-day full-body strength, low-impact cardio, and daily mobility sequence.',
        startDate: subDays(new Date(), 21),
        endDate: null,
        isActive: true
      }
    });

    await prisma.coachNote.createMany({
      data: [
        {
          clientProfileId: profile.id,
          coachId: coach.id,
          content: 'Focus on movement quality before load progression.'
        },
        {
          clientProfileId: profile.id,
          coachId: coach.id,
          content: 'Recovery metrics look stable. Maintain hydration targets.'
        }
      ]
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
