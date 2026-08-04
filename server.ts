import express from "express";
import path from "path";
import { PrismaClient } from '@prisma/client';
import { createServer as createViteServer } from "vite";

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initial database seed state for Senegal (In-memory mock store backed by REST APIs)
let usersSeed: any[] = [];
let categoriesSeed: any[] = [];
let incidentsSeed: any[] = [];
let notificationsSeed: any[] = [];
let chatMessagesSeed: any[] = [];
let badgesSeed: any[] = [];
let activityLogsSeed: any[] = [];

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
app.post("/api/auth/login", async (req, res) => {
  const rawIdentifier = String(req.body?.email || req.body?.phone || '').trim();
  if (!rawIdentifier) {
    return res.status(400).json({ message: 'Email ou téléphone requis' });
  }

  const identifier = rawIdentifier.toLowerCase();
  const isEmail = identifier.includes('@');

  const user = await prisma.user.findFirst({
    where: isEmail
      ? { email: identifier }
      : { phone: rawIdentifier }
  });

  if (!user) {
    return res.status(404).json({ message: 'Compte introuvable. Vérifiez votre email ou téléphone.' });
  }

  return res.json({
    token: "jwt_token_xalat_ci_mock_2026",
    user: {
      ...user,
      stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 0 }
    }
  });
});

app.post("/api/auth/register", async (req, res) => {
  const rawName = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const phone = String(req.body?.phone || '').trim();
  const commune = String(req.body?.commune || 'Dakar Plateau, Dakar').trim();

  if (!rawName || !email || !phone) {
    return res.status(400).json({ message: 'Nom, email et téléphone sont requis.' });
  }

  const existing = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { phone }
      ]
    }
  });

  if (existing) {
    return res.status(409).json({
      message: 'Un compte existe déjà avec ce mail ou ce numéro de téléphone.'
    });
  }

  const newUser = await prisma.user.create({
    data: {
      name: rawName,
      email,
      phone,
      role: 'citoyen',
      status: 'actif',
      avatar: '',
      commune,
      badgeTitle: 'Citoyen Nouveau',
    }
  });

  return res.status(201).json({
    token: "jwt_token_xalat_ci_mock_2026",
    user: {
      ...newUser,
      stats: { totalReports: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0, badgesCount: 0 }
    }
  });
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
  
  const newIncident: any = {
    id: `inc-${Date.now()}`,
    reference: `SN-DK-2026-${refNum}`,
    title: String(body.title || "Signalement Citoyen"),
    description: String(body.description || "Aucune description fournie."),
    category: String(body.category || "Routes & Voirie"),
    urgency: String(body.urgency || "Moyenne"),
    status: "En attente" as const,
    location: {
      address: String(body.location?.address || "Commune de Dakar"),
      lat: Number(body.location?.lat ?? 14.6937),
      lng: Number(body.location?.lng ?? -17.4441),
      commune: String(body.location?.commune || "Dakar")
    },
    photoUrl: String(body.photoUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600"),
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
