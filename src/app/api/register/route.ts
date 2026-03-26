import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['COACH', 'CLIENT'])
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash: await bcrypt.hash(parsed.data.password, 10)
    }
  });

  if (user.role === 'CLIENT') {
    const defaultCoach = await prisma.user.findFirst({ where: { role: 'COACH' } });
    if (defaultCoach) {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
          coachId: defaultCoach.id,
          currentFocus: 'Build baseline consistency.',
          topPriorities: 'Daily movement | Sleep routine | Weekly planning',
          nextRecommended: 'Submit your first check-in after workout #1.',
          goals: 'Establish 4 consistent training days per week.'
        }
      });
    }
  }

  return NextResponse.json({ ok: true });
}
