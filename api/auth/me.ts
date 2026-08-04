import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });

  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!user) {
    return res.status(404).json({ message: 'Aucun utilisateur enregistré.' });
  }

  return res.status(200).json({
    ...user,
    stats: {
      totalReports: 0,
      resolvedCount: 0,
      inProgressCount: 0,
      pendingCount: 0,
      badgesCount: 0,
    }
  });
}
