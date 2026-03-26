import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  workoutCompleted: z.boolean(),
  energy: z.number().int().min(1).max(10),
  soreness: z.number().int().min(1).max(10),
  notes: z.string().max(300).optional()
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.clientProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  await prisma.workoutCheckIn.create({
    data: {
      clientProfileId: profile.id,
      workoutCompleted: parsed.data.workoutCompleted,
      energy: parsed.data.energy,
      soreness: parsed.data.soreness,
      notes: parsed.data.notes
    }
  });

  return NextResponse.json({ ok: true });
}
