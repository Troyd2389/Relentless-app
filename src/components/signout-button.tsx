'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })} className="rounded-md border border-border px-3 py-1 text-xs uppercase tracking-wide text-zinc-300">
      Sign out
    </button>
  );
}
