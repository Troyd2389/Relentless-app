'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
      })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Failed to register.');
      setLoading(false);
      return;
    }

    router.push('/auth/login?registered=1');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <div className="card w-full space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" required placeholder="Full name" className="w-full rounded-md border border-border bg-bg px-3 py-2" />
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-md border border-border bg-bg px-3 py-2" />
          <input name="password" type="password" minLength={8} required placeholder="Password" className="w-full rounded-md border border-border bg-bg px-3 py-2" />
          <select name="role" className="w-full rounded-md border border-border bg-bg px-3 py-2">
            <option value="CLIENT">Client</option>
            <option value="COACH">Coach</option>
          </select>
          <button disabled={loading} className="w-full rounded-md bg-white py-2 text-sm font-semibold text-black">
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="text-sm text-zinc-400">
          Already have an account? <Link href="/auth/login" className="text-white underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
