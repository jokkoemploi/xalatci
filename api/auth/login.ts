import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizeEmail(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function normalizePhone(value: unknown) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const digits = raw.replace(/[^+\d]/g, '');
  if (digits.startsWith('00221')) return `+${digits.slice(2)}`;
  if (digits.startsWith('221') && !digits.startsWith('+')) return `+${digits}`;
  return digits;
}

function buildAuthToken(userId: string) {
  return `xalat_ci_token:${userId}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });

  const rawIdentifier = String(req.body?.email || req.body?.phone || '').trim();
  if (!rawIdentifier) {
    return res.status(400).json({ message: 'Email ou téléphone requis' });
  }

  const isEmail = rawIdentifier.includes('@');
  const email = normalizeEmail(rawIdentifier);
  const phone = normalizePhone(rawIdentifier);
  const user = await prisma.user.findFirst({
    where: isEmail ? { email } : { phone }
  });

  if (!user) {
    return res.status(404).json({ message: 'Compte introuvable. Vérifiez votre email ou téléphone.' });
  }

  return res.status(200).json({
    token: buildAuthToken(user.id),
    user: {
      ...user,
      stats: {
        totalReports: 0,
        resolvedCount: 0,
        inProgressCount: 0,
        pendingCount: 0,
        badgesCount: 0,
      }
    }
  });
}
