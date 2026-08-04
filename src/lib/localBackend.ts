type UserRole = 'citoyen' | 'agent' | 'admin';

type MockSnapshot = {
  users: any[];
  categories: any[];
  incidents: any[];
  notifications: any[];
  chatMessages: any[];
  badges: any[];
  activityLogs: any[];
};

const initialSnapshot: MockSnapshot = {
  users: [
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
  ],
  categories: [
    { id: 'cat-1', name: 'Routes & Voirie', icon: 'Route', color: '#0D47A1', count: 42, description: 'Nids de poule, dalles endommagées, chaussée dégradée' },
    { id: 'cat-2', name: 'Éclairage public', icon: 'Lightbulb', color: '#F59E0B', count: 28, description: 'Poteaux défectueux, lampadaires éteints, câbles pendants' },
    { id: 'cat-3', name: 'Déchets & Propreté', icon: 'Trash2', color: '#10B981', count: 35, description: 'Dépôts sauvages, poubelles débordantes, encombrants' },
    { id: 'cat-4', name: 'Eau & Assainissement', icon: 'Droplets', color: '#0284C7', count: 21, description: 'Fuites d\'eau potable, canalisations bouchées, inondations' },
    { id: 'cat-5', name: 'Santé & Hygiène', icon: 'HeartPulse', color: '#EF4444', count: 14, description: 'Eaux stagnantes, nuisibles, insalubrité publique' },
    { id: 'cat-6', name: 'Sécurité & Incivilités', icon: 'ShieldAlert', color: '#8B5CF6', count: 19, description: 'Plaques de regard volées, zones à risque, dégradations' },
  ],
  incidents: [
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
  ],
  notifications: [
    { id: 'notif-1', title: 'Prise en charge', message: 'Votre signalement a été pris en charge par l\'équipe voirie.', date: 'Il y a 10 min', read: false, type: 'incident_update', incidentId: 'inc-1' },
    { id: 'notif-2', title: 'Nouveau badge obtenu !', message: 'Félicitations ! Vous avez débloqué le badge Signaleur Actif.', date: 'Il y a 1j', read: true, type: 'badge_earned' },
  ],
  chatMessages: [
    { id: 'msg-1', sender: 'agent', text: 'Bonjour ! Je suis l\'agent support XALAT-CI. Comment puis-je vous aider aujourd\'hui ?', timestamp: '10:14', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100' },
    { id: 'msg-2', sender: 'user', text: 'J\'ai une question concernant mon signalement.', timestamp: '10:15' },
  ],
  badges: [
    { id: 'bdg-1', name: 'Citoyen Engagé', description: 'A envoyé son 1er signalement validé sur XALAT-CI', icon: 'ShieldCheck', unlocked: true, dateUnlocked: '10/01/2026', progressPercent: 100 },
    { id: 'bdg-2', name: 'Signaleur Actif', description: 'A réalisé au moins 5 signalements dans sa commune', icon: 'Flame', unlocked: true, dateUnlocked: '15/03/2026', progressPercent: 100 },
    { id: 'bdg-3', name: 'Contributeur Top', description: 'A contribué à résoudre 5 incidents majeurs de voirie', icon: 'Award', unlocked: false, progressPercent: 70 },
  ],
  activityLogs: [
    { id: 'log-1', title: 'Signalement envoyé', description: 'Nid-de-poule sur la route à Dakar Plateau', date: '12/05/2026 à 14:20', type: 'signalement', icon: 'Send' },
    { id: 'log-2', title: 'Badge obtenu', description: 'Signaleur actif débloqué', date: '10/05/2026 à 10:30', type: 'badge', icon: 'Award' },
  ],
};

let mockStore = JSON.parse(JSON.stringify(initialSnapshot)) as MockSnapshot;

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const formatTimestamp = (date: Date) => `${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;

function getJsonBody(data?: string | Record<string, unknown>) {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data;
}

function normalizePath(rawUrl: string) {
  return (rawUrl || '/').split('?')[0].replace(/^\/api/, '').replace(/^\/+/, '');
}

function applyIncidentFilters(list: any[], params?: Record<string, any>) {
  let result = [...list];
  const category = params?.category;
  const status = params?.status;
  const urgency = params?.urgency;
  const search = params?.search;

  if (category && category !== 'Toutes' && category !== 'Tous') {
    result = result.filter((item) => item.category === category);
  }
  if (status && status !== 'Tous') {
    result = result.filter((item) => item.status === status);
  }
  if (urgency && urgency !== 'Toutes') {
    result = result.filter((item) => item.urgency === urgency);
  }
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.location?.address || '').toLowerCase().includes(q)
    );
  }

  return result;
}

export async function handleLocalBackendRequest(config: any) {
  const method = String(config.method || 'get').toLowerCase();
  const path = normalizePath(config.url || '/');
  const params = config.params || {};
  const body = getJsonBody(config.data);

  if (method === 'get' && path === 'health') {
    return { status: 200, data: { ok: true, service: 'xalat-ci-local', timestamp: new Date().toISOString() } };
  }

  if (method === 'post' && path === 'auth/login') {
    const email = String(body.email || '');
    const user = mockStore.users.find((entry) => entry.email === email) || mockStore.users[0];
    return {
      status: 200,
      data: { token: 'local_mock_jwt_token', user: deepClone(user) },
    };
  }

  if (method === 'post' && path === 'auth/register') {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: body.name || 'Nouveau Citoyen',
      email: body.email || `citoyen-${Date.now()}@xalat.sn`,
      phone: body.phone || '+221 77 000 00 00',
      role: 'citoyen',
      status: 'actif',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      commune: body.commune || 'Dakar Plateau, Dakar',
      badgeTitle: 'Citoyen Nouveau',
      stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 1 },
    };
    mockStore.users.unshift(newUser);
    return { status: 201, data: { token: 'local_mock_jwt_token', user: deepClone(newUser) } };
  }

  if (method === 'post' && path === 'auth/forgot-password') {
    return { status: 200, data: { success: true, message: 'Un lien de réinitialisation a été envoyé par SMS / Email (+221).' } };
  }

  if (method === 'get' && path === 'auth/me') {
    return { status: 200, data: deepClone(mockStore.users[0]) };
  }

  if (method === 'get' && path === 'incidents') {
    return { status: 200, data: applyIncidentFilters(mockStore.incidents, params) };
  }

  if (method === 'get' && path.startsWith('incidents/')) {
    const id = path.split('/')[1];
    const found = mockStore.incidents.find((item) => item.id === id);
    if (!found) return { status: 404, data: { message: 'Incident non trouvé' } };
    return { status: 200, data: deepClone(found) };
  }

  if (method === 'post' && path === 'incidents') {
    const refNum = String(mockStore.incidents.length + 1).padStart(3, '0');
    const now = new Date();
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
      createdAt: formatTimestamp(now),
      updatedAt: formatTimestamp(now),
      upvotesCount: 1,
      timeline: [{
        id: `t-${Date.now()}`,
        title: 'Signalement envoyé',
        description: 'Votre signalement est transmis aux services municipaux au Sénégal.',
        date: formatTimestamp(now),
        status: 'current',
      }],
      comments: [],
      agentAssigned: undefined,
    };

    mockStore.incidents.unshift(incident);
    mockStore.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Nouveau signalement enregistré',
      message: `Votre signalement '${incident.title}' est en attente de validation.`,
      date: 'À l\'instant',
      read: false,
      type: 'incident_update',
      incidentId: incident.id,
    });
    mockStore.users[0].stats.totalReports += 1;
    mockStore.users[0].stats.pendingCount += 1;

    return { status: 201, data: deepClone(incident) };
  }

  if (method === 'patch' && path.startsWith('incidents/') && path.endsWith('/status')) {
    const id = path.split('/')[1];
    const incident = mockStore.incidents.find((item) => item.id === id);
    if (!incident) return { status: 404, data: { message: 'Incident introuvable' } };
    const nextStatus = body.status || incident.status;
    incident.status = nextStatus;
    incident.updatedAt = formatTimestamp(new Date());
    incident.timeline.push({
      id: `t-${Date.now()}`,
      title: `Passé en '${nextStatus}'`,
      description: body.note || `Changement de statut effectué par l'agent ${body.agentName || 'Municipal'}`,
      date: incident.updatedAt,
      status: nextStatus === 'Résolu' ? 'completed' : 'current',
      author: body.agentName || 'Agent Voirie',
    });
    mockStore.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Incident ${nextStatus}`,
      message: `Votre signalement '${incident.title}' est désormais : ${nextStatus}.`,
      date: 'À l\'instant',
      read: false,
      type: 'incident_update',
      incidentId: incident.id,
    });
    return { status: 200, data: deepClone(incident) };
  }

  if (method === 'post' && path.startsWith('incidents/') && path.includes('/comments')) {
    const id = path.split('/')[1];
    const incident = mockStore.incidents.find((item) => item.id === id);
    if (!incident) return { status: 404, data: { message: 'Incident non trouvé' } };
    const comment = {
      id: `c-${Date.now()}`,
      authorName: body.authorName || 'Ousmane Diallo',
      authorRole: body.authorRole || 'citoyen',
      text: body.text || '',
      createdAt: 'À l\'instant',
    };
    incident.comments.push(comment);
    return { status: 201, data: deepClone(comment) };
  }

  if (method === 'get' && path === 'categories') return { status: 200, data: deepClone(mockStore.categories) };

  if (method === 'get' && path === 'notifications') return { status: 200, data: deepClone(mockStore.notifications) };

  if (method === 'patch' && path === 'notifications/mark-read') {
    mockStore.notifications = mockStore.notifications.map((item) => ({ ...item, read: true }));
    return { status: 200, data: { success: true } };
  }

  if (method === 'get' && path === 'chat/messages') return { status: 200, data: deepClone(mockStore.chatMessages) };

  if (method === 'post' && path === 'chat/messages') {
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: body.text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    mockStore.chatMessages.push(userMsg);
    setTimeout(() => {
      mockStore.chatMessages.push({
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        text: 'Un agent municipal XALAT-CI a bien pris connaissance de votre message et vous recontactera très vite.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
      });
    }, 1000);
    return { status: 201, data: deepClone(userMsg) };
  }

  if (method === 'get' && path === 'badges') return { status: 200, data: deepClone(mockStore.badges) };
  if (method === 'get' && path === 'profile') return { status: 200, data: deepClone(mockStore.users[0]) };

  if (method === 'put' && path === 'profile') {
    mockStore.users[0] = { ...mockStore.users[0], ...body };
    return { status: 200, data: deepClone(mockStore.users[0]) };
  }

  if (method === 'get' && path === 'history') return { status: 200, data: deepClone(mockStore.activityLogs) };

  if (method === 'get' && path === 'admin/stats') {
    return {
      status: 200,
      data: {
        totalIncidents: mockStore.incidents.length,
        pendingIncidents: mockStore.incidents.filter((item) => item.status === 'En attente').length,
        inProgressIncidents: mockStore.incidents.filter((item) => item.status === 'En cours').length,
        resolvedIncidents: mockStore.incidents.filter((item) => item.status === 'Résolu').length,
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
      },
    };
  }

  if (method === 'get' && path === 'admin/users') return { status: 200, data: deepClone(mockStore.users) };

  if (method === 'post' && path === 'admin/users') {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: body.name || 'Nouveau Citoyen',
      email: body.email || `user-${Date.now()}@xalat.sn`,
      phone: body.phone || '+221 77 000 00 00',
      role: body.role || 'citoyen',
      status: 'actif',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      commune: body.commune || 'Dakar Plateau, Dakar',
      badgeTitle: body.role === 'admin' ? 'Administrateur Mairie' : 'Citoyen Actif',
      stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 1 },
    };
    mockStore.users.unshift(newUser);
    return { status: 201, data: deepClone(newUser) };
  }

  if (method === 'put' && path.startsWith('admin/users/')) {
    const id = path.split('/')[2];
    const index = mockStore.users.findIndex((item) => item.id === id);
    if (index === -1) return { status: 404, data: { message: 'Utilisateur non trouvé' } };
    mockStore.users[index] = { ...mockStore.users[index], ...body };
    return { status: 200, data: deepClone(mockStore.users[index]) };
  }

  if (method === 'patch' && path.startsWith('admin/users/') && path.includes('/status')) {
    const id = path.split('/')[2];
    const user = mockStore.users.find((item) => item.id === id);
    if (!user) return { status: 404, data: { message: 'Utilisateur non trouvé' } };
    user.status = body.status || user.status;
    return { status: 200, data: deepClone(user) };
  }

  if (method === 'delete' && path.startsWith('admin/users/')) {
    const id = path.split('/')[2];
    mockStore.users = mockStore.users.filter((item) => item.id !== id);
    return { status: 200, data: { success: true, message: 'Utilisateur supprimé' } };
  }

  return { status: 404, data: { message: 'Route API introuvable', route: path } };
}
