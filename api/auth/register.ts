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

  const { name, email, phone, commune } = req.body ?? {};
  const safeName = String(name || '').trim();
  const safeEmail = normalizeEmail(email);
  const safePhone = normalizePhone(phone);

  if (!safeName || !safeEmail || !safePhone) {
    return res.status(400).json({ message: 'Nom, email et téléphone sont requis.' });
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email: safeEmail },
        { phone: safePhone }
      ]
    }
  });

  if (existing) {
    return res.status(409).json({ message: 'Un compte existe déjà avec ce mail ou ce numéro de téléphone.' });
  }

  const newUser = await prisma.user.create({
    data: {
      name: safeName,
      email: safeEmail,
      phone: safePhone,
      role: 'citoyen',
      status: 'actif',
      avatar: '',
      commune: String(commune || 'Dakar Plateau, Dakar').trim(),
      badgeTitle: 'Citoyen Nouveau',
    }
  });

  return res.status(201).json({
    token: buildAuthToken(newUser.id),
    user: {
      ...newUser,
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
