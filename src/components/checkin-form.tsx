'use client';

import { FormEvent, useState } from 'react';

export function CheckInForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    const res = await fetch('/api/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workoutCompleted: formData.get('workoutCompleted') === 'yes',
        energy: Number(formData.get('energy')),
        soreness: Number(formData.get('soreness')),
        notes: formData.get('notes')
      })
    });

    setLoading(false);
    if (!res.ok) {
      setMessage('Unable to submit.');
      return;
    }

    (e.target as HTMLFormElement).reset();
    setMessage('Check-in saved.');
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <select name="workoutCompleted" className="w-full rounded-md border border-border bg-bg px-3 py-2">
        <option value="yes">Workout completed</option>
        <option value="no">Workout not completed</option>
      </select>
      <div className="grid grid-cols-2 gap-3">
        <input name="energy" type="number" min={1} max={10} required placeholder="Energy 1-10" className="rounded-md border border-border bg-bg px-3 py-2" />
        <input name="soreness" type="number" min={1} max={10} required placeholder="Soreness 1-10" className="rounded-md border border-border bg-bg px-3 py-2" />
      </div>
      <textarea name="notes" placeholder="Notes" className="w-full rounded-md border border-border bg-bg px-3 py-2" />
      <button disabled={loading} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">
        {loading ? 'Saving...' : 'Submit check-in'}
      </button>
      {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
    </form>
  );
}
