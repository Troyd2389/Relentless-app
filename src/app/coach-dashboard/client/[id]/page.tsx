import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ScoreLineChart } from '@/components/line-chart';
import { authOptions } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import { prisma } from '@/lib/prisma';

export default async function CoachClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login');
  if (session.user.role !== 'COACH') redirect('/client-dashboard');

  const profile = await prisma.clientProfile.findUnique({
    where: { id },
    include: {
      user: true,
      scoreEntries: { orderBy: { date: 'asc' } },
      workoutCheckIns: { orderBy: { date: 'desc' }, take: 14 },
      habitEntries: { orderBy: { date: 'desc' }, take: 14 },
      coachNotes: { orderBy: { createdAt: 'desc' }, take: 6 },
      trainingPlans: { where: { isActive: true }, take: 1 }
    }
  });

  if (!profile || profile.coachId !== session.user.id) notFound();
  const latest = profile.scoreEntries[profile.scoreEntries.length - 1];

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-6">
      <Link href="/coach-dashboard" className="text-sm text-zinc-300 underline">← Back to dashboard</Link>
      <div className="card">
        <h1 className="text-2xl font-bold">{profile.user.name}</h1>
        <p className="text-sm text-zinc-400">Goals: {profile.goals}</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="mb-2 font-semibold">Score History</h2>
          <ScoreLineChart data={profile.scoreEntries.map((s: any) => ({ label: format(s.date, 'MMM d'), value: s.relentlessScore }))} />
        </div>
        <div className="card">
          <h2 className="mb-2 font-semibold">Latest Breakdown</h2>
          {latest ? <ul className="space-y-1 text-sm"><li>Cardio: {latest.cardio}</li><li>Strength: {latest.strength}</li><li>Mobility: {latest.mobility}</li><li>Balance: {latest.balance}</li><li>Body Composition: {latest.bodyComposition}</li><li>Lifestyle: {latest.lifestyle}</li></ul> : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card"><h3 className="mb-2 font-semibold">Check-in History</h3><ul className="space-y-1 text-sm">{profile.workoutCheckIns.map((c: any) => <li key={c.id}>{formatDate(c.date)} • {c.workoutCompleted ? 'Completed' : 'Missed'} • Energy {c.energy}/10 • Soreness {c.soreness}/10</li>)}</ul></div>
        <div className="card"><h3 className="mb-2 font-semibold">Habit History</h3><ul className="space-y-1 text-sm">{profile.habitEntries.map((h: any) => <li key={h.id}>{formatDate(h.date)} • Sleep {h.sleepHours}h • Steps {h.steps}</li>)}</ul></div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card"><h3 className="mb-2 font-semibold">Coach Notes</h3><ul className="list-disc space-y-1 pl-4 text-sm">{profile.coachNotes.map((n: any) => <li key={n.id}>{n.content}</li>)}</ul></div>
        <div className="card"><h3 className="mb-2 font-semibold">Assigned Plan</h3><p className="text-sm font-medium">{profile.trainingPlans[0]?.title}</p><p className="text-sm text-zinc-300">{profile.trainingPlans[0]?.summary}</p></div>
      </section>
    </main>
  );
}
