import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '../lib/api';
import { IncidentStatus, UrgencyLevel } from '../types';
import { eventBus } from '../lib/eventBus';

export function useIncidents(filters?: { category?: string; status?: string; urgency?: string; search?: string }) {
  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => incidentService.getIncidents(filters),
    refetchInterval: 5000,
  });
}

export function useIncident(id: string | null) {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: () => (id ? incidentService.getIncidentById(id) : null),
    enabled: !!id,
  });
}

export function useIncidentDetail(id: string | null) {
  return useIncident(id);
}

export function useCreateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      title: string;
      description: string;
      category: string;
      urgency: UrgencyLevel;
      location: { address: string; lat: number; lng: number; commune?: string };
      photoUrl: string;
    }) => incidentService.createIncident(payload),
    onSuccess: (newIncident) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      eventBus.emit('INCIDENT_CREATED', newIncident);
      eventBus.emit('NEW_NOTIFICATION', { title: 'Nouveau Signalement', message: newIncident.title });
    },
  });
}

export function useUpdateIncident() {
  return useUpdateIncidentStatus();
}

export function useUpdateIncidentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note, agentName }: { id: string; status: IncidentStatus; note?: string; agentName?: string }) =>
      incidentService.updateStatus(id, status, note, agentName),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incident', updated.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      eventBus.emit('INCIDENT_UPDATED', updated);
      eventBus.emit('NEW_NOTIFICATION', { title: 'Changement de statut', message: `Incident #${updated.reference || updated.id} mis à jour : ${updated.status}` });
    },
  });
}

export function useDeleteIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // simulate delete or call API
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      eventBus.emit('INCIDENT_DELETED', id);
    }
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text, authorName, authorRole }: { id: string; text: string; authorName?: string; authorRole?: string }) =>
      incidentService.addComment(id, text, authorName, authorRole),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incident', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
