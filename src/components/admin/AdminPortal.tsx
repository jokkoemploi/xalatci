import React, { useState } from 'react';
import { useViewStore, AdminTab } from '../../store/useViewStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useIncidents, useUpdateIncidentStatus } from '../../hooks/useIncidents';
import { 
  useAdminStats, 
  useAdminUsers, 
  useCategories, 
  useChatMessages, 
  useSendMessage,
  useCreateUser,
  useUpdateUserStatus,
  useDeleteUser
} from '../../hooks/useAppData';
import { IncidentMap } from '../maps/IncidentMap';
import { Incident, IncidentStatus } from '../../types';
import { XalatLogo } from '../common/XalatLogo';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

import { 
  LayoutDashboard, 
  FileText, 
  Map as MapIcon, 
  Users, 
  ShieldCheck, 
  Grid, 
  MessageSquare, 
  PieChart as ChartIcon, 
  Download, 
  Settings, 
  Search, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Filter, 
  UserPlus, 
  UserCheck,
  UserX,
  Trash2,
  Shield,
  RefreshCw,
  Send,
  Eye,
  ChevronRight,
  Sun,
  LogOut,
  MapPin,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { adminTab, setAdminTab, selectedIncidentId, setSelectedIncidentId } = useViewStore();
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  const { data: stats } = useAdminStats();
  const { data: incidents = [] } = useIncidents();
  const { data: categories = [] } = useCategories();
  const { data: users = [] } = useAdminUsers();
  const createUserMutation = useCreateUser();
  const updateUserStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();

  // Export modal & helper states
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'excel' | 'pdf'>('csv');
  const [exportCategory, setExportCategory] = useState<string>('Tous');
  const [exportStatus, setExportStatus] = useState<string>('Tous');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadExport = (format: 'csv' | 'json' | 'excel' | 'pdf', cat = exportCategory, stat = exportStatus) => {
    const listToExport = incidents.filter(inc => {
      const matchCat = cat === 'Tous' || inc.category === cat;
      const matchStat = stat === 'Tous' || inc.status === stat;
      return matchCat && matchStat;
    });

    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'csv' || format === 'excel') {
      const headers = ['Référence', 'Titre', 'Catégorie', 'Statut', 'Urgence', 'Adresse', 'Citoyen', 'Téléphone', 'Date'];
      const rows = listToExport.map(inc => [
        `"${inc.reference}"`,
        `"${inc.title.replace(/"/g, '""')}"`,
        `"${inc.category}"`,
        `"${inc.status}"`,
        `"${inc.urgency}"`,
        `"${inc.location.address.replace(/"/g, '""')}"`,
        `"${inc.reporterName.replace(/"/g, '""')}"`,
        `"${inc.reporterPhone || ''}"`,
        `"${inc.createdAt}"`
      ]);
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `xalat_incidents_${format}_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast(`Export ${format.toUpperCase()} (${listToExport.length} signalements) téléchargé !`);
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(listToExport, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `xalat_incidents_${timestamp}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast(`Export JSON (${listToExport.length} signalements) téléchargé !`);
    } else if (format === 'pdf') {
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        reportWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Rapport Municipal XALAT-CI - ${timestamp}</title>
              <style>
                body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1F2937; }
                .header { text-align: center; border-bottom: 2px solid #1E5EFF; padding-bottom: 20px; margin-bottom: 20px; }
                h1 { color: #1E5EFF; margin: 0; font-size: 24px; }
                h3 { color: #4B5563; margin-top: 5px; font-weight: normal; }
                .meta { background: #F8FAFC; padding: 12px 18px; border-radius: 12px; font-size: 13px; margin-bottom: 25px; display: flex; justify-content: space-between; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
                th, td { border: 1px solid #E5E7EB; padding: 10px 12px; text-align: left; }
                th { background-color: #F1F5F9; color: #1F2937; font-weight: bold; }
                tr:nth-child(even) { background-color: #F8FAFC; }
                .badge { padding: 4px 8px; border-radius: 12px; font-weight: bold; font-size: 10px; text-transform: uppercase; }
                .badge-resolu { background: #DCFCE7; color: #166534; }
                .badge-encours { background: #DBEAFE; color: #1E40AF; }
                .footer { margin-top: 40px; font-size: 11px; color: #9CA3AF; text-align: center; border-top: 1px solid #E5E7EB; padding-top: 15px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>RÉPUBLIQUE DU SÉNÉGAL • MAIRIE DE DAKAR</h1>
                <h3>Rapport Officiel des Signalements Citoyens — XALAT-CI</h3>
              </div>
              
              <div class="meta">
                <div><strong>Date du rapport :</strong> ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div><strong>Périmètre :</strong> ${cat === 'Tous' ? 'Toutes catégories' : cat}</div>
                <div><strong>Enregistrements :</strong> ${listToExport.length} signalements</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Titre & Description</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Urgence</th>
                    <th>Localisation</th>
                    <th>Citoyen</th>
                  </tr>
                </thead>
                <tbody>
                  ${listToExport.map(i => `
                    <tr>
                      <td><strong style="color: #1E5EFF">${i.reference}</strong></td>
                      <td><strong>${i.title}</strong><br><small style="color:#6B7280">${i.description || ''}</small></td>
                      <td>${i.category}</td>
                      <td><span class="badge ${i.status === 'Résolu' ? 'badge-resolu' : 'badge-encours'}">${i.status}</span></td>
                      <td><strong>${i.urgency}</strong></td>
                      <td>📍 ${i.location.address}</td>
                      <td>${i.reporterName}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="footer">
                <p>Document officiel généré automatiquement via la plateforme municipale XALAT-CI | Signature Numérique Mairie</p>
              </div>
              <script>
                window.onload = function() { window.print(); }
              </script>
            </body>
          </html>
        `);
        reportWindow.document.close();
        triggerToast(`Rapport Municipal PDF prêt pour impression / téléchargement !`);
      } else {
        const jsonContent = JSON.stringify(listToExport, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `rapport_municipal_xalat_${timestamp}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        triggerToast(`Rapport Municipal téléchargé sous format JSON !`);
      }
    }
  };

  // User management modal & filter states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'citoyen' | 'admin'>('citoyen');
  const [newUserCommune, setNewUserCommune] = useState('Dakar Plateau, Dakar');

  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('Tous');
  const [userStatusFilter, setUserStatusFilter] = useState('Tous');

  // Status edit modal state
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [newStatus, setNewStatus] = useState<IncidentStatus>('En cours');
  const [statusNote, setStatusNote] = useState('');
  const updateStatusMutation = useUpdateIncidentStatus();

  // Filters for incident data table
  const [filterCat, setFilterCat] = useState('Tous');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [filterUrgency, setFilterUrgency] = useState('Toutes');
  const [searchTerm, setSearchTerm] = useState('');

  // Access Control Guard for Admin Portal
  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'agent')) {
    return (
      <div className="min-h-[calc(100vh-65px)] bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl border border-[#E5E7EB] p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#1E5EFF] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#1F2937]">
              Contrôle d'Accès Mairie
            </h2>
            <p className="text-xs text-[#6B7280] mt-2">
              L'accès au Tableau de Bord Municipal nécessite une authentification Agent ou Administrateur.
            </p>
          </div>

          {user?.role === 'citoyen' && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Vous êtes actuellement connecté avec un compte Citoyen. Veuillez vous connecter avec un compte Agent ou Admin.</span>
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            login('fatou.ndiaye@xalat.sn');
          }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Identifiant Agent / Email Mairie
              </label>
              <input
                type="email"
                defaultValue="fatou.ndiaye@xalat.sn"
                required
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#1E5EFF] text-[#1F2937]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                required
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#1E5EFF] text-[#1F2937]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1E5EFF] hover:bg-blue-700 text-white font-bold rounded-xl shadow-md text-xs transition"
            >
              Se connecter au Tableau de Bord
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E5E7EB] space-y-2">
            <p className="text-[11px] font-semibold text-[#6B7280] uppercase text-center mb-2">
              Accès rapide démonstration :
            </p>
            <button
              onClick={() => login('fatou.ndiaye@xalat.sn')}
              className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-[#1E5EFF] rounded-xl text-xs font-semibold text-left flex items-center justify-between border border-blue-100 transition"
            >
              <span>Connexion Agent Voirie (Fatou Ndiaye)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => login('admin@xalat.sn')}
              className="w-full py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-semibold text-left flex items-center justify-between border border-purple-100 transition"
            >
              <span>Connexion Admin Mairie (Admin)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredIncidents = incidents.filter(i => {
    const matchCat = filterCat === 'Tous' || i.category === filterCat;
    const matchStatus = filterStatus === 'Tous' || i.status === filterStatus;
    const matchUrgency = filterUrgency === 'Toutes' || i.urgency === filterUrgency;
    const matchSearch = !searchTerm || i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.reference.toLowerCase().includes(searchTerm.toLowerCase()) || i.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchStatus && matchUrgency && matchSearch;
  });

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIncident) return;
    updateStatusMutation.mutate({
      id: editingIncident.id,
      status: newStatus,
      note: statusNote,
      agentName: user?.name || "Agent Voirie"
    });
    setEditingIncident(null);
    setStatusNote('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] flex">
      {/* Sidebar Navigation - Primary Brand Blue */}
      <aside className="w-64 bg-[#1E5EFF] text-white flex flex-col h-screen sticky top-0 justify-between p-4 shrink-0 select-none shadow-xl">
        <div>
          {/* Logo */}
          <div className="flex flex-col items-center justify-center px-3 py-4 mb-6 border-b border-white/10 bg-white/10 rounded-2xl">
            <XalatLogo size="md" showSubtitle={false} />
            <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider mt-1.5 bg-white/20 px-2.5 py-0.5 rounded-full">
              Portail Mairie
            </span>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5 text-xs font-medium">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
              { id: 'incidents', label: 'Gestion Incidents', icon: FileText, badge: incidents.length },
              { id: 'map_heatmap', label: 'Carte & Heatmap', icon: MapIcon },
              { id: 'analytics', label: 'Rapports & Stats', icon: ChartIcon },
              { id: 'chat_support', label: 'Messagerie Support', icon: MessageSquare },
              { id: 'users', label: 'Utilisateurs', icon: Users },
              { id: 'categories', label: 'Catégories', icon: Grid },
              { id: 'reports', label: 'Export PDF / Excel', icon: Download },
              { id: 'settings', label: 'Paramètres', icon: Settings },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[18px] transition-all duration-150 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-sm font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-[#1E5EFF]' : 'bg-white/20 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card bottom */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-[18px]">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"} 
              alt={user?.name} 
              className="w-10 h-10 rounded-full object-cover border border-white/30" 
            />
            <div className="min-w-0 flex-1">
              <h5 className="font-semibold text-xs truncate text-white">{user?.name}</h5>
              <p className="text-[10px] font-medium text-white/80 truncate">
                {user?.role === 'admin' ? 'Admin Principal' : 'AgentVoirie'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Body Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white backdrop-blur-md border-b border-[#E5E7EB] px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un incident, référence, citoyen..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] rounded-[18px] text-xs text-[#1F2937] border border-[#E5E7EB] focus:border-[#1E5EFF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-full bg-slate-100 text-[#6B7280] relative hover:bg-slate-200 transition">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 bg-[#EF4444] rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-5 py-2.5 bg-[#1E5EFF] text-white rounded-[18px] font-medium text-xs shadow-md flex items-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Nouvel Export</span>
            </button>
          </div>
        </header>

        {/* Content Router */}
        <main className="p-8 flex-1 overflow-y-auto space-y-8">
          {adminTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1E5EFF]/10 rounded-[14px] flex items-center justify-center text-[#1E5EFF]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] font-medium">Signalements</p>
                    <h3 className="text-2xl font-bold text-[#1F2937]">{stats?.totalIncidents || incidents.length}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-[14px] flex items-center justify-center text-[#F59E0B]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] font-medium">En attente</p>
                    <h3 className="text-2xl font-bold text-[#1F2937]">{stats?.pendingIncidents || 1}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-[14px] flex items-center justify-center text-[#34A853]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] font-medium">Résolus</p>
                    <h3 className="text-2xl font-bold text-[#1F2937]">{stats?.resolvedIncidents || 8}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[18px] border border-[#E5E7EB] shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-[14px] flex items-center justify-center text-[#EF4444]">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280] font-medium">Urgences</p>
                    <h3 className="text-2xl font-bold text-[#1F2937]">
                      {incidents.filter(i => i.urgency === 'Critique').length || 2}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Statistics & Recent Split */}
              <div className="grid grid-cols-12 gap-8">
                {/* Category Breakdown (7 cols) */}
                <div className="col-span-12 lg:col-span-7 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs flex flex-col">
                  <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
                    <h2 className="font-bold text-lg text-[#1F2937]">Statistiques par Catégorie</h2>
                    <select className="text-xs bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[#1F2937] font-medium">
                      <option>7 derniers jours</option>
                      <option>30 derniers jours</option>
                    </select>
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-[#1F2937]">
                          <span className="flex items-center gap-2">💧 Eau & Assainissement</span>
                          <span className="font-bold">45%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1E5EFF] rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-[#1F2937]">
                          <span className="flex items-center gap-2">⚡ Électricité</span>
                          <span className="font-bold">28%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#34A853] rounded-full" style={{ width: '28%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-[#1F2937]">
                          <span className="flex items-center gap-2">🛣️ Voirie & Routes</span>
                          <span className="font-bold">15%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-[#1F2937]">
                          <span className="flex items-center gap-2">♻️ Déchets & Propreté</span>
                          <span className="font-bold">12%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4 pt-6 border-t border-[#E5E7EB] text-center">
                      <div>
                        <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Temps Moyen</p>
                        <p className="text-lg font-bold text-[#1F2937] mt-1">4.2h</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Satisfaction</p>
                        <p className="text-lg font-bold text-[#34A853] mt-1">92%</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Agents actifs</p>
                        <p className="text-lg font-bold text-[#1E5EFF] mt-1">24</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incidents Récents (5 cols) */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-[18px] border border-[#E5E7EB] shadow-xs flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
                    <h2 className="font-bold text-lg text-[#1F2937]">Incidents Récents</h2>
                    <button onClick={() => setAdminTab('incidents')} className="text-[#1E5EFF] text-xs font-semibold hover:underline">
                      Voir tout
                    </button>
                  </div>

                  <div className="flex-1 divide-y divide-slate-100 overflow-y-auto max-h-[420px]">
                    {filteredIncidents.slice(0, 5).map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => {
                          setEditingIncident(inc);
                          setNewStatus(inc.status);
                        }}
                        className="p-4 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-[12px] flex-shrink-0 flex items-center justify-center font-bold ${
                            inc.urgency === 'Critique' ? 'bg-rose-100 text-[#EF4444]' :
                            inc.status === 'Résolu' ? 'bg-emerald-100 text-[#34A853]' : 'bg-amber-100 text-[#F59E0B]'
                          }`}>
                            {inc.title.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-semibold text-[#1F2937] group-hover:text-[#1E5EFF] transition-colors truncate">
                                {inc.title}
                              </h4>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0 ${
                                inc.urgency === 'Critique' ? 'bg-rose-100 text-[#EF4444]' :
                                inc.status === 'Résolu' ? 'bg-emerald-100 text-[#34A853]' : 'bg-blue-100 text-[#1E5EFF]'
                              }`}>
                                {inc.urgency === 'Critique' ? 'CRITIQUE' : inc.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#6B7280] mt-0.5 truncate">
                              📍 {inc.location.address} • {inc.createdAt}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'incidents' && (
            <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937]">Gestion complète des signalements</h2>
                  <p className="text-xs text-[#6B7280]">Filtrage direct et mises à jour en temps réel via REST API</p>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <select
                    value={filterCat}
                    onChange={(e) => setFilterCat(e.target.value)}
                    className="px-3 py-2 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] text-[#1F2937] font-medium"
                  >
                    <option value="Tous">Toutes Catégories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] text-[#1F2937] font-medium"
                  >
                    <option value="Tous">Tous Statuts</option>
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Résolu">Résolu</option>
                  </select>

                  <select
                    value={filterUrgency}
                    onChange={(e) => setFilterUrgency(e.target.value)}
                    className="px-3 py-2 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] text-[#1F2937] font-medium"
                  >
                    <option value="Toutes">Toutes Urgences</option>
                    <option value="Faible">Faible</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Critique">Critique</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-[#E5E7EB] rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#6B7280] font-bold uppercase border-b border-[#E5E7EB]">
                    <tr>
                      <th className="p-3">Ref</th>
                      <th className="p-3">Citoyen</th>
                      <th className="p-3">Titre & Détail</th>
                      <th className="p-3">Catégorie</th>
                      <th className="p-3">Urgence</th>
                      <th className="p-3">Statut</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] font-medium">
                    {filteredIncidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-[#F8FAFC] transition">
                        <td className="p-3 font-bold text-[#1E5EFF]">{inc.reference}</td>
                        <td className="p-3">
                          <p className="font-bold text-[#1F2937]">{inc.reporterName}</p>
                          <p className="text-[10px] text-slate-400">{inc.reporterPhone || 'Non renseigné'}</p>
                        </td>
                        <td className="p-3 max-w-[220px]">
                          <p className="font-bold text-[#1F2937] truncate">{inc.title}</p>
                          <p className="text-[10px] text-[#6B7280] truncate">📍 {inc.location.address}</p>
                        </td>
                        <td className="p-3 font-semibold text-[#1F2937]">{inc.category}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${
                            inc.urgency === 'Critique' ? 'bg-[#EF4444]' :
                            inc.urgency === 'Moyenne' ? 'bg-[#F59E0B]' : 'bg-[#34A853]'
                          }`}>
                            {inc.urgency}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            inc.status === 'Résolu' ? 'bg-emerald-100 text-[#34A853]' :
                            inc.status === 'En cours' ? 'bg-blue-100 text-[#1E5EFF]' : 'bg-amber-100 text-[#F59E0B]'
                          }`}>
                            {inc.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 text-[10px]">{inc.createdAt}</td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setEditingIncident(inc);
                              setNewStatus(inc.status);
                            }}
                            className="px-3 py-1.5 bg-[#1E5EFF] text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-xs transition"
                          >
                            Changer Statut
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'map_heatmap' && (
            <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs space-y-4 h-[calc(100vh-140px)] flex flex-col">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937]">Carte Cartographique & Heatmap du Sénégal</h2>
                  <p className="text-xs text-[#6B7280]">Visualisation dynamique des zones à risque d'incidents</p>
                </div>
              </div>
              <div className="flex-1 w-full rounded-2xl overflow-hidden shadow-inner border border-[#E5E7EB]">
                <IncidentMap incidents={incidents} />
              </div>
            </div>
          )}

          {adminTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1F2937]">Statistiques & Analyse des données</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Incidents by Category */}
                <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs">
                  <h3 className="font-bold text-sm text-[#1F2937] mb-4">Incidents par catégorie</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.incidentsByCategory || []}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#1E5EFF" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Monthly Trend */}
                <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs">
                  <h3 className="font-bold text-sm text-[#1F2937] mb-4">Évolution mensuelle des signalements</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats?.monthlyTrend || []}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="signalements" stroke="#1E5EFF" fill="#1E5EFF" fillOpacity={0.2} />
                        <Area type="monotone" dataKey="resolus" stroke="#34A853" fill="#34A853" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'chat_support' && (
            <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs h-[550px] flex flex-col">
              <h2 className="text-xl font-bold text-[#1F2937] mb-4">Console Support Agent - Dialogue direct avec Ousmane Diallo</h2>
              <div className="flex-1 border border-[#E5E7EB] rounded-2xl p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
                <div className="p-3 bg-blue-100 text-xs rounded-xl max-w-md">
                  <p className="font-bold text-[#1E5EFF]">Ousmane Diallo (Citoyen)</p>
                  <p className="mt-1 text-[#1F2937]">Bonjour l'équipe support, le nid-de-poule de l'Avenue Lamine Guèye pose de vrais soucis aux automobilistes.</p>
                </div>
                <div className="p-3 bg-[#1E5EFF] text-white text-xs rounded-xl max-w-md ml-auto">
                  <p className="font-bold text-blue-200">Fatou Ndiaye (Agent Support)</p>
                  <p className="mt-1">Bonjour Ousmane, l'équipe voirie intervient actuellement avec les camions de colmatage.</p>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'users' && (
            <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#1E5EFF]" />
                    <span>Gestion des Utilisateurs Citoyens & Administrateurs</span>
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Gérez la base des citoyens inscrits sur l'application XALAT-CI, modifiez les rôles ou suspendez des comptes.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2.5 bg-[#1E5EFF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Nouveau Citoyen / Admin</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F8FAFC] p-3 rounded-2xl border border-[#E5E7EB]">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Rechercher nom, email, téléphone..."
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#E5E7EB] text-xs font-medium focus:ring-2 focus:ring-[#1E5EFF]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#6B7280] shrink-0">Rôle :</span>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5E7EB] text-xs font-semibold"
                  >
                    <option value="Tous">Tous les rôles</option>
                    <option value="citoyen">Citoyen</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#6B7280] shrink-0">Statut :</span>
                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E5E7EB] text-xs font-semibold"
                  >
                    <option value="Tous">Tous les statuts</option>
                    <option value="actif">Actif</option>
                    <option value="suspendu">Suspendu</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto border border-[#E5E7EB] rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#6B7280] font-bold uppercase border-b border-[#E5E7EB]">
                    <tr>
                      <th className="p-3">Citoyen / Nom</th>
                      <th className="p-3">Email & Téléphone</th>
                      <th className="p-3">Commune</th>
                      <th className="p-3">Rôle</th>
                      <th className="p-3">Statut</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] font-medium">
                    {users
                      .filter(u => {
                        const q = userSearchTerm.toLowerCase();
                        const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q)) || (u.commune && u.commune.toLowerCase().includes(q));
                        const matchRole = userRoleFilter === 'Tous' || u.role === userRoleFilter || (userRoleFilter === 'admin' && (u.role === 'admin' || u.role === 'agent'));
                        const matchStatus = userStatusFilter === 'Tous' || u.status === userStatusFilter || (!u.status && userStatusFilter === 'actif');
                        return matchQ && matchRole && matchStatus;
                      })
                      .map((u) => {
                        const isUserActive = u.status !== 'suspendu';
                        return (
                          <tr key={u.id} className="hover:bg-[#F8FAFC] transition">
                            <td className="p-3 font-bold text-[#1F2937] flex items-center gap-3">
                              <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-[#E5E7EB] shrink-0" />
                              <div>
                                <p className="font-bold text-[#1F2937]">{u.name}</p>
                                <p className="text-[10px] text-[#6B7280] font-normal">{u.badgeTitle || 'Citoyen Registré'}</p>
                              </div>
                            </td>
                            <td className="p-3">
                              <p className="font-semibold text-[#1F2937]">{u.email}</p>
                              <p className="text-[11px] text-[#6B7280]">{u.phone}</p>
                            </td>
                            <td className="p-3 text-[#1F2937]">
                              {u.commune || 'Dakar Plateau, Dakar'}
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                u.role === 'admin' || u.role === 'agent' 
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                  : 'bg-emerald-100 text-[#34A853] border border-emerald-200'
                              }`}>
                                {u.role === 'admin' || u.role === 'agent' ? 'Admin Mairie' : 'Citoyen'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5 ${
                                isUserActive 
                                  ? 'bg-emerald-50 text-[#34A853] border border-emerald-200' 
                                  : 'bg-rose-50 text-[#EF4444] border border-rose-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isUserActive ? 'bg-[#34A853]' : 'bg-[#EF4444]'}`}></span>
                                {isUserActive ? 'Actif' : 'Suspendu'}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button
                                onClick={() => {
                                  updateUserStatusMutation.mutate({ id: u.id, status: isUserActive ? 'suspendu' : 'actif' });
                                }}
                                className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition inline-flex items-center gap-1 ${
                                  isUserActive 
                                    ? 'bg-amber-50 text-[#F59E0B] border border-amber-200 hover:bg-amber-100' 
                                    : 'bg-emerald-50 text-[#34A853] border border-emerald-200 hover:bg-emerald-100'
                                }`}
                                title={isUserActive ? "Suspendre le compte" : "Réactiver le compte"}
                              >
                                {isUserActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                <span>{isUserActive ? 'Suspendre' : 'Activer'}</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (confirm(`Voulez-vous vraiment supprimer le compte de ${u.name} ?`)) {
                                    deleteUserMutation.mutate(u.id);
                                  }
                                }}
                                className="px-2 py-1.5 bg-rose-50 text-[#EF4444] border border-rose-200 hover:bg-rose-100 rounded-xl font-bold text-[11px] transition"
                                title="Supprimer l'utilisateur"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Add User Modal */}
              {showAddUserModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-[28px] max-w-lg w-full p-6 shadow-2xl border border-[#E5E7EB] space-y-4">
                    <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
                      <h3 className="font-bold text-base text-[#1F2937] flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-[#1E5EFF]" />
                        <span>Créer un compte Citoyen / Admin</span>
                      </h3>
                      <button
                        onClick={() => setShowAddUserModal(false)}
                        className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                      >
                        ✕
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        createUserMutation.mutate({
                          name: newUserName,
                          email: newUserEmail,
                          phone: newUserPhone,
                          role: newUserRole,
                          commune: newUserCommune
                        }, {
                          onSuccess: () => {
                            setShowAddUserModal(false);
                            setNewUserName('');
                            setNewUserEmail('');
                            setNewUserPhone('');
                          }
                        });
                      }}
                      className="space-y-4 text-xs font-semibold"
                    >
                      <div>
                        <label className="block text-[#1F2937] mb-1">Nom complet</label>
                        <input
                          type="text"
                          required
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="Ex: Awa Mbaye"
                          className="w-full px-3.5 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#1E5EFF]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#1F2937] mb-1">Email</label>
                          <input
                            type="email"
                            required
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="awa.mbaye@xalat.sn"
                            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#1E5EFF]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#1F2937] mb-1">Téléphone</label>
                          <input
                            type="tel"
                            required
                            value={newUserPhone}
                            onChange={(e) => setNewUserPhone(e.target.value)}
                            placeholder="+221 77 000 00 00"
                            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#1E5EFF]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#1F2937] mb-1">Rôle</label>
                          <select
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value as 'citoyen' | 'admin')}
                            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#1E5EFF]"
                          >
                            <option value="citoyen">Citoyen</option>
                            <option value="admin">Administrateur Mairie</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[#1F2937] mb-1">Commune</label>
                          <input
                            type="text"
                            required
                            value={newUserCommune}
                            onChange={(e) => setNewUserCommune(e.target.value)}
                            placeholder="Dakar Plateau, Dakar"
                            className="w-full px-3.5 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] focus:ring-2 focus:ring-[#1E5EFF]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-[#E5E7EB]">
                        <button
                          type="button"
                          onClick={() => setShowAddUserModal(false)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#1F2937] rounded-xl font-bold"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#1E5EFF] hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {adminTab === 'reports' && (
            <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Exportation de Rapports Municipaux</h2>
              <p className="text-xs text-[#6B7280]">Générez des rapports synthétiques mensuels pour les conseils municipaux.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="p-6 border border-[#E5E7EB] rounded-[20px] bg-[#F8FAFC] text-center space-y-3">
                  <FileText className="w-12 h-12 text-[#1E5EFF] mx-auto" />
                  <h4 className="font-bold text-sm text-[#1F2937]">Rapport Synthétique PDF</h4>
                  <p className="text-xs text-[#6B7280]">Comprenant les heatmaps, les temps de résolution et les métriques.</p>
                  <button 
                    onClick={() => handleDownloadExport('pdf')}
                    className="py-3 px-6 bg-[#1E5EFF] text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md transition cursor-pointer"
                  >
                    Télécharger le PDF
                  </button>
                </div>

                <div className="p-6 border border-[#E5E7EB] rounded-[20px] bg-[#F8FAFC] text-center space-y-3">
                  <Download className="w-12 h-12 text-[#34A853] mx-auto" />
                  <h4 className="font-bold text-sm text-[#1F2937]">Export Données Brutes Excel</h4>
                  <p className="text-xs text-[#6B7280]">Ensemble complet des enregistrements incidents avec GPS.</p>
                  <button 
                    onClick={() => handleDownloadExport('excel')}
                    className="py-3 px-6 bg-[#34A853] text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-md transition cursor-pointer"
                  >
                    Télécharger l'Excel (.csv)
                  </button>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'categories' && (
            <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Catégories d'incidents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="p-4 border border-[#E5E7EB] rounded-[20px] bg-[#F8FAFC] space-y-2">
                    <span className="text-xs font-bold text-[#1E5EFF]">{c.count} incidents signalés</span>
                    <h4 className="font-bold text-sm text-[#1F2937]">{c.name}</h4>
                    <p className="text-[11px] text-[#6B7280]">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === 'settings' && (
            <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Paramètres & Sécurité du système</h2>
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-[#F8FAFC] rounded-xl flex justify-between items-center border border-[#E5E7EB]">
                  <div>
                    <h5 className="font-bold text-[#1F2937]">Authentification JWT & Protection CSRF</h5>
                    <p className="text-[#6B7280]">Tokens de rafraîchissement automatiques activés.</p>
                  </div>
                  <span className="text-[#34A853] font-bold">Actif</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Status Change Modal */}
      {editingIncident && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 space-y-4 border border-[#E5E7EB] shadow-2xl">
            <h3 className="font-bold text-base text-[#1F2937]">
              Mettre à jour le statut : {editingIncident.reference}
            </h3>
            
            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#1F2937] mb-1">
                  Sélectionnez le nouveau statut
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as IncidentStatus)}
                  className="w-full p-3 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] font-bold text-[#1F2937]"
                >
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours de traitement</option>
                  <option value="Résolu">Résolu (Intervention terminée)</option>
                  <option value="Rejeté">Rejeté / Hors périmètre</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1F2937] mb-1">
                  Note d'intervention ou commentaire d'agent
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Ex: Équipe technique dépêchée avec camion d'asphalte..."
                  className="w-full p-3 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] font-medium text-[#1F2937]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingIncident(null)}
                  className="flex-1 py-3 bg-slate-100 text-[#1F2937] rounded-xl font-bold hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 py-3 bg-[#1E5EFF] text-white rounded-xl font-bold hover:bg-blue-700 shadow-md"
                >
                  {updateStatusMutation.isPending ? 'Enregistrement...' : 'Confirmer la mise à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 space-y-5 border border-[#E5E7EB] shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E5EFF] flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1F2937]">Nouvel Export de Données Municipales</h3>
                  <p className="text-[11px] text-[#6B7280]">Exportation sécurisée des signalements XALAT-CI</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              {/* Format Selection */}
              <div>
                <label className="block text-[#1F2937] mb-2 font-bold">Format d'exportation :</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'csv', label: 'CSV', sub: 'Tableur', icon: FileSpreadsheet },
                    { id: 'excel', label: 'Excel', sub: 'Feuille .csv', icon: Download },
                    { id: 'json', label: 'JSON', sub: 'API Raw', icon: FileText },
                    { id: 'pdf', label: 'PDF', sub: 'Imprimable', icon: Printer }
                  ].map((fmt) => {
                    const FmtIcon = fmt.icon;
                    const isSel = exportFormat === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id as any)}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                          isSel
                            ? 'bg-blue-50/80 border-[#1E5EFF] text-[#1E5EFF] ring-2 ring-blue-100 font-bold'
                            : 'bg-[#F8FAFC] border-[#E5E7EB] text-[#1F2937] hover:bg-slate-100'
                        }`}
                      >
                        <FmtIcon className="w-5 h-5" />
                        <div>
                          <p className="text-xs">{fmt.label}</p>
                          <p className="text-[9px] font-normal opacity-70">{fmt.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[#1F2937] mb-1">Filtrer par Catégorie :</label>
                  <select
                    value={exportCategory}
                    onChange={(e) => setExportCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] font-medium text-[#1F2937]"
                  >
                    <option value="Tous">Toutes les catégories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#1F2937] mb-1">Filtrer par Statut :</label>
                  <select
                    value={exportStatus}
                    onChange={(e) => setExportStatus(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] font-medium text-[#1F2937]"
                  >
                    <option value="Tous">Tous les statuts</option>
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Résolu">Résolu</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-[#1E5EFF] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {incidents.filter(inc => (exportCategory === 'Tous' || inc.category === exportCategory) && (exportStatus === 'Tous' || inc.status === exportStatus)).length} signalements prêts pour exportation
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#1F2937] rounded-xl font-bold text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDownloadExport(exportFormat, exportCategory, exportStatus);
                  setShowExportModal(false);
                }}
                className="px-5 py-2.5 bg-[#1E5EFF] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Générer et Télécharger</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F2937] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#34A853] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
