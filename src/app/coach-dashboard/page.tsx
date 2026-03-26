import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/signout-button';
import { authOptions } from '@/lib/auth';
import { getCoachDashboardData } from '@/lib/data';
import { formatDate } from '@/lib/format';

export default async function CoachDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/auth/login');
  if (session.user.role !== 'COACH') redirect('/client-dashboard');

  const data = await getCoachDashboardData(session.user.id);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Coach Dashboard</p>
          <h1 className="text-2xl font-bold">Operations Overview</h1>
        </div>
        <SignOutButton />
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="card"><p className="text-sm text-zinc-400">Total Clients</p><p className="text-3xl font-semibold">{data.insights.totalClients}</p></div>
        <div className="card"><p className="text-sm text-zinc-400">Avg Adherence</p><p className="text-3xl font-semibold">{data.insights.averageAdherence}%</p></div>
        <div className="card"><p className="text-sm text-zinc-400">Avg Score</p><p className="text-3xl font-semibold">{data.insights.averageScore}</p></div>
        <div className="card"><p className="text-sm text-zinc-400">Need Action Today</p><p className="text-3xl font-semibold">{data.insights.needsAction}</p></div>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="mb-3 text-lg font-semibold">Client Performance Table</h2>
        <table className="min-w-full text-left text-sm">
          <thead className="text-zinc-400">
            <tr>
              <th className="py-2">Name</th><th>Score</th><th>Trend</th><th>Adherence</th><th>Streak</th><th>Last Check-in</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.table.map((client: any) => (
              <tr key={client.id} className="border-t border-border">
                <td className="py-3"><Link href={`/coach-dashboard/client/${client.id}`} className="font-medium underline">{client.name}</Link></td>
                <td>{client.score}</td>
                <td>{client.trend}</td>
                <td>{client.adherence}%</td>
                <td>{client.streak}</td>
                <td>{client.lastCheckIn ? formatDate(client.lastCheckIn) : 'No recent check-in'}</td>
                <td>{client.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card"><h3 className="mb-2 font-semibold">Low adherence</h3><ul className="space-y-1 text-sm text-zinc-300">{data.alerts.lowAdherence.map((c: any) => <li key={c.id}>{c.name} ({c.adherence}%)</li>)}</ul></div>
        <div className="card"><h3 className="mb-2 font-semibold">Declining scores</h3><ul className="space-y-1 text-sm text-zinc-300">{data.alerts.decliningScores.map((c: any) => <li key={c.id}>{c.name}</li>)}</ul></div>
        <div className="card"><h3 className="mb-2 font-semibold">No recent check-ins</h3><ul className="space-y-1 text-sm text-zinc-300">{data.alerts.noRecentCheckins.map((c: any) => <li key={c.id}>{c.name}</li>)}</ul></div>
      </section>
    </main>
  );
}
