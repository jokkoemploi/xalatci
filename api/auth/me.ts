import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Méthode non autorisée' });

  return res.status(200).json({
    id: 'demo-user-1',
    name: 'Utilisateur XALAT',
    email: 'demo@xalat.sn',
    role: 'admin',
    status: 'actif',
    commune: 'Dakar Plateau, Dakar',
    avatar: '',
    badgeTitle: 'Administrateur Mairie',
    stats: {
      totalReports: 12,
      resolvedCount: 8,
      inProgressCount: 3,
      pendingCount: 1,
      badgesCount: 4,
    }
  });
}
