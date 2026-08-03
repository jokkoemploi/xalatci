import React, { useState } from 'react';
import { useViewStore } from '../../../store/useViewStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { XalatLogo } from '../../common/XalatLogo';
import { 
  useIncidents, 
  useIncidentDetail, 
  useAddComment 
} from '../../../hooks/useIncidents';
import { 
  useNotifications, 
  useMarkNotificationsRead, 
  useChatMessages, 
  useSendMessage, 
  useBadges, 
  useHistoryLogs 
} from '../../../hooks/useAppData';

import { 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Flame, 
  Award, 
  Eye, 
  Sparkles, 
  User, 
  Bell, 
  Globe, 
  Sun, 
  Shield, 
  HelpCircle, 
  LogOut, 
  MessageSquare,
  FileText,
  ChevronRight,
  Info,
  MapPin,
  Tag,
  AlertCircle
} from 'lucide-react';

// Screen 16: Mes signalements
export const Screen16_MesSignalements: React.FC = () => {
  const { setMobileScreen, setSelectedIncidentId } = useViewStore();
  const { data: incidents = [] } = useIncidents();
  const [activeTab, setActiveTab] = useState<'Tous' | 'En attente' | 'En cours' | 'Résolus'>('Tous');

  const filtered = incidents.filter(inc => {
    if (activeTab === 'Tous') return true;
    if (activeTab === 'En attente') return inc.status === 'En attente';
    if (activeTab === 'En cours') return inc.status === 'En cours';
    if (activeTab === 'Résolus') return inc.status === 'Résolu';
    return true;
  });

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between overflow-y-auto">
      <div className="p-5">
        <div className="flex items-center gap-3 pt-2 mb-4">
          <button onClick={() => setMobileScreen(8)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-[#1F2937]">Mes signalements</h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white p-1 rounded-2xl border border-[#E5E7EB] mb-4 text-xs font-semibold">
          {(['Tous', 'En attente', 'En cours', 'Résolus'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-center transition ${
                activeTab === tab
                  ? 'bg-[#1E5EFF] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Incidents List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[20px] p-6 text-slate-400 border border-[#E5E7EB]">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50 text-slate-300" />
              <p className="font-semibold text-xs text-[#6B7280]">Aucun signalement trouvé</p>
            </div>
          ) : (
            filtered.map((inc) => (
              <div
                key={inc.id}
                onClick={() => {
                  setSelectedIncidentId(inc.id);
                  setMobileScreen(17);
                }}
                className="bg-white p-4 rounded-[20px] border border-[#E5E7EB] shadow-xs cursor-pointer hover:border-[#1E5EFF] transition space-y-3"
              >
                <div className="flex gap-3">
                  <img 
                    src={inc.photoUrl} 
                    alt={inc.title} 
                    className="w-20 h-20 rounded-[16px] object-cover flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inc.status === 'Résolu' ? 'bg-emerald-100 text-[#34A853]' :
                        inc.status === 'En cours' ? 'bg-blue-100 text-[#1E5EFF]' : 'bg-amber-100 text-[#F59E0B]'
                      }`}>
                        {inc.status}
                      </span>
                      <span className="text-[10px] text-slate-400">{inc.createdAt.split(' à ')[0]}</span>
                    </div>
                    <h4 className="font-bold text-xs text-[#1F2937] line-clamp-1">{inc.title}</h4>
                    <p className="text-[11px] text-[#6B7280] line-clamp-1 mt-0.5">📍 {inc.location.address}</p>
                    <p className="text-[10px] text-[#1E5EFF] font-semibold mt-1">Ref: {inc.reference}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Screen 17: Détail d'un signalement
export const Screen17_DetailSignalement: React.FC = () => {
  const { setMobileScreen, selectedIncidentId } = useViewStore();
  const { user } = useAuthStore();
  const { data: incident } = useIncidentDetail(selectedIncidentId);
  const [newComment, setNewComment] = useState('');
  const addCommentMutation = useAddComment();

  if (!incident) {
    return (
      <div className="h-full bg-[#F8FAFC] p-6 text-center flex flex-col justify-center">
        <p className="text-xs text-[#6B7280]">Chargement du signalement...</p>
      </div>
    );
  }

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addCommentMutation.mutate({
      id: incident.id,
      text: newComment,
      authorName: user?.name || "Ousmane Diallo",
      authorRole: "citoyen"
    });
    setNewComment('');
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Banner Image */}
        <div className="relative h-56 w-full">
          <img 
            src={incident.photoUrl} 
            alt={incident.title} 
            className="w-full h-full object-cover" 
          />
          <button
            onClick={() => setMobileScreen(16)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="absolute bottom-4 left-4 bg-[#1E5EFF] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
            Ref: {incident.reference}
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              incident.status === 'Résolu' ? 'bg-emerald-100 text-[#34A853]' :
              incident.status === 'En cours' ? 'bg-blue-100 text-[#1E5EFF]' : 'bg-amber-100 text-[#F59E0B]'
            }`}>
              {incident.status}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${
              incident.urgency === 'Critique' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'
            }`}>
              Urgence {incident.urgency}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#1F2937] leading-tight">{incident.title}</h2>
            <p className="text-xs text-[#6B7280] mt-1">Signalé le {incident.createdAt}</p>
          </div>

          <div className="bg-white p-4 rounded-[18px] border border-[#E5E7EB] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#1F2937] font-semibold">
              <MapPin className="w-4 h-4 text-[#1E5EFF]" />
              <span>{incident.location.address}</span>
            </div>
            <div className="flex items-center gap-2 text-[#1F2937] font-semibold">
              <Tag className="w-4 h-4 text-[#34A853]" />
              <span>Catégorie: {incident.category}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-[18px] border border-[#E5E7EB]">
            <h4 className="font-bold text-xs text-[#1F2937] mb-2">Description complète</h4>
            <p className="text-xs text-[#6B7280] leading-relaxed">{incident.description}</p>
          </div>

          {/* Comments section */}
          {incident.comments.length > 0 && (
            <div className="bg-white p-4 rounded-[18px] border border-[#E5E7EB] space-y-3">
              <h4 className="font-bold text-xs text-[#1F2937]">Commentaires & Échanges</h4>
              {incident.comments.map((c) => (
                <div key={c.id} className="p-3 bg-[#F8FAFC] rounded-xl text-xs space-y-1 border border-[#E5E7EB]">
                  <div className="flex justify-between font-bold text-[11px]">
                    <span className={c.authorRole === 'agent' ? 'text-[#1E5EFF]' : 'text-[#1F2937]'}>
                      {c.authorName} ({c.authorRole})
                    </span>
                    <span className="text-slate-400 font-normal">{c.createdAt}</span>
                  </div>
                  <p className="text-[#6B7280]">{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 bg-white border-t border-[#E5E7EB]">
        <button
          onClick={() => setMobileScreen(18)}
          className="w-full py-3.5 bg-[#1E5EFF] text-white font-bold rounded-[18px] shadow-md hover:bg-blue-700 transition text-xs flex items-center justify-center gap-2"
        >
          <span>Voir l'évolution du signalement</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Screen 18: Évolution / Suivi timeline
export const Screen18_EvolutionSuivi: React.FC = () => {
  const { setMobileScreen, selectedIncidentId } = useViewStore();
  const { data: incident } = useIncidentDetail(selectedIncidentId);

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 pt-2 mb-6">
          <button onClick={() => setMobileScreen(17)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Évolution du signalement</h2>
            <p className="text-xs text-[#6B7280]">Ref: {incident?.reference || "XD-0004-05-24"}</p>
          </div>
        </div>

        {/* Vertical Timeline Stepper */}
        <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] shadow-xs space-y-6">
          {(incident?.timeline || [
            { id: 't1', title: 'Signalement envoyé', description: 'Transmis à la mairie', date: '12/05/2026 à 14:20', status: 'completed' },
            { id: 't2', title: 'Pris en charge', description: 'Assigné à l’agent voirie', date: '12/05/2026 à 15:10', status: 'completed' },
            { id: 't3', title: 'En cours de traitement', description: 'Équipe technique sur le terrain', date: '12/05/2026 à 16:10', status: 'current' },
            { id: 't4', title: 'Résolution & Clôture', description: 'Inspection finale', date: 'En attente', status: 'upcoming' }
          ]).map((step, idx) => (
            <div key={step.id} className="flex gap-4 relative">
              {idx < (incident?.timeline.length || 4) - 1 && (
                <div className={`absolute left-4 top-8 bottom-0 w-0.5 ${
                  step.status === 'completed' ? 'bg-[#34A853]' : 'bg-[#E5E7EB]'
                }`}></div>
              )}

              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                step.status === 'completed' ? 'bg-[#34A853] text-white' :
                step.status === 'current' ? 'bg-[#1E5EFF] text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>

              <div>
                <h4 className="font-bold text-xs text-[#1F2937]">{step.title}</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">{step.description}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={() => setMobileScreen(16)}
          className="w-full py-3.5 bg-slate-200 text-[#1F2937] font-bold rounded-[18px] text-xs hover:bg-slate-300 transition"
        >
          Retour à mes signalements
        </button>
      </div>
    </div>
  );
};

// Screen 19: Notifications
export const Screen19_Notifications: React.FC = () => {
  const { setMobileScreen, setSelectedIncidentId } = useViewStore();
  const { data: notifications = [] } = useNotifications();
  const markReadMutation = useMarkNotificationsRead();

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="flex items-center justify-between pt-2 mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileScreen(8)} className="text-slate-400">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-[#1F2937]">Notifications</h2>
          </div>
          <button
            onClick={() => markReadMutation.mutate()}
            className="text-[11px] font-bold text-[#1E5EFF]"
          >
            Tout marquer comme lu
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (notif.incidentId) {
                  setSelectedIncidentId(notif.incidentId);
                  setMobileScreen(17);
                }
              }}
              className={`p-4 rounded-[20px] border shadow-xs transition cursor-pointer flex gap-3 ${
                !notif.read ? 'bg-blue-50/70 border-blue-200' : 'bg-white border-[#E5E7EB]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#1E5EFF]/10 text-[#1E5EFF] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xs text-[#1F2937]">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400">{notif.date}</span>
                </div>
                <p className="text-[11px] text-[#6B7280] mt-1">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Screen 20: Messagerie / Support Chat
export const Screen20_Messagerie: React.FC = () => {
  const { setMobileScreen } = useViewStore();
  const { data: messages = [] } = useChatMessages();
  const sendMessageMutation = useSendMessage();
  const [text, setText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessageMutation.mutate(text);
    setText('');
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between">
      {/* Header */}
      <div className="bg-white p-4 border-b border-[#E5E7EB] flex items-center gap-3">
        <button onClick={() => setMobileScreen(8)} className="text-slate-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 rounded-full bg-[#1E5EFF] text-white flex items-center justify-center font-bold text-xs">
          X
        </div>
        <div>
          <h3 className="font-bold text-sm text-[#1F2937]">Support XALAT-CI</h3>
          <p className="text-[10px] text-[#34A853] font-semibold">En ligne • Mairie (Sénégal)</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {m.sender === 'agent' && (
              <img src={m.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"} alt="Agent" className="w-7 h-7 rounded-full object-cover mt-1" />
            )}
            <div
              className={`p-3 rounded-[16px] text-xs ${
                m.sender === 'user'
                  ? 'bg-[#1E5EFF] text-white rounded-tr-none'
                  : 'bg-white text-[#1F2937] border border-[#E5E7EB] rounded-tl-none'
              }`}
            >
              <p>{m.text}</p>
              <span className="text-[9px] opacity-70 block text-right mt-1">{m.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="bg-white p-3 border-t border-[#E5E7EB] flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 px-4 py-2.5 bg-[#F8FAFC] rounded-full text-xs text-[#1F2937] focus:outline-none border border-[#E5E7EB]"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-[#1E5EFF] text-white flex items-center justify-center hover:bg-blue-700 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// Screen 21: Badges
export const Screen21_Badges: React.FC = () => {
  const { setMobileScreen } = useViewStore();
  const { data: badges = [] } = useBadges();

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 pt-2 mb-6">
          <button onClick={() => setMobileScreen(22)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-[#1F2937]">Mes badges Citoyens</h2>
        </div>

        {/* Progress header */}
        <div className="bg-[#1E5EFF] text-white p-5 rounded-[20px] mb-6 shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">Prochain Badge</p>
          <h4 className="font-bold text-base mt-1">Ambassadeur Propreté</h4>
          <div className="w-full bg-white/20 h-2.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#34A853] h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-[10px] text-right mt-1 font-semibold">75% accompli</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-[20px] border text-center flex flex-col items-center ${
                b.unlocked ? 'bg-white border-[#E5E7EB] shadow-xs' : 'bg-slate-50 border-dashed border-[#E5E7EB] opacity-60'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-3 text-xl shadow-inner">
                🏆
              </div>
              <h4 className="font-bold text-xs text-[#1F2937]">{b.name}</h4>
              <p className="text-[10px] text-[#6B7280] mt-1 leading-tight">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Screen 22: Profil
export const Screen22_Profil: React.FC = () => {
  const { setMobileScreen } = useViewStore();
  const { user } = useAuthStore();

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="pt-2 mb-6 text-center">
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"} 
            alt={user?.name} 
            className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-[#1E5EFF]/20 shadow-md mb-3"
          />
          <h2 className="text-xl font-bold text-[#1F2937]">{user?.name}</h2>
          <p className="text-xs text-[#6B7280] font-medium">📍 {user?.commune}</p>
          <span className="inline-block bg-[#1E5EFF]/10 text-[#1E5EFF] text-[10px] font-bold px-3 py-1 rounded-full mt-2">
            {user?.badgeTitle}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-[18px] text-center border border-[#E5E7EB]">
            <span className="font-black text-lg text-[#1F2937]">{user?.stats.totalReports}</span>
            <p className="text-[10px] font-semibold text-slate-400">Signalements</p>
          </div>
          <div className="bg-white p-3 rounded-[18px] text-center border border-[#E5E7EB]">
            <span className="font-black text-lg text-[#34A853]">{user?.stats.resolvedCount}</span>
            <p className="text-[10px] font-semibold text-slate-400">Résolus</p>
          </div>
          <div className="bg-white p-3 rounded-[18px] text-center border border-[#E5E7EB]">
            <span className="font-black text-lg text-[#F59E0B]">{user?.stats.badgesCount}</span>
            <p className="text-[10px] font-semibold text-slate-400">Badges</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-[20px] border border-[#E5E7EB] divide-y divide-slate-100 text-xs font-semibold">
          <button onClick={() => setMobileScreen(16)} className="w-full p-4 flex justify-between items-center text-[#1F2937]">
            <span>Mes signalements</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button onClick={() => setMobileScreen(21)} className="w-full p-4 flex justify-between items-center text-[#1F2937]">
            <span>Mes badges</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button onClick={() => setMobileScreen(24)} className="w-full p-4 flex justify-between items-center text-[#1F2937]">
            <span>Historique d'activité</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button onClick={() => setMobileScreen(23)} className="w-full p-4 flex justify-between items-center text-[#1F2937]">
            <span>Paramètres</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Screen 23: Paramètres
export const Screen23_Parametres: React.FC = () => {
  const { setMobileScreen } = useViewStore();
  const { logout } = useAuthStore();

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 pt-2 mb-6">
          <button onClick={() => setMobileScreen(22)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-[#1F2937]">Paramètres</h2>
        </div>

        <div className="bg-white rounded-[20px] border border-[#E5E7EB] divide-y divide-slate-100 text-xs font-semibold">
          <div className="p-4 flex justify-between items-center">
            <span className="text-[#1F2937]">Thème de l'application</span>
            <span className="bg-blue-50 text-[#1E5EFF] px-2.5 py-1 rounded-full text-[11px] font-bold">Clair Institutionnel</span>
          </div>
          <button onClick={() => setMobileScreen(25)} className="w-full p-4 flex justify-between items-center text-[#1F2937]">
            <span>À propos de XALAT-CI</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="pb-4">
        <button
          onClick={() => {
            logout();
            setMobileScreen(5);
          }}
          className="w-full py-4 bg-red-50 text-[#EF4444] font-bold rounded-[18px] text-xs hover:bg-red-100 transition"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

// Screen 24: Historique
export const Screen24_Historique: React.FC = () => {
  const { setMobileScreen } = useViewStore();
  const { data: logs = [] } = useHistoryLogs();

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 pt-2 mb-6">
          <button onClick={() => setMobileScreen(22)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-[#1F2937]">Historique d'activité</h2>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-white p-4 rounded-[18px] border border-[#E5E7EB] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1E5EFF] flex items-center justify-center font-bold text-xs shrink-0">
                ⚡
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#1F2937]">{log.title}</h4>
                <p className="text-[11px] text-[#6B7280] mt-0.5">{log.description}</p>
                <span className="text-[9px] text-slate-400 font-semibold">{log.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Screen 25: À propos
export const Screen25_APropos: React.FC = () => {
  const { setMobileScreen } = useViewStore();

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 text-center">
      <div>
        <div className="pt-4 mb-6 flex flex-col items-center">
          <XalatLogo size="lg" showSubtitle={true} />
          <p className="text-[10px] text-slate-400 font-semibold mt-2 bg-slate-200/60 px-2.5 py-0.5 rounded-full">Version 1.0.0 (Sénégal)</p>
        </div>

        <p className="text-xs text-[#6B7280] leading-relaxed max-w-xs mx-auto mb-6">
          XALAT-CI est une plateforme citoyenne qui permet de signaler les incidents et d'améliorer nos villes ensemble.
        </p>

        <div className="bg-white rounded-[20px] border border-[#E5E7EB] divide-y divide-slate-100 text-xs font-semibold text-left">
          <div className="p-4 text-[#1F2937]">Conditions d'utilisation</div>
          <div className="p-4 text-[#1F2937]">Politique de confidentialité</div>
          <div className="p-4 text-[#1F2937]">Nous contacter</div>
        </div>
      </div>

      <div className="pb-4">
        <p className="text-[10px] text-slate-400">© 2026 XALAT-CI. Tous droits réservés.</p>
      </div>
    </div>
  );
};

// Screen 26: Thème de la plateforme
export const Screen26_ModeSombre: React.FC = () => {
  return (
    <div className="h-full bg-[#F8FAFC] text-[#1F2937] p-6 flex flex-col justify-between text-center">
      <div className="pt-8">
        <div className="w-16 h-16 bg-blue-50 text-[#1E5EFF] rounded-full flex items-center justify-center mx-auto mb-4">
          <Sun className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Thème Clair Institutionnel</h2>
        <p className="text-xs text-[#6B7280] max-w-xs mx-auto mt-2 leading-relaxed">
          XALAT-CI s'appuie sur une charte graphique unique, professionnelle et accessible pour tous les citoyens et agents territoriaux.
        </p>
      </div>

      <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] text-left space-y-3 my-auto shadow-sm">
        <h4 className="font-bold text-xs text-[#1E5EFF]">Spécifications Visuelles</h4>
        <div className="flex justify-between items-center text-xs">
          <span>Mode:</span>
          <span className="font-bold uppercase text-[#34A853]">Clair Unique</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span>Contraste WCAG:</span>
          <span className="font-bold text-[#1F2937]">Conforme AA</span>
        </div>
      </div>

      <div className="pb-4">
        <p className="text-[11px] text-slate-400">Plateforme de production XALAT-CI</p>
      </div>
    </div>
  );
};
