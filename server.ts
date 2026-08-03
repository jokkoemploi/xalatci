import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initial database seed state for Senegal (In-memory mock store backed by REST APIs)
let usersSeed = [
  {
    id: "usr-1",
    name: "Ousmane Diallo",
    email: "ousmane.diallo@xalat.sn",
    phone: "+221 77 123 45 67",
    role: "citoyen" as const,
    status: "actif" as const,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    commune: "Dakar Plateau, Dakar",
    badgeTitle: "Citoyen Ambassadeur",
    stats: {
      totalReports: 12,
      resolvedCount: 8,
      inProgressCount: 3,
      pendingCount: 1,
      badgesCount: 4,
    }
  },
  {
    id: "usr-2",
    name: "Fatou Ndiaye",
    email: "fatou.ndiaye@xalat.sn",
    phone: "+221 78 987 65 43",
    role: "admin" as const,
    status: "actif" as const,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    commune: "Médina, Dakar",
    badgeTitle: "Administrateur Voirie",
    stats: {
      totalReports: 45,
      resolvedCount: 38,
      inProgressCount: 7,
      pendingCount: 0,
      badgesCount: 6,
    }
  },
  {
    id: "usr-3",
    name: "Mamadou Sow",
    email: "admin@xalat.sn",
    phone: "+221 70 111 22 33",
    role: "admin" as const,
    status: "actif" as const,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    commune: "Almadies, Dakar",
    badgeTitle: "Super Administrateur",
    stats: {
      totalReports: 120,
      resolvedCount: 110,
      inProgressCount: 8,
      pendingCount: 2,
      badgesCount: 10,
    }
  },
  {
    id: "usr-4",
    name: "Aminata Ndiaye",
    email: "aminata.ndiaye@xalat.sn",
    phone: "+221 76 543 21 09",
    role: "citoyen" as const,
    status: "actif" as const,
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250",
    commune: "Thiès Escale, Thiès",
    badgeTitle: "Citoyenne Vigilante",
    stats: {
      totalReports: 7,
      resolvedCount: 5,
      inProgressCount: 2,
      pendingCount: 0,
      badgesCount: 3,
    }
  },
  {
    id: "usr-5",
    name: "Cheikh Sylla",
    email: "cheikh.sylla@xalat.sn",
    phone: "+221 77 888 99 00",
    role: "citoyen" as const,
    status: "suspendu" as const,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    commune: "Saint-Louis Escale, Saint-Louis",
    badgeTitle: "Citoyen Débutant",
    stats: {
      totalReports: 2,
      resolvedCount: 0,
      inProgressCount: 1,
      pendingCount: 1,
      badgesCount: 1,
    }
  }
];

let categoriesSeed = [
  { id: "cat-1", name: "Routes & Voirie", icon: "Route", color: "#0D47A1", count: 42, description: "Nids de poule, dalles endommagées, chaussée dégradée" },
  { id: "cat-2", name: "Éclairage public", icon: "Lightbulb", color: "#F59E0B", count: 28, description: "Poteaux défectueux, lampadaires éteints, câbles pendants" },
  { id: "cat-3", name: "Déchets & Propreté", icon: "Trash2", color: "#10B981", count: 35, description: "Dépôts sauvages, poubelles débordantes, encombrants" },
  { id: "cat-4", name: "Eau & Assainissement", icon: "Droplets", color: "#0284C7", count: 21, description: "Fuites d'eau potable, canalisations bouchées, inondations" },
  { id: "cat-5", name: "Santé & Hygiène", icon: "HeartPulse", color: "#EF4444", count: 14, description: "Eaux stagnantes, nuisibles, insalubrité publique" },
  { id: "cat-6", name: "Sécurité & Incivilités", icon: "ShieldAlert", color: "#8B5CF6", count: 19, description: "Plaques de regard volées, zones à risque, dégradations" },
  { id: "cat-7", name: "Catastrophe & Intempéries", icon: "Flame", color: "#DC2626", count: 8, description: "Arbres tombés, éboulements, risques imminents" },
  { id: "cat-8", name: "Autres incidents", icon: "MoreHorizontal", color: "#6B7280", count: 11, description: "Problèmes divers ne rentrant pas dans d'autres catégories" }
];

let incidentsSeed = [
  {
    id: "inc-1",
    reference: "SN-DK-2026-001",
    title: "Nid-de-poule important sur l'Avenue Lamine Guèye",
    description: "Grand trou sur la chaussée causant des perturbations majeures du trafic entre Plateau et Médina.",
    category: "Routes & Voirie",
    urgency: "Critique",
    status: "En cours",
    location: {
      address: "Avenue Lamine Guèye, Dakar Plateau, Dakar",
      lat: 14.6710,
      lng: -17.4380,
      commune: "Dakar Plateau"
    },
    photoUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600",
    reporterId: "usr-1",
    reporterName: "Ousmane Diallo",
    reporterPhone: "+221 77 123 45 67",
    agentAssigned: {
      id: "usr-2",
      name: "Fatou Ndiaye (Agent Voirie)",
      phone: "+221 78 987 65 43"
    },
    createdAt: "12/05/2026 à 14:20",
    updatedAt: "12/05/2026 à 16:10",
    upvotesCount: 24,
    timeline: [
      { id: "t1", title: "Signalement envoyé", description: "Enregistré avec succès par le citoyen", date: "12/05/2026 à 14:20", status: "completed" },
      { id: "t2", title: "Pris en charge", description: "Assigné à l'équipe technique de la mairie de Dakar", date: "12/05/2026 à 15:10", status: "completed", author: "Fatou Ndiaye" },
      { id: "t3", title: "En cours de traitement", description: "Intervention sur le terrain programmée", date: "12/05/2026 à 16:10", status: "current" },
      { id: "t4", title: "Résolution & Validation", description: "Remise en état et confirmation photo", date: "En attente", status: "upcoming" }
    ],
    comments: [
      { id: "c1", authorName: "Fatou Ndiaye", authorRole: "agent", text: "Bonjour Ousmane, l'équipe voirie de Dakar a bien reçu le signalement.", createdAt: "12/05/2026 à 15:15" },
      { id: "c2", authorName: "Ousmane Diallo", authorRole: "citoyen", text: "Merci pour la réactivité !", createdAt: "12/05/2026 à 15:30" }
    ]
  },
  {
    id: "inc-2",
    reference: "SN-DK-2026-002",
    title: "Éclairage public défectueux aux Almadies",
    description: "Plusieurs lampadaires éteints le long de la corniche des Almadies.",
    category: "Éclairage public",
    urgency: "Moyenne",
    status: "En cours",
    location: {
      address: "Route des Almadies, Dakar",
      lat: 14.7450,
      lng: -17.5180,
      commune: "Almadies"
    },
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=600",
    reporterId: "usr-1",
    reporterName: "Ousmane Diallo",
    createdAt: "11/05/2026 à 19:45",
    updatedAt: "12/05/2026 à 09:15",
    upvotesCount: 15,
    timeline: [
      { id: "t1", title: "Signalement envoyé", description: "Enregistré avec succès par le citoyen", date: "11/05/2026 à 19:45", status: "completed" },
      { id: "t2", title: "Pris en charge", description: "Vérification du réseau Senelec local", date: "12/05/2026 à 09:15", status: "current" }
    ],
    comments: []
  },
  {
    id: "inc-3",
    reference: "SN-TH-2026-003",
    title: "Dépôts d'ordures sauvages au quartier Escale Thiès",
    description: "Accumulation importante de déchets ménagers bloquant le passage.",
    category: "Déchets & Propreté",
    urgency: "Critique",
    status: "Résolu",
    location: {
      address: "Quartier Escale, Thiès",
      lat: 14.7900,
      lng: -16.9260,
      commune: "Thiès Escale"
    },
    photoUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600",
    reporterId: "usr-1",
    reporterName: "Ousmane Diallo",
    createdAt: "09/05/2026 à 08:10",
    updatedAt: "10/05/2026 à 14:00",
    upvotesCount: 31,
    timeline: [
      { id: "t1", title: "Signalement envoyé", description: "Enregistré avec succès par le citoyen", date: "09/05/2026 à 08:10", status: "completed" },
      { id: "t2", title: "Pris en charge", description: "Service d'hygiène de Thiès mobilisé", date: "09/05/2026 à 10:00", status: "completed" },
      { id: "t3", title: "Résolu", description: "Enlèvement des ordures et nettoyage effectué", date: "10/05/2026 à 14:00", status: "completed" }
    ],
    comments: [
      { id: "c1", authorName: "Agent Propreté Thiès", authorRole: "agent", text: "Zone déblayée et désinfectée.", createdAt: "10/05/2026 à 14:05" }
    ]
  },
  {
    id: "inc-4",
    reference: "SN-SL-2026-004",
    title: "Fuite d'eau importante près du Pont Faidherbe",
    description: "Rupture de canalisation d'eau potable à Saint-Louis.",
    category: "Eau & Assainissement",
    urgency: "Critique",
    status: "En attente",
    location: {
      address: "Avenue Général de Gaulle, Saint-Louis",
      lat: 16.0200,
      lng: -16.5000,
      commune: "Saint-Louis Nord"
    },
    photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=600",
    reporterId: "usr-1",
    reporterName: "Ousmane Diallo",
    createdAt: "12/05/2026 à 13:00",
    updatedAt: "12/05/2026 à 13:00",
    upvotesCount: 8,
    timeline: [
      { id: "t1", title: "Signalement envoyé", description: "En attente de validation par la SEN'EAU / Mairie", date: "12/05/2026 à 13:00", status: "current" }
    ],
    comments: []
  }
];

let notificationsSeed = [
  { id: "notif-1", title: "Prise en charge", message: "Votre signalement 'Nid-de-poule sur la route' a été pris en charge par l'équipe voirie.", date: "Il y a 10 min", read: false, type: "incident_update", incidentId: "inc-1" },
  { id: "notif-2", title: "Évolution du statut", message: "Votre signalement est en cours de traitement à Yopougon.", date: "Il y a 1h", read: false, type: "incident_update", incidentId: "inc-1" },
  { id: "notif-3", title: "Incident résolu", message: "Votre signalement 'Dépôts d'ordures sauvages' a été résolu avec succès.", date: "Il y a 2h", read: true, type: "incident_update", incidentId: "inc-3" },
  { id: "notif-4", title: "Nouveau badge obtenu !", message: "Félicitations ! Vous avez débloqué le badge 'Signaleur Actif'.", date: "Il y a 1j", read: true, type: "badge_earned" }
];

let chatMessagesSeed = [
  { id: "msg-1", sender: "agent", text: "Bonjour Mamadou ! Je suis l'agent support XALAT-CI. Comment puis-je vous aider aujourd'hui ?", timestamp: "10:14", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" },
  { id: "msg-2", sender: "user", text: "J'ai une question concernant le statut de mon signalement de nid-de-poule.", timestamp: "10:15" },
  { id: "msg-3", sender: "agent", text: "Bien sûr ! Je vois votre signalement XD-0004-05-24-001 à Siporex. L'équipe d'intervention est actuellement sur place pour reboucher la chaussée.", timestamp: "10:16", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" },
  { id: "msg-4", sender: "user", text: "Super, merci pour votre réactivité et vos précisions !", timestamp: "10:18" }
];

let badgesSeed = [
  { id: "bdg-1", name: "Citoyen Engagé", description: "A envoyé son 1er signalement validé sur XALAT-CI", icon: "ShieldCheck", unlocked: true, dateUnlocked: "10/01/2026", progressPercent: 100 },
  { id: "bdg-2", name: "Signaleur Actif", description: "A réalisé au moins 5 signalements dans sa commune", icon: "Flame", unlocked: true, dateUnlocked: "15/03/2026", progressPercent: 100 },
  { id: "bdg-3", name: "Contributeur Top", description: "A contribué à résoudre 5 incidents majeurs de voirie", icon: "Award", unlocked: true, dateUnlocked: "02/05/2026", progressPercent: 100 },
  { id: "bdg-4", name: "Veilleur de Nuit", description: "A signalé au moins 3 problèmes d'éclairage public", icon: "Eye", unlocked: true, dateUnlocked: "10/05/2026", progressPercent: 100 },
  { id: "bdg-5", name: "Ambassadeur Propreté", description: "Réalisez 10 signalements de salubrité publique", icon: "Sparkles", unlocked: false, progressPercent: 70 }
];

let activityLogsSeed = [
  { id: "log-1", title: "Signalement envoyé", description: "Nid-de-poule sur la route à Dakar Plateau", date: "12/05/2026 à 14:20", type: "signalement", icon: "Send" },
  { id: "log-2", title: "Badge obtenu", description: "Signaleur actif débloqué", date: "10/05/2026 à 10:30", type: "badge", icon: "Award" },
  { id: "log-3", title: "Signalement résolu", description: "Dépôts d'ordures à Thiès", date: "08/05/2026 à 09:15", type: "statut", icon: "CheckCircle" },
  { id: "log-4", title: "Profil mis à jour", description: "Changement du numéro de téléphone principal", date: "05/05/2026 à 16:40", type: "profil", icon: "User" }
];

// --- API ROUTES ---

// 0. Senegal Regions API
app.get("/api/regions", (req, res) => {
  res.json([
    { name: "Dakar", code: "DK", departments: ["Dakar", "Guédiawaye", "Keur Massar", "Pikine", "Rufisque"] },
    { name: "Thiès", code: "TH", departments: ["M'bour", "Thiès", "Tivaouane"] },
    { name: "Diourbel", code: "DB", departments: ["Bambey", "Diourbel", "Mbacké"] },
    { name: "Saint-Louis", code: "SL", departments: ["Dagana", "Podor", "Saint-Louis"] },
    { name: "Louga", code: "LG", departments: ["Kébémer", "Linguère", "Louga"] },
    { name: "Fatick", code: "FK", departments: ["Fatick", "Foundiougne", "Gossas"] },
    { name: "Kaolack", code: "KL", departments: ["Guinguinéo", "Kaolack", "Nioro du Rip"] },
    { name: "Kaffrine", code: "KF", departments: ["Birkelane", "Kaffrine", "Koungheul", "Malem Hodar"] },
    { name: "Tambacounda", code: "TC", departments: ["Bakel", "Goudiry", "Koumpentoum", "Tambacounda"] },
    { name: "Kolda", code: "KD", departments: ["Kolda", "Médina Yoro Foulah", "Vélingara"] },
    { name: "Sédhiou", code: "SD", departments: ["Bounkiling", "Goudomp", "Sédhiou"] },
    { name: "Ziguinchor", code: "ZG", departments: ["Bignona", "Oussouye", "Ziguinchor"] },
    { name: "Kédougou", code: "KG", departments: ["Kédougou", "Salémata", "Saraya"] },
    { name: "Matam", code: "MT", departments: ["Kanel", "Matam", "Ranérou"] }
  ]);
});

// 1. Auth & Session
app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  const user = usersSeed.find(u => u.email === email) || usersSeed[0];
  res.json({
    token: "jwt_token_xalat_ci_mock_2026",
    user
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, phone, commune } = req.body;
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || "Nouveau Citoyen",
    email: email || "citoyen@xalat.sn",
    phone: phone || "+221 77 000 00 00",
    role: "citoyen" as const,
    status: "actif" as const,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
    commune: commune || "Dakar Plateau, Dakar",
    badgeTitle: "Citoyen Nouveau",
    stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 1 }
  };
  usersSeed.push(newUser);
  res.status(201).json({ token: "jwt_token_xalat_ci_mock_2026", user: newUser });
});

app.post("/api/auth/forgot-password", (req, res) => {
  res.json({ success: true, message: "Un lien de réinitialisation a été envoyé par SMS / Email (+221)." });
});

app.get("/api/auth/me", (req, res) => {
  res.json(usersSeed[0]);
});

// 2. Incidents
app.get("/api/incidents", (req, res) => {
  const { category, status, urgency, search } = req.query;
  let result = [...incidentsSeed];

  if (category && category !== "Toutes" && category !== "Tous") {
    result = result.filter(i => i.category === category);
  }
  if (status && status !== "Tous") {
    result = result.filter(i => i.status === status);
  }
  if (urgency && urgency !== "Toutes") {
    result = result.filter(i => i.urgency === urgency);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.location.address.toLowerCase().includes(q));
  }

  res.json(result);
});

app.get("/api/incidents/:id", (req, res) => {
  const incident = incidentsSeed.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ message: "Incident non trouvé" });
  res.json(incident);
});

app.post("/api/incidents", (req, res) => {
  const body = req.body;
  const count = incidentsSeed.length + 1;
  const refNum = String(count).padStart(3, '0');
  
  const newIncident = {
    id: `inc-${Date.now()}`,
    reference: `SN-DK-2026-${refNum}`,
    title: body.title || "Signalement Citoyen",
    description: body.description || "Aucune description fournie.",
    category: body.category || "Routes & Voirie",
    urgency: body.urgency || "Moyenne",
    status: "En attente" as const,
    location: {
      address: body.location?.address || "Commune de Dakar",
      lat: body.location?.lat || 14.6937,
      lng: body.location?.lng || -17.4441,
      commune: body.location?.commune || "Dakar"
    },
    photoUrl: body.photoUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600",
    reporterId: "usr-1",
    reporterName: "Ousmane Diallo",
    reporterPhone: "+221 77 123 45 67",
    createdAt: new Date().toLocaleDateString('fr-FR') + " à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    updatedAt: new Date().toLocaleDateString('fr-FR') + " à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    upvotesCount: 1,
    timeline: [
      {
        id: `t-${Date.now()}`,
        title: "Signalement envoyé",
        description: "Votre signalement est transmis aux services municipaux au Sénégal.",
        date: new Date().toLocaleDateString('fr-FR') + " à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: "current" as const
      }
    ],
    comments: [],
    agentAssigned: undefined
  };

  incidentsSeed.unshift(newIncident);
  
  // Create notification
  notificationsSeed.unshift({
    id: `notif-${Date.now()}`,
    title: "Nouveau signalement enregistré",
    message: `Votre signalement '${newIncident.title}' est en attente de validation.`,
    date: "À l'instant",
    read: false,
    type: "incident_update",
    incidentId: newIncident.id
  });

  // Update user stats
  usersSeed[0].stats.totalReports += 1;
  usersSeed[0].stats.pendingCount += 1;

  res.status(201).json(newIncident);
});

app.patch("/api/incidents/:id/status", (req, res) => {
  const { status, note, agentName } = req.body;
  const incident = incidentsSeed.find(i => i.id === req.params.id);
  
  if (!incident) return res.status(404).json({ message: "Incident introuvable" });

  const oldStatus = incident.status;
  incident.status = status;
  incident.updatedAt = new Date().toLocaleDateString('fr-FR') + " à " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  // Update timeline
  incident.timeline.push({
    id: `t-${Date.now()}`,
    title: `Passé en '${status}'`,
    description: note || `Changement de statut effectué par l'agent ${agentName || 'Municipal'}`,
    date: incident.updatedAt,
    status: status === "Résolu" ? "completed" : "current",
    author: agentName || "Agent Voirie"
  });

  // Create user notification
  notificationsSeed.unshift({
    id: `notif-${Date.now()}`,
    title: `Incident ${status}`,
    message: `Votre signalement '${incident.title}' est désormais : ${status}.`,
    date: "À l'instant",
    read: false,
    type: "incident_update",
    incidentId: incident.id
  });

  res.json(incident);
});

app.post("/api/incidents/:id/comments", (req, res) => {
  const { text, authorName, authorRole } = req.body;
  const incident = incidentsSeed.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ message: "Incident non trouvé" });

  const comment = {
    id: `c-${Date.now()}`,
    authorName: authorName || "Ousmane Diallo",
    authorRole: authorRole || "citoyen",
    text: text || "",
    createdAt: "À l'instant"
  };

  incident.comments.push(comment);
  res.status(201).json(comment);
});

// 3. Categories
app.get("/api/categories", (req, res) => {
  res.json(categoriesSeed);
});

// 4. Notifications
app.get("/api/notifications", (req, res) => {
  res.json(notificationsSeed);
});

app.patch("/api/notifications/mark-read", (req, res) => {
  notificationsSeed = notificationsSeed.map(n => ({ ...n, read: true }));
  res.json({ success: true });
});

// 5. Chat Messaging
app.get("/api/chat/messages", (req, res) => {
  res.json(chatMessagesSeed);
});

app.post("/api/chat/messages", (req, res) => {
  const { text } = req.body;
  const userMsg = {
    id: `msg-${Date.now()}`,
    sender: "user" as const,
    text,
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  };
  chatMessagesSeed.push(userMsg);

  // Auto agent reply simulation
  setTimeout(() => {
    chatMessagesSeed.push({
      id: `msg-${Date.now() + 1}`,
      sender: "agent" as const,
      text: "Un agent municipal XALAT-CI a bien pris connaissance de votre message et vous recontactera très vite.",
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
    });
  }, 1000);

  res.status(201).json(userMsg);
});

// 6. Badges & Gamification
app.get("/api/badges", (req, res) => {
  res.json(badgesSeed);
});

// 7. Profile & User info
app.get("/api/profile", (req, res) => {
  res.json(usersSeed[0]);
});

app.put("/api/profile", (req, res) => {
  const body = req.body;
  usersSeed[0] = { ...usersSeed[0], ...body };
  res.json(usersSeed[0]);
});

// 8. History / Activity Logs
app.get("/api/history", (req, res) => {
  res.json(activityLogsSeed);
});

// 9. Admin Stats & Dashboard
app.get("/api/admin/stats", (req, res) => {
  res.json({
    totalIncidents: incidentsSeed.length,
    pendingIncidents: incidentsSeed.filter(i => i.status === "En attente").length,
    inProgressIncidents: incidentsSeed.filter(i => i.status === "En cours").length,
    resolvedIncidents: incidentsSeed.filter(i => i.status === "Résolu").length,
    avgResolutionTimeHours: 4.8,
    incidentsByCategory: [
      { name: "Routes & Voirie", count: 42, color: "#0D47A1" },
      { name: "Éclairage public", count: 28, color: "#F59E0B" },
      { name: "Déchets & Propreté", count: 35, color: "#10B981" },
      { name: "Eau & Assainissement", count: 21, color: "#0284C7" },
      { name: "Sécurité", count: 19, color: "#8B5CF6" },
      { name: "Santé", count: 14, color: "#EF4444" }
    ],
    incidentsByCommune: [
      { commune: "Dakar Plateau", count: 48 },
      { commune: "Médina", count: 32 },
      { commune: "Grand Dakar", count: 29 },
      { commune: "Parcelles Assainies", count: 18 },
      { commune: "Almadies", count: 15 },
      { commune: "Thiès", count: 12 }
    ],
    monthlyTrend: [
      { month: "Jan", signalements: 65, resolus: 58 },
      { month: "Fév", signalements: 82, resolus: 75 },
      { month: "Mar", signalements: 95, resolus: 88 },
      { month: "Avr", signalements: 110, resolus: 98 },
      { month: "Mai", signalements: 138, resolus: 119 }
    ],
    agentPerformance: [
      { id: "usr-2", name: "Fatou Ndiaye", resolved: 38, rating: 4.9, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" },
      { id: "ag-2", name: "Ibrahima Sarr", resolved: 31, rating: 4.7, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" },
      { id: "ag-3", name: "Aminata Diop", resolved: 27, rating: 4.8, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100" }
    ]
  });
});

app.get("/api/admin/users", (req, res) => {
  res.json(usersSeed);
});

app.post("/api/admin/users", (req, res) => {
  const { name, email, phone, role, commune } = req.body;
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || "Nouveau Citoyen",
    email: email || `user-${Date.now()}@xalat.sn`,
    phone: phone || "+221 77 000 00 00",
    role: role || "citoyen",
    status: "actif" as const,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
    commune: commune || "Dakar Plateau, Dakar",
    badgeTitle: role === "admin" ? "Administrateur Mairie" : "Citoyen Actif",
    stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 1 }
  };
  usersSeed.unshift(newUser);
  res.status(201).json(newUser);
});

app.put("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  const userIndex = usersSeed.findIndex(u => u.id === id);
  if (userIndex === -1) return res.status(404).json({ message: "Utilisateur non trouvé" });

  usersSeed[userIndex] = { ...usersSeed[userIndex], ...req.body };
  res.json(usersSeed[userIndex]);
});

app.patch("/api/admin/users/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = usersSeed.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  user.status = status;
  res.json(user);
});

app.delete("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  usersSeed = usersSeed.filter(u => u.id !== id);
  res.json({ success: true, message: "Utilisateur supprimé" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server XALAT-CI running on http://localhost:${PORT}`);
  });
}

startServer();
