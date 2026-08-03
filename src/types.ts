export type UrgencyLevel = 'Faible' | 'Moyenne' | 'Critique';
export type IncidentStatus = 'En attente' | 'En cours' | 'Résolu' | 'Rejeté' | 'CREE' | 'VALIDE' | 'AFFECTE' | 'EN_COURS' | 'RESOLU' | 'CLOTURE';

export type UserRole = 'citoyen' | 'agent' | 'admin';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetResource: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
  commune?: string;
}

export interface IncidentTimelineStep {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  author?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: 'citoyen' | 'agent' | 'admin';
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  reference: string;
  title: string;
  description: string;
  category: string;
  urgency: UrgencyLevel;
  status: IncidentStatus;
  location: LocationData;
  photoUrl: string;
  reporterId: string;
  reporterName: string;
  reporterPhone?: string;
  agentAssigned?: {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
  timeline: IncidentTimelineStep[];
  comments: Comment[];
  upvotesCount?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  description?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'incident_update' | 'badge_earned' | 'system' | 'message';
  incidentId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  avatar?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  dateUnlocked?: string;
  progressPercent: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'citoyen' | 'agent' | 'admin';
  avatar: string;
  commune?: string;
  badgeTitle?: string;
  status?: 'actif' | 'suspendu';
  stats: {
    totalReports: number;
    resolvedCount: number;
    inProgressCount: number;
    pendingCount: number;
    badgesCount: number;
  };
}

export interface DashboardStats {
  totalIncidents: number;
  pendingIncidents: number;
  inProgressIncidents: number;
  resolvedIncidents: number;
  avgResolutionTimeHours: number;
  incidentsByCategory: { name: string; count: number; color: string }[];
  incidentsByCommune: { commune: string; count: number }[];
  monthlyTrend: { month: string; signalements: number; resolus: number }[];
  agentPerformance: { id: string; name: string; resolved: number; rating: number; avatar: string }[];
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'signalement' | 'badge' | 'statut' | 'profil';
  icon: string;
}
