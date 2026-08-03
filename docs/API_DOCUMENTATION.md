# Documentation API REST - XALAT-CI

Spécifications complètes de l'API REST pour la plateforme **XALAT-CI** (Signalement Citoyen & Gestion Municipale du Sénégal).

---

## 1. Authentification (`/api/auth`)

### `POST /api/auth/register`
Inscrit un nouvel utilisateur (citoyen ou agent).
- **Body**:
  ```json
  {
    "name": "Moussa Diop",
    "email": "moussa@example.sn",
    "phone": "+221771234567",
    "password": "secretPassword123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "id": "usr_123",
      "name": "Moussa Diop",
      "email": "moussa@example.sn",
      "role": "citoyen"
    }
  }
  ```

### `POST /api/auth/login`
Authentifie un utilisateur.
- **Body**:
  ```json
  {
    "email": "moussa@example.sn",
    "password": "secretPassword123"
  }
  ```

### `GET /api/auth/me`
Récupère les informations du profil connecté.
- **Headers**: `Authorization: Bearer <token>`

---

## 2. Incidents (`/api/incidents`)

### `GET /api/incidents`
Récupère la liste des signalements filtrés.
- **Query Params**:
  - `status`: `CREE | VALIDE | AFFECTE | EN_COURS | RESOLU | CLOTURE`
  - `category`: `cat_id`
  - `urgency`: `Faible | Moyenne | Critique`
  - `search`: `mot clé`

### `POST /api/incidents`
Création d'un nouveau signalement par un citoyen.
- **Body**:
  ```json
  {
    "title": "Nid de poule sur l'Avenue Cheikh Anta Diop",
    "description": "Profonde crevasse provoquant des bouchons et des accidents.",
    "category": "cat_voirie",
    "urgency": "Critique",
    "location": {
      "address": "Fann Hock, Dakar",
      "lat": 14.6852,
      "lng": -17.4628,
      "commune": "Dakar Plateau"
    },
    "photoUrl": "https://images.unsplash.com/photo-..."
  }
  ```

### `PATCH /api/incidents/:id/status`
Mise à jour du statut d'un incident par un agent/admin.
- **Body**:
  ```json
  {
    "status": "EN_COURS",
    "agentId": "agent_456",
    "comment": "Prise en charge par l'équipe de voirie municipale."
  }
  ```

---

## 3. Catégories (`/api/categories`)

### `GET /api/categories`
Récupère toutes les catégories actives d'incidents.

---

## 4. Tableau de bord & Statistiques (`/api/dashboard`)

### `GET /api/dashboard/stats`
Obtient les métriques analytiques pour le Portail Administrateur.
- **Response**:
  ```json
  {
    "totalIncidents": 125,
    "pendingIncidents": 30,
    "inProgressIncidents": 45,
    "resolvedIncidents": 50,
    "avgResolutionTimeHours": 18.5,
    "incidentsByCategory": [...],
    "incidentsByCommune": [...],
    "monthlyTrend": [...]
  }
  ```

---

## 5. Audit Log & Realtime

- **SSE Stream**: `GET /api/realtime/stream`
- **Audit Logs**: `GET /api/admin/audit-logs`
