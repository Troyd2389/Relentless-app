import { endOfWeek, startOfWeek, subDays } from 'date-fns';
import { prisma } from './prisma';

export async function getClientDashboardData(userId: string) {
  const profile = await prisma.clientProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      scoreEntries: { orderBy: { date: 'asc' } },
      workoutCheckIns: { orderBy: { date: 'desc' }, take: 10 },
      habitEntries: { orderBy: { date: 'desc' }, take: 7 },
      trainingPlans: { where: { isActive: true }, orderBy: { startDate: 'desc' }, take: 1 },
      coachNotes: { orderBy: { createdAt: 'desc' }, take: 3 }
    }
  });

  if (!profile) return null;

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const checkinsThisWeek = await prisma.workoutCheckIn.count({
    where: {
      clientProfileId: profile.id,
      date: { gte: weekStart, lte: weekEnd },
      workoutCompleted: true
    }
  });

  const adherence = profile.weeklyAssigned
    ? Math.round((checkinsThisWeek / profile.weeklyAssigned) * 100)
    : 0;

  return {
    profile,
    adherence
  };
}

export async function getCoachDashboardData(coachId: string) {
  const profiles = await prisma.clientProfile.findMany({
    where: { coachId },
    include: {
      user: true,
      scoreEntries: { orderBy: { date: 'desc' }, take: 2 },
      workoutCheckIns: { orderBy: { date: 'desc' }, take: 14 }
    },
    orderBy: { updatedAt: 'desc' }
  });

  const table = profiles.map((p: any) => {
    const latest = p.scoreEntries[0];
    const previous = p.scoreEntries[1];
    const trend = !latest || !previous ? '—' : latest.relentlessScore > previous.relentlessScore ? 'Up' : latest.relentlessScore < previous.relentlessScore ? 'Down' : 'Flat';
    const completed = p.workoutCheckIns.filter((c: any) => c.workoutCompleted && c.date >= subDays(new Date(), 7)).length;
    const adherence = p.weeklyAssigned ? Math.round((completed / p.weeklyAssigned) * 100) : 0;

    return {
      id: p.id,
      name: p.user.name,
      score: latest?.relentlessScore ?? 0,
      trend,
      adherence,
      streak: p.currentStreak,
      lastCheckIn: p.workoutCheckIns[0]?.date ?? null,
      status: p.status
    };
  });

  const averageAdherence = table.length ? Math.round(table.reduce((a: number, c: any) => a + c.adherence, 0) / table.length) : 0;
  const averageScore = table.length ? Math.round(table.reduce((a: number, c: any) => a + c.score, 0) / table.length) : 0;

  return {
    table,
    alerts: {
      lowAdherence: table.filter((c: any) => c.adherence < 70),
      decliningScores: table.filter((c: any) => c.trend === 'Down'),
      noRecentCheckins: table.filter((c: any) => !c.lastCheckIn || c.lastCheckIn < subDays(new Date(), 3))
    },
    insights: {
      totalClients: table.length,
      averageAdherence,
      averageScore,
      needsAction: table.filter((c: any) => c.status !== 'On Track').length
    }
  };
}
