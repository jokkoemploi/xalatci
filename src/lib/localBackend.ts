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
  users: [],
  categories: [],
  incidents: [],
  notifications: [],
  chatMessages: [],
  badges: [],
  activityLogs: [],
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

function getCurrentUser() {
  return mockStore.users[0] || null;
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
    const email = String(body.email || '').trim();
    const user = mockStore.users.find((entry) => entry.email === email) || getCurrentUser();

    if (!user && email) {
      const createdUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace(/[._-]/g, ' '),
        email,
        phone: '',
        role: 'citoyen',
        status: 'actif',
        avatar: '',
        commune: '',
        badgeTitle: '',
        stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 0 },
      };
      mockStore.users.unshift(createdUser);
      return { status: 200, data: { token: 'local_mock_jwt_token', user: deepClone(createdUser) } };
    }

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
    const currentUser = getCurrentUser();
    return { status: 200, data: deepClone(currentUser || { id: '', name: '', email: '', phone: '', role: 'citoyen', avatar: '', commune: '', badgeTitle: '', stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 0 } }) };
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
  if (method === 'get' && path === 'profile') {
    const currentUser = getCurrentUser();
    return { status: 200, data: deepClone(currentUser || { id: '', name: '', email: '', phone: '', role: 'citoyen', avatar: '', commune: '', badgeTitle: '', stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 0 } }) };
  }

  if (method === 'put' && path === 'profile') {
    if (!mockStore.users[0]) {
      const createdUser = { id: `usr-${Date.now()}`, name: '', email: '', phone: '', role: 'citoyen', status: 'actif', avatar: '', commune: '', badgeTitle: '', stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 0 } };
      mockStore.users.unshift(createdUser);
    }
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
