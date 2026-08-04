import type { VercelRequest, VercelResponse } from '@vercel/node';

let usersSeed = [
  {
    id: 'usr-1',
    name: 'Ousmane Diallo',
    email: 'ousmane.diallo@xalat.sn',
    phone: '+221 77 123 45 67',
    role: 'citoyen',
    status: 'actif',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    commune: 'Dakar Plateau, Dakar',
    badgeTitle: 'Citoyen Ambassadeur',
    stats: {
      totalReports: 12,
      resolvedCount: 8,
      inProgressCount: 3,
      pendingCount: 1,
      badgesCount: 4,
    },
  },
  {
    id: 'usr-2',
    name: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@xalat.sn',
    phone: '+221 78 987 65 43',
    role: 'admin',
    status: 'actif',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    commune: 'Médina, Dakar',
    badgeTitle: 'Administrateur Voirie',
    stats: {
      totalReports: 45,
      resolvedCount: 38,
      inProgressCount: 7,
      pendingCount: 0,
      badgesCount: 6,
    },
  },
  {
    id: 'usr-3',
    name: 'Mamadou Sow',
    email: 'admin@xalat.sn',
    phone: '+221 70 111 22 33',
    role: 'admin',
    status: 'actif',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    commune: 'Almadies, Dakar',
    badgeTitle: 'Super Administrateur',
    stats: {
      totalReports: 120,
      resolvedCount: 110,
      inProgressCount: 8,
      pendingCount: 2,
      badgesCount: 10,
    },
  },
];

let categoriesSeed = [
  { id: 'cat-1', name: 'Routes & Voirie', icon: 'Route', color: '#0D47A1', count: 42, description: 'Nids de poule, dalles endommagées, chaussée dégradée' },
  { id: 'cat-2', name: 'Éclairage public', icon: 'Lightbulb', color: '#F59E0B', count: 28, description: 'Poteaux défectueux, lampadaires éteints, câbles pendants' },
  { id: 'cat-3', name: 'Déchets & Propreté', icon: 'Trash2', color: '#10B981', count: 35, description: 'Dépôts sauvages, poubelles débordantes, encombrants' },
  { id: 'cat-4', name: 'Eau & Assainissement', icon: 'Droplets', color: '#0284C7', count: 21, description: 'Fuites d\'eau potable, canalisations bouchées, inondations' },
  { id: 'cat-5', name: 'Santé & Hygiène', icon: 'HeartPulse', color: '#EF4444', count: 14, description: 'Eaux stagnantes, nuisibles, insalubrité publique' },
  { id: 'cat-6', name: 'Sécurité & Incivilités', icon: 'ShieldAlert', color: '#8B5CF6', count: 19, description: 'Plaques de regard volées, zones à risque, dégradations' },
];

let incidentsSeed = [
  {
    id: 'inc-1',
    reference: 'SN-DK-2026-001',
    title: 'Nid-de-poule important sur l\'Avenue Lamine Guèye',
    description: 'Grand trou sur la chaussée causant des perturbations majeures du trafic entre Plateau et Médina.',
    category: 'Routes & Voirie',
    urgency: 'Critique',
    status: 'En cours',
    location: {
      address: 'Avenue Lamine Guèye, Dakar Plateau, Dakar',
      lat: 14.671,
      lng: -17.438,
      commune: 'Dakar Plateau',
    },
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600',
    reporterId: 'usr-1',
    reporterName: 'Ousmane Diallo',
    reporterPhone: '+221 77 123 45 67',
    createdAt: '12/05/2026 à 14:20',
    updatedAt: '12/05/2026 à 16:10',
    upvotesCount: 24,
    timeline: [
      { id: 't1', title: 'Signalement envoyé', description: 'Enregistré avec succès par le citoyen', date: '12/05/2026 à 14:20', status: 'completed' },
      { id: 't2', title: 'Pris en charge', description: 'Assigné à l\'équipe technique de la mairie de Dakar', date: '12/05/2026 à 15:10', status: 'completed', author: 'Fatou Ndiaye' },
      { id: 't3', title: 'En cours de traitement', description: 'Intervention sur le terrain programmée', date: '12/05/2026 à 16:10', status: 'current' },
    ],
    comments: [
      { id: 'c1', authorName: 'Fatou Ndiaye', authorRole: 'agent', text: 'Bonjour Ousmane, l\'équipe voirie de Dakar a bien reçu le signalement.', createdAt: '12/05/2026 à 15:15' },
      { id: 'c2', authorName: 'Ousmane Diallo', authorRole: 'citoyen', text: 'Merci pour la réactivité !', createdAt: '12/05/2026 à 15:30' },
    ],
  },
  {
    id: 'inc-2',
    reference: 'SN-DK-2026-002',
    title: 'Éclairage public défectueux aux Almadies',
    description: 'Plusieurs lampadaires éteints le long de la corniche des Almadies.',
    category: 'Éclairage public',
    urgency: 'Moyenne',
    status: 'En attente',
    location: {
      address: 'Route des Almadies, Dakar',
      lat: 14.745,
      lng: -17.518,
      commune: 'Almadies',
    },
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=600',
    reporterId: 'usr-1',
    reporterName: 'Ousmane Diallo',
    createdAt: '11/05/2026 à 19:45',
    updatedAt: '12/05/2026 à 09:15',
    upvotesCount: 15,
    timeline: [
      { id: 't1', title: 'Signalement envoyé', description: 'Enregistré avec succès par le citoyen', date: '11/05/2026 à 19:45', status: 'completed' },
      { id: 't2', title: 'Pris en charge', description: 'Vérification du réseau Senelec local', date: '12/05/2026 à 09:15', status: 'current' },
    ],
    comments: [],
  },
];

let notificationsSeed = [
  { id: 'notif-1', title: 'Prise en charge', message: 'Votre signalement a été pris en charge par l\'équipe voirie.', date: 'Il y a 10 min', read: false, type: 'incident_update', incidentId: 'inc-1' },
  { id: 'notif-2', title: 'Nouveau badge obtenu !', message: 'Félicitations ! Vous avez débloqué le badge Signaleur Actif.', date: 'Il y a 1j', read: true, type: 'badge_earned' },
];

let chatMessagesSeed = [
  { id: 'msg-1', sender: 'agent', text: 'Bonjour ! Je suis l\'agent support XALAT-CI. Comment puis-je vous aider aujourd\'hui ?', timestamp: '10:14', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
  { id: 'msg-2', sender: 'user', text: 'J\'ai une question concernant mon signalement.', timestamp: '10:15' },
];

let badgesSeed = [
  { id: 'bdg-1', name: 'Citoyen Engagé', description: 'A envoyé son 1er signalement validé sur XALAT-CI', icon: 'ShieldCheck', unlocked: true, dateUnlocked: '10/01/2026', progressPercent: 100 },
  { id: 'bdg-2', name: 'Signaleur Actif', description: 'A réalisé au moins 5 signalements dans sa commune', icon: 'Flame', unlocked: true, dateUnlocked: '15/03/2026', progressPercent: 100 },
  { id: 'bdg-3', name: 'Contributeur Top', description: 'A contribué à résoudre 5 incidents majeurs de voirie', icon: 'Award', unlocked: false, progressPercent: 70 },
];

let activityLogsSeed = [
  { id: 'log-1', title: 'Signalement envoyé', description: 'Nid-de-poule sur la route à Dakar Plateau', date: '12/05/2026 à 14:20', type: 'signalement', icon: 'Send' },
  { id: 'log-2', title: 'Badge obtenu', description: 'Signaleur actif débloqué', date: '10/05/2026 à 10:30', type: 'badge', icon: 'Award' },
];

function getPath(req: VercelRequest) {
  const raw = (req.url ?? '/').split('?')[0].replace(/^\/api/, '').replace(/^\/+/, '');
  return raw;
}

function getBody(req: VercelRequest) {
  return req.body ?? {};
}

function sendJson(res: VercelResponse, status: number, data: unknown) {
  res.status(status).json(data);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = getPath(req);

  if (req.method === 'GET' && path === 'health') {
    return sendJson(res, 200, { ok: true, service: 'xalat-ci-api', timestamp: new Date().toISOString() });
  }

  if (req.method === 'POST' && path === 'auth/login') {
    const { email } = getBody(req);
    if (!email) return sendJson(res, 400, { message: 'Email requis' });

    const user = usersSeed.find((u) => u.email === email) ?? usersSeed[0];
    return sendJson(res, 200, { token: 'mock_jwt_token_for_vercel', user });
  }

  if (req.method === 'POST' && path === 'auth/register') {
    const { name, email, phone, commune } = getBody(req);
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name || 'Nouveau Citoyen',
      email: email || 'citoyen@xalat.sn',
      phone: phone || '+221 77 000 00 00',
      role: 'citoyen',
      status: 'actif',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      commune: commune || 'Dakar Plateau, Dakar',
      badgeTitle: 'Citoyen Nouveau',
      stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 1 },
    };
    usersSeed.unshift(newUser);
    return sendJson(res, 201, { token: 'mock_jwt_token_for_vercel', user: newUser });
  }

  if (req.method === 'POST' && path === 'auth/forgot-password') {
    return sendJson(res, 200, { success: true, message: 'Un lien de réinitialisation a été envoyé par SMS / Email (+221).' });
  }

  if (req.method === 'GET' && path === 'auth/me') {
    return sendJson(res, 200, usersSeed[0]);
  }

  if (req.method === 'GET' && path === 'incidents') {
    const url = new URL(req.url ?? 'http://localhost', 'http://localhost');
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');
    const urgency = url.searchParams.get('urgency');
    const search = url.searchParams.get('search');

    let result = [...incidentsSeed];
    if (category && category !== 'Toutes' && category !== 'Tous') result = result.filter((i) => i.category === category);
    if (status && status !== 'Tous') result = result.filter((i) => i.status === status);
    if (urgency && urgency !== 'Toutes') result = result.filter((i) => i.urgency === urgency);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.location.address.toLowerCase().includes(q));
    }
    return sendJson(res, 200, result);
  }

  if (req.method === 'GET' && path.startsWith('incidents/')) {
    const id = path.split('/').slice(1).join('/');
    const incident = incidentsSeed.find((i) => i.id === id);
    if (!incident) return sendJson(res, 404, { message: 'Incident non trouvé' });
    return sendJson(res, 200, incident);
  }

  if (req.method === 'POST' && path === 'incidents') {
    const body = getBody(req);
    const refNum = String(incidentsSeed.length + 1).padStart(3, '0');
    const incident = {
      id: `inc-${Date.now()}`,
      reference: `SN-DK-2026-${refNum}`,
      title: String(body.title || 'Signalement Citoyen'),
      description: String(body.description || 'Aucune description fournie.'),
      category: String(body.category || 'Routes & Voirie'),
      urgency: String(body.urgency || 'Moyenne'),
      status: 'En attente',
      location: {
        address: String(body.location?.address || 'Commune de Dakar'),
        lat: Number(body.location?.lat ?? 14.6937),
        lng: Number(body.location?.lng ?? -17.4441),
        commune: String(body.location?.commune || 'Dakar'),
      },
      photoUrl: String(body.photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600'),
      reporterId: 'usr-1',
      reporterName: 'Ousmane Diallo',
      reporterPhone: '+221 77 123 45 67',
      createdAt: new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      updatedAt: new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      upvotesCount: 1,
      timeline: [{
        id: `t-${Date.now()}`,
        title: 'Signalement envoyé',
        description: 'Votre signalement est transmis aux services municipaux au Sénégal.',
        date: new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'current',
      }],
      comments: [],
      agentAssigned: undefined,
    };

    incidentsSeed.unshift(incident as never);
    notificationsSeed.unshift({
      id: `notif-${Date.now()}`,
      title: 'Nouveau signalement enregistré',
      message: `Votre signalement '${incident.title}' est en attente de validation.`,
      date: 'À l\'instant',
      read: false,
      type: 'incident_update',
      incidentId: incident.id,
    });
    usersSeed[0].stats.totalReports += 1;
    usersSeed[0].stats.pendingCount += 1;
    return sendJson(res, 201, incident);
  }

  if (req.method === 'PATCH' && path.startsWith('incidents/') && path.endsWith('/status')) {
    const id = path.split('/')[1];
    const { status, note, agentName } = getBody(req);
    const incident = incidentsSeed.find((i) => i.id === id);
    if (!incident) return sendJson(res, 404, { message: 'Incident introuvable' });

    incident.status = status;
    incident.updatedAt = new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    incident.timeline.push({
      id: `t-${Date.now()}`,
      title: `Passé en '${status}'`,
      description: note || `Changement de statut effectué par l'agent ${agentName || 'Municipal'}`,
      date: incident.updatedAt,
      status: status === 'Résolu' ? 'completed' : 'current',
      author: agentName || 'Agent Voirie',
    });
    notificationsSeed.unshift({
      id: `notif-${Date.now()}`,
      title: `Incident ${status}`,
      message: `Votre signalement '${incident.title}' est désormais : ${status}.`,
      date: 'À l\'instant',
      read: false,
      type: 'incident_update',
      incidentId: incident.id,
    });
    return sendJson(res, 200, incident);
  }

  if (req.method === 'POST' && path.startsWith('incidents/') && path.includes('/comments')) {
    const id = path.split('/')[1];
    const { text, authorName, authorRole } = getBody(req);
    const incident = incidentsSeed.find((i) => i.id === id);
    if (!incident) return sendJson(res, 404, { message: 'Incident non trouvé' });
    const comment = {
      id: `c-${Date.now()}`,
      authorName: authorName || 'Ousmane Diallo',
      authorRole: authorRole || 'citoyen',
      text: text || '',
      createdAt: 'À l\'instant',
    };
    incident.comments.push(comment as never);
    return sendJson(res, 201, comment);
  }

  if (req.method === 'GET' && path === 'categories') return sendJson(res, 200, categoriesSeed);
  if (req.method === 'GET' && path === 'notifications') return sendJson(res, 200, notificationsSeed);
  if (req.method === 'PATCH' && path === 'notifications/mark-read') {
    notificationsSeed = notificationsSeed.map((n) => ({ ...n, read: true }));
    return sendJson(res, 200, { success: true });
  }

  if (req.method === 'GET' && path === 'chat/messages') return sendJson(res, 200, chatMessagesSeed);
  if (req.method === 'POST' && path === 'chat/messages') {
    const { text } = getBody(req);
    const userMsg = { id: `msg-${Date.now()}`, sender: 'user', text, timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
    chatMessagesSeed.push(userMsg);
    setTimeout(() => {
      chatMessagesSeed.push({
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: 'Un agent municipal XALAT-CI a bien pris connaissance de votre message et vous recontactera très vite.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
      });
    }, 1000);
    return sendJson(res, 201, userMsg);
  }

  if (req.method === 'GET' && path === 'badges') return sendJson(res, 200, badgesSeed);
  if (req.method === 'GET' && path === 'profile') return sendJson(res, 200, usersSeed[0]);
  if (req.method === 'PUT' && path === 'profile') {
    const body = getBody(req);
    usersSeed[0] = { ...usersSeed[0], ...body };
    return sendJson(res, 200, usersSeed[0]);
  }
  if (req.method === 'GET' && path === 'history') return sendJson(res, 200, activityLogsSeed);

  if (req.method === 'GET' && path === 'admin/stats') {
    return sendJson(res, 200, {
      totalIncidents: incidentsSeed.length,
      pendingIncidents: incidentsSeed.filter((i) => i.status === 'En attente').length,
      inProgressIncidents: incidentsSeed.filter((i) => i.status === 'En cours').length,
      resolvedIncidents: incidentsSeed.filter((i) => i.status === 'Résolu').length,
      avgResolutionTimeHours: 4.8,
      incidentsByCategory: [
        { name: 'Routes & Voirie', count: 42, color: '#0D47A1' },
        { name: 'Éclairage public', count: 28, color: '#F59E0B' },
        { name: 'Déchets & Propreté', count: 35, color: '#10B981' },
        { name: 'Eau & Assainissement', count: 21, color: '#0284C7' },
        { name: 'Sécurité', count: 19, color: '#8B5CF6' },
      ],
      incidentsByCommune: [
        { commune: 'Dakar Plateau', count: 48 },
        { commune: 'Médina', count: 32 },
        { commune: 'Grand Dakar', count: 29 },
      ],
      monthlyTrend: [
        { month: 'Jan', signalements: 65, resolus: 58 },
        { month: 'Fév', signalements: 82, resolus: 75 },
      ],
      agentPerformance: [
        { id: 'usr-2', name: 'Fatou Ndiaye', resolved: 38, rating: 4.9, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
      ],
    });
  }

  if (req.method === 'GET' && path === 'admin/users') return sendJson(res, 200, usersSeed);

  if (req.method === 'POST' && path === 'admin/users') {
    const { name, email, phone, role, commune } = getBody(req);
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name || 'Nouveau Citoyen',
      email: email || `user-${Date.now()}@xalat.sn`,
      phone: phone || '+221 77 000 00 00',
      role: role || 'citoyen',
      status: 'actif',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      commune: commune || 'Dakar Plateau, Dakar',
      badgeTitle: role === 'admin' ? 'Administrateur Mairie' : 'Citoyen Actif',
      stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 1 },
    };
    usersSeed.unshift(newUser);
    return sendJson(res, 201, newUser);
  }

  if (req.method === 'PUT' && path.startsWith('admin/users/')) {
    const id = path.split('/')[2];
    const userIndex = usersSeed.findIndex((u) => u.id === id);
    if (userIndex === -1) return sendJson(res, 404, { message: 'Utilisateur non trouvé' });
    usersSeed[userIndex] = { ...usersSeed[userIndex], ...getBody(req) };
    return sendJson(res, 200, usersSeed[userIndex]);
  }

  if (req.method === 'PATCH' && path.startsWith('admin/users/') && path.includes('/status')) {
    const id = path.split('/')[2];
    const { status } = getBody(req);
    const user = usersSeed.find((u) => u.id === id);
    if (!user) return sendJson(res, 404, { message: 'Utilisateur non trouvé' });
    user.status = status;
    return sendJson(res, 200, user);
  }

  if (req.method === 'DELETE' && path.startsWith('admin/users/')) {
    const id = path.split('/')[2];
    usersSeed = usersSeed.filter((u) => u.id !== id);
    return sendJson(res, 200, { success: true, message: 'Utilisateur supprimé' });
  }

  return sendJson(res, 404, { message: 'Route API introuvable', route: path });
}
