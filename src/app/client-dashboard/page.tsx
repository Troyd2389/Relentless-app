import { format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { CheckInForm } from '@/components/checkin-form';
import { ScoreLineChart } from '@/components/line-chart';
import { SignOutButton } from '@/components/signout-button';
import { authOptions } from '@/lib/auth';
import { getClientDashboardData } from '@/lib/data';
import { formatDate } from '@/lib/format';

export default async function ClientDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login');
  if (session.user.role !== 'CLIENT') redirect('/coach-dashboard');

  const data = await getClientDashboardData(session.user.id);
  if (!data) redirect('/auth/login');

  const latest = data.profile.scoreEntries[data.profile.scoreEntries.length - 1];
  const prev = data.profile.scoreEntries[data.profile.scoreEntries.length - 2];
  const trend = !latest || !prev ? '—' : latest.relentlessScore > prev.relentlessScore ? '↑ Improving' : latest.relentlessScore < prev.relentlessScore ? '↓ Declining' : '→ Stable';

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Client Dashboard</p>
          <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
        </div>
        <SignOutButton />
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="card md:col-span-2">
          <p className="text-sm text-zinc-400">Relentless Score</p>
          <p className="mt-2 text-4xl font-bold">{latest?.relentlessScore ?? '--'}</p>
          <p className="mt-1 text-sm text-zinc-400">Updated {latest ? formatDate(latest.date) : 'N/A'} • {trend}</p>
          <p className="mt-3 text-sm">Current focus: {data.profile.currentFocus}</p>
        </div>
        <div className="card">
          <p className="text-sm text-zinc-400">Adherence</p>
          <p className="mt-2 text-3xl font-semibold">{data.adherence}%</p>
          <p className="text-sm text-zinc-400">{data.profile.currentStreak}-day streak</p>
        </div>
        <div className="card">
          <p className="text-sm text-zinc-400">Last check-in</p>
          <p className="mt-2 text-lg">{data.profile.workoutCheckIns[0] ? formatDate(data.profile.workoutCheckIns[0].date) : 'No check-ins yet'}</p>
          <p className="text-sm text-zinc-400">Assigned this week: {data.profile.weeklyAssigned}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">Progress</h2>
          <ScoreLineChart
            data={data.profile.scoreEntries.map((entry: any) => ({
              label: format(entry.date, 'MMM d'),
              value: entry.relentlessScore
            }))}
          />
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {data.profile.scoreEntries.slice(-3).reverse().map((entry: any) => (
              <div key={entry.id} className="rounded-md border border-border p-2 text-sm">
                <p>{formatDate(entry.date)}</p>
                <p className="font-semibold">Score {entry.relentlessScore}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-2 text-lg font-semibold">Score Breakdown</h2>
          {latest ? (
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>Cardio: {latest.cardio}</li>
              <li>Strength: {latest.strength}</li>
              <li>Mobility: {latest.mobility}</li>
              <li>Balance: {latest.balance}</li>
              <li>Body Composition: {latest.bodyComposition}</li>
              <li>Lifestyle: {latest.lifestyle}</li>
            </ul>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card">
          <h2 className="mb-2 text-lg font-semibold">Habits (Recent)</h2>
          <div className="space-y-2 text-sm">
            {data.profile.habitEntries.map((habit: any) => (
              <div key={habit.id} className="rounded border border-border p-2">
                <p className="text-zinc-400">{formatDate(habit.date)}</p>
                <p>Sleep: {habit.sleepHours}h • Steps: {habit.steps}</p>
                <p>S/C/M: {habit.strengthSessions}/{habit.cardioSessions}/{habit.mobilitySessions}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-2 text-lg font-semibold">Training & Coaching</h2>
          <p className="text-sm text-zinc-400">Current plan</p>
          <p className="font-medium">{data.profile.trainingPlans[0]?.title ?? 'No active plan'}</p>
          <p className="mt-2 text-sm">{data.profile.trainingPlans[0]?.summary}</p>
          <p className="mt-3 text-sm text-zinc-400">Top 3 priorities</p>
          <p className="text-sm">{data.profile.topPriorities}</p>
          <p className="mt-3 text-sm text-zinc-400">Next recommended action</p>
          <p className="text-sm">{data.profile.nextRecommended}</p>
          <p className="mt-3 text-sm text-zinc-400">Coach notes</p>
          <ul className="list-disc pl-4 text-sm">
            {data.profile.coachNotes.map((note: any) => (
              <li key={note.id}>{note.content}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="mb-2 text-lg font-semibold">Submit Check-in</h2>
          <CheckInForm />
        </div>
      </section>
    </main>
  );
}
