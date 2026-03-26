import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === 'COACH') redirect('/coach-dashboard');
  if (session?.user?.role === 'CLIENT') redirect('/client-dashboard');

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-400">Relentless</p>
      <h1 className="text-4xl font-bold">Coaching Operating System</h1>
      <p className="mt-4 max-w-2xl text-zinc-400">
        A premium platform for score tracking, behavior change, and coach-led accountability.
      </p>
      <div className="mt-8 flex gap-3">
        <Link className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-black" href="/auth/login">
          Sign in
        </Link>
        <Link className="rounded-lg border border-zinc-700 px-5 py-2 text-sm font-medium" href="/auth/register">
          Register
        </Link>
      </div>
    </main>
  );
}
