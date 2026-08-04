import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });

  const rawIdentifier = String(req.body?.email || req.body?.phone || '').trim();
  if (!rawIdentifier) {
    return res.status(400).json({ message: 'Email ou téléphone requis' });
  }

  const identifier = rawIdentifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: identifier.includes('@')
      ? { email: identifier }
      : { phone: rawIdentifier }
  });

  if (!user) {
    return res.status(404).json({ message: 'Compte introuvable. Vérifiez votre email ou téléphone.' });
  }

  return res.status(200).json({
    token: 'mock_jwt_token_for_vercel',
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
