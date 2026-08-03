import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });

  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ message: 'Email requis' });
  }

  return res.status(200).json({
    token: 'mock_jwt_token_for_vercel',
    user: {
      id: 'demo-user-1',
      name: 'Utilisateur XALAT',
      email,
      role: 'citoyen',
      status: 'actif',
      commune: 'Dakar Plateau, Dakar',
      avatar: '',
      badgeTitle: 'Citoyen Actif',
      stats: {
        totalReports: 0,
        resolvedCount: 0,
        inProgressCount: 0,
        pendingCount: 0,
        badgesCount: 1,
      }
    }
  });
}
