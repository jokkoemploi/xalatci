import apiClient from './axios';
import { Incident, IncidentStatus, UrgencyLevel } from '../types';

export const incidentService = {
  getIncidents: async (filters?: { category?: string; status?: string; urgency?: string; search?: string }) => {
    const res = await apiClient.get<Incident[]>('/incidents', { params: filters });
    return res.data;
  },

  getIncidentById: async (id: string) => {
    const res = await apiClient.get<Incident>(`/incidents/${id}`);
    return res.data;
  },

  createIncident: async (payload: {
    title: string;
    description: string;
    category: string;
    urgency: UrgencyLevel;
    location: { address: string; lat: number; lng: number; commune?: string };
    photoUrl: string;
  }) => {
    const res = await apiClient.post<Incident>('/incidents', payload);
    return res.data;
  },

  updateStatus: async (id: string, status: IncidentStatus, note?: string, agentName?: string) => {
    const res = await apiClient.patch<Incident>(`/incidents/${id}/status`, { status, note, agentName });
    return res.data;
  },

  addComment: async (id: string, text: string, authorName?: string, authorRole?: string) => {
    const res = await apiClient.post(`/incidents/${id}/comments`, { text, authorName, authorRole });
    return res.data;
  },

  upvoteIncident: async (id: string) => {
    const res = await apiClient.post(`/incidents/${id}/upvote`);
    return res.data;
  }
};

export default incidentService;
