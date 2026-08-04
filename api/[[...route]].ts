import type { VercelRequest, VercelResponse } from '@vercel/node';

let usersSeed: any[] = [];
let categoriesSeed: any[] = [];
let incidentsSeed: any[] = [];
let notificationsSeed: any[] = [];
let chatMessagesSeed: any[] = [];
let badgesSeed: any[] = [];
let activityLogsSeed: any[] = [];

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
    const rawIdentifier = String(getBody(req)?.email || getBody(req)?.phone || '').trim();
    if (!rawIdentifier) return sendJson(res, 400, { message: 'Email ou téléphone requis' });

    const identifier = rawIdentifier.toLowerCase();
    const user = await prisma.user.findFirst({
      where: identifier.includes('@')
        ? { email: identifier }
        : { phone: rawIdentifier }
    });

    if (!user) return sendJson(res, 404, { message: 'Compte introuvable. Vérifiez votre email ou téléphone.' });

    return sendJson(res, 200, {
      token: 'mock_jwt_token_for_vercel',
      user: { ...user, stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 0 } },
    });
  }

  if (req.method === 'POST' && path === 'auth/register') {
    const { name, email, phone, commune } = getBody(req);
    const safeName = String(name || '').trim();
    const safeEmail = String(email || '').trim().toLowerCase();
    const safePhone = String(phone || '').trim();

    if (!safeName || !safeEmail || !safePhone) {
      return sendJson(res, 400, { message: 'Nom, email et téléphone sont requis.' });
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
      return sendJson(res, 409, { message: 'Un compte existe déjà avec ce mail ou ce numéro de téléphone.' });
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

    return sendJson(res, 201, {
      token: 'mock_jwt_token_for_vercel',
      user: { ...newUser, stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 0 } },
    });
  }

  if (req.method === 'POST' && path === 'auth/forgot-password') {
    return sendJson(res, 200, { success: true, message: 'Un lien de réinitialisation a été envoyé par SMS / Email (+221).' });
  }

  if (req.method === 'GET' && path === 'auth/me') {
    const user = await prisma.user.findFirst({ orderBy: { createdAt: 'desc' } });
    if (!user) return sendJson(res, 404, { message: 'Aucun utilisateur enregistré.' });
    return sendJson(res, 200, { ...user, stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 0 } });
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
