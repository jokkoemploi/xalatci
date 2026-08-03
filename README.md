# XALAT-CI — Plateforme Citoyenne & Portail Mairie (Sénégal)

**XALAT-CI** est une solution digitale moderne et dynamique conçue pour la gestion participative des incidents urbains et le suivi en temps réel pour les communes et municipalités au Sénégal (Dakar, Thiès, Saint-Louis, Kaolack, Ziguinchor, etc.).

---

## 🚀 Architecture & Technologies

- **Frontend**: React 18, TypeScript (Strict), Tailwind CSS, Lucide Icons, Leaflet Maps, Recharts, Zustand.
- **Clean Architecture**: Séparation stricte entre les composants UI (`src/components`), les services API (`src/lib/api.ts`, `src/api/*`), la gestion d'état centralisée (`src/store/*`), et la couche temps réel (`src/lib/eventBus.ts`, `src/lib/realtimeService.ts`).
- **Data-Driven 100% Dynamique**: Aucune donnée statique codée en dur. Tous les flux (incidents, utilisateurs, cartes, statistiques, notifications, chat) consomment directement l'API REST backend.
- **Design System & Accessibilité**:
  - Palette aux contrastes WCAG avec mode Sombre / Clair automatique.
  - Composants réutilisables (Boutons, Badges, Modales, Skeletons, Error Boundaries, Empty States).
  - Robustesse réseau avec gestion d'état hors-ligne.

---

## 📁 Structure du Projet

```text
/src
  ├── api/                # Services API REST modulaires (Incident, Auth, User, Dashboard, Chat...)
  ├── components/
  │   ├── admin/          # Portail Administrateur / Agent Mairie (Desktop Full-Width)
  │   ├── common/         # Design System (Button, Badge, Modal, Skeleton, ErrorBoundary...)
  │   ├── maps/           # Composants cartographiques (Leaflet Incident Map & Location Picker)
  │   └── mobile/         # Application Mobile Citoyen (26 Écrans immersifs 100% hauteur)
  ├── hooks/              # Custom React Hooks & React Query (useIncidents, useAppData, useNetworkStatus...)
  ├── lib/                # EventBus, Realtime Service, Audit Logger, Axios Client
  ├── store/              # Zustand Stores (Auth, Incident, User, View, Map, Notification, Chat...)
  └── types.ts            # Modèles TypeScript stricts & RBAC
```

---

## 🚦 Navigation & Routes

### Application Citoyen (Mobile)
- `/login` — Connexion
- `/register` — Inscription
- `/dashboard` — Tableau de bord citoyen
- `/map` — Carte interactive des incidents
- `/report` — Formulaire de signalement géo-localisé
- `/history` — Historique & activité
- `/profile` — Profil citoyen
- `/settings` — Paramètres
- `/notifications` — Centre de notifications
- `/messages` — Messagerie support mairie

### Portail Administrateur & Agent
- `/admin` — Dashboard principal SaaS
- `/admin/incidents` — Gestionnaire d'incidents & workflows
- `/admin/users` — Gestion des citoyens
- `/admin/agents` — Affectation des agents municipaux
- `/admin/categories` — Configuration des catégories
- `/admin/statistics` — Analytique avancée & graphiques
- `/admin/reports` — Générateur de rapports PDF/Excel
- `/admin/map` — Heatmap & cartographie globale
- `/admin/settings` — Paramètres municipaux

---

## 🛠️ Installation & Lancement

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Validation TypeScript et Linting
npm run lint

# Build de production
npm run build
```

---

## 📄 Documentation API Backend

Consultez [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) pour les détails des endpoints REST.
