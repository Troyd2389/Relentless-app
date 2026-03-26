'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    const res = await signIn('credentials', { email, password, redirect: false });

    if (res?.error) {
      setError('Invalid credentials.');
      setLoading(false);
      return;
    }

    const roleRes = await fetch('/api/me');
    const roleData = await roleRes.json();
    router.push(roleData.role === 'COACH' ? '/coach-dashboard' : '/client-dashboard');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="card w-full space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        {params.get('registered') ? <p className="text-sm text-emerald-400">Account created. Please sign in.</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-md border border-border bg-bg px-3 py-2" />
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Password"
            className="w-full rounded-md border border-border bg-bg px-3 py-2"
          />
          <button disabled={loading} className="w-full rounded-md bg-white py-2 text-sm font-semibold text-black">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-zinc-400">
          No account? <Link href="/auth/register" className="text-white underline">Create one</Link>
        </p>
      </div>
    </main>
  );
}
