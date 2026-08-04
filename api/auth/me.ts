import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getUserIdFromToken(token: string | undefined) {
  if (!token) return null;
  const trimmed = String(token).trim();
  if (!trimmed.startsWith('xalat_ci_token:')) return null;
  return trimmed.replace('xalat_ci_token:', '').trim() || null;
}

function getTokenFromRequest(req: VercelRequest) {
  const authHeader = String(req.headers.authorization || '');
  if (!authHeader) return null;
  return authHeader.replace(/^Bearer\s+/i, '').trim() || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });

  const token = getTokenFromRequest(req);
  const userId = getUserIdFromToken(token || undefined);

  if (!userId) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable.' });
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
