import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Méthode non autorisée' });

  return res.status(200).json({ success: true, message: 'Un lien de réinitialisation a été envoyé par SMS / Email (+221).' });
}
