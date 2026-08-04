import React, { useState, useRef } from 'react';
import { useViewStore } from '../../../store/useViewStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useIncidents, useCreateIncident } from '../../../hooks/useIncidents';
import { useCategories } from '../../../hooks/useAppData';
import { IncidentMap } from '../../maps/IncidentMap';
import { LocationPickerMap } from '../../maps/LocationPickerMap';
import { 
  Plus, 
  Bell, 
  MapPin, 
  Camera, 
  Image as ImageIcon, 
  ChevronLeft, 
  Check, 
  Search, 
  Filter, 
  AlertTriangle,
  Route,
  Lightbulb,
  Trash2,
  Droplets,
  HeartPulse,
  ShieldAlert,
  Flame,
  MoreHorizontal,
  Navigation,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const categoryIconMap: Record<string, any> = {
  "Routes & Voirie": Route,
  "Éclairage public": Lightbulb,
  "Déchets & Propreté": Trash2,
  "Eau & Assainissement": Droplets,
  "Santé & Hygiène": HeartPulse,
  "Sécurité & Incivilités": ShieldAlert,
  "Catastrophe & Intempéries": Flame,
  "Autres incidents": MoreHorizontal
};

// Screen 8: Accueil / Dashboard citoyen
export const Screen8_AccueilDashboard: React.FC = () => {
  const { setMobileScreen, setSelectedIncidentId } = useViewStore();
  const { user } = useAuthStore();
  const { data: incidents = [], isLoading, isError, refetch } = useIncidents();

  const pending = incidents.filter(i => i.status === 'En attente').length;
  const inProgress = incidents.filter(i => i.status === 'En cours').length;
  const resolved = incidents.filter(i => i.status === 'Résolu').length;

  return (
    <div className="h-full bg-[#F8FAFC] overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="bg-white px-5 pt-4 pb-5 rounded-b-[24px] shadow-xs border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"} 
              alt={user?.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#1E5EFF]/20" 
            />
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Bonjour 👋</p>
              <h3 className="font-bold text-base text-[#1F2937] leading-tight">
                {user?.name || "Utilisateur XALAT"}
              </h3>
            </div>
          </div>
          <button 
            onClick={() => setMobileScreen(19)}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center relative hover:bg-slate-200 transition"
          >
            <Bell className="w-5 h-5 text-[#1F2937]" />
            <span className="w-2.5 h-2.5 bg-[#EF4444] rounded-full absolute top-2 right-2 ring-2 ring-white"></span>
          </button>
        </div>

        {/* Big Report Button */}
        <button
          onClick={() => setMobileScreen(10)}
          className="w-full bg-[#1E5EFF] text-white p-4 rounded-[20px] shadow-lg shadow-blue-500/10 flex items-center justify-between group transition transform active:scale-[0.99] hover:bg-blue-700"
        >
          <div className="text-left">
            <p className="text-[11px] uppercase font-bold tracking-wider text-blue-100">Action Citoyenne - Sénégal</p>
            <h4 className="font-bold text-base text-white">Signaler un incident</h4>
            <p className="text-[11px] text-blue-100/90 mt-0.5">Aidez à améliorer votre cadre de vie</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Mes signalements stats summary */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-[#1F2937]">Mes signalements</h4>
            <button onClick={() => setMobileScreen(16)} className="text-xs font-semibold text-[#1E5EFF]">
              Voir tout &gt;
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-[18px] border border-[#E5E7EB] text-center shadow-xs">
              <span className="text-xl font-black text-[#F59E0B]">{isLoading ? "-" : pending}</span>
              <p className="text-[11px] font-semibold text-[#6B7280] mt-0.5">En attente</p>
            </div>
            <div className="bg-white p-3 rounded-[18px] border border-[#E5E7EB] text-center shadow-xs">
              <span className="text-xl font-black text-[#1E5EFF]">{isLoading ? "-" : inProgress}</span>
              <p className="text-[11px] font-semibold text-[#6B7280] mt-0.5">En cours</p>
            </div>
            <div className="bg-white p-3 rounded-[18px] border border-[#E5E7EB] text-center shadow-xs">
              <span className="text-xl font-black text-[#34A853]">{isLoading ? "-" : resolved}</span>
              <p className="text-[11px] font-semibold text-[#6B7280] mt-0.5">Résolus</p>
            </div>
          </div>
        </div>

        {/* Carte des incidents section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-[#1F2937]">Carte des incidents (Sénégal)</h4>
            <button onClick={() => setMobileScreen(9)} className="text-xs font-semibold text-[#1E5EFF]">
              Agrandir &gt;
            </button>
          </div>
          <div className="h-44 w-full rounded-[20px] overflow-hidden shadow-xs border border-[#E5E7EB]">
            <IncidentMap 
              incidents={incidents} 
              onSelectIncident={(inc) => {
                setSelectedIncidentId(inc.id);
                setMobileScreen(17);
              }} 
            />
          </div>
        </div>

        {/* Recent Incidents List */}
        <div>
          <h4 className="font-bold text-sm text-[#1F2937] mb-3">Signalements récents</h4>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white p-3 rounded-[18px] animate-pulse flex items-center gap-3">
                  <div className="w-16 h-16 bg-slate-200 rounded-[14px]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-4 bg-rose-50 text-[#EF4444] rounded-[18px] text-xs flex items-center justify-between">
              <span>Erreur de chargement des signalements</span>
              <button onClick={() => refetch()} className="underline font-bold">Réessayer</button>
            </div>
          ) : incidents.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-[18px] text-[#6B7280] text-xs font-medium border border-[#E5E7EB]">
              Aucun incident signalé pour le moment
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.slice(0, 3).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncidentId(inc.id);
                    setMobileScreen(17);
                  }}
                  className="bg-white p-3 rounded-[18px] border border-[#E5E7EB] shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#1E5EFF] transition"
                >
                  <img 
                    src={inc.photoUrl} 
                    alt={inc.title} 
                    className="w-16 h-16 rounded-[14px] object-cover flex-shrink-0" 
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
                    <h5 className="font-bold text-xs text-[#1F2937] truncate">{inc.title}</h5>
                    <p className="text-[11px] text-[#6B7280] truncate mt-0.5">📍 {inc.location.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Screen 9: Carte des incidents
export const Screen9_CarteIncidents: React.FC = () => {
  const { setMobileScreen, setSelectedIncidentId } = useViewStore();
  const { data: incidents = [] } = useIncidents();
  const { data: categories = [] } = useCategories();
  const [selectedCat, setSelectedCat] = useState('Tous');
  const [search, setSearch] = useState('');

  const filtered = incidents.filter(i => {
    const matchCat = selectedCat === 'Tous' || i.category === selectedCat;
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.location.address.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col relative">
      {/* Top Search Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 space-y-2">
        <div className="bg-white rounded-[18px] shadow-lg border border-[#E5E7EB] p-2 flex items-center gap-2">
          <button onClick={() => setMobileScreen(8)} className="p-2 text-slate-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un lieu ou incident..."
            className="w-full text-xs font-medium text-[#1F2937] bg-transparent focus:outline-none"
          />
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCat('Tous')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap transition ${
              selectedCat === 'Tous' ? 'bg-[#1E5EFF] text-white' : 'bg-white text-[#1F2937] border border-[#E5E7EB]'
            }`}
          >
            Tous ({incidents.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.name)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap transition ${
                selectedCat === cat.name ? 'bg-[#1E5EFF] text-white' : 'bg-white text-[#1F2937] border border-[#E5E7EB]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Component */}
      <div className="flex-1 w-full h-full pt-20">
        <IncidentMap 
          incidents={filtered} 
          onSelectIncident={(inc) => {
            setSelectedIncidentId(inc.id);
            setMobileScreen(17);
          }}
        />
      </div>
    </div>
  );
};

// Screen 10: Signaler un incident - Étape 1
export const Screen10_SignalerIncident: React.FC = () => {
  const { setMobileScreen, updateReportDraft } = useViewStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateReportDraft({ photoUrl: reader.result as string });
        setMobileScreen(12);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center gap-3 pt-2 mb-6">
          <button onClick={() => setMobileScreen(8)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-[#1F2937]">Signaler un incident</h2>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-[#E5E7EB] text-center shadow-xs my-auto py-8">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-[#1E5EFF] flex items-center justify-center mx-auto mb-4">
            <Camera className="w-10 h-10" />
          </div>
          <h3 className="font-bold text-base text-[#1F2937] mb-2">
            Aidez-nous à améliorer votre environnement
          </h3>
          <p className="text-xs text-[#6B7280] max-w-xs mx-auto leading-relaxed">
            Prenez une photo en direct ou importez une image de l'incident.
          </p>

          <div className="space-y-3 mt-8">
            <button
              onClick={() => setMobileScreen(11)}
              className="w-full py-3.5 bg-[#1E5EFF] text-white font-bold rounded-[18px] shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2 text-xs"
            >
              <Camera className="w-4 h-4" />
              <span>Prendre une photo</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 bg-slate-100 text-slate-700 font-bold rounded-[18px] hover:bg-slate-200 transition flex items-center justify-center gap-2 text-xs"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Importer une image</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileImport} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>
      </div>

      <div className="text-center pb-2">
        <p className="text-[11px] text-slate-400 font-semibold">Étape 1 sur 5</p>
      </div>
    </div>
  );
};

// Screen 11: Prendre une photo
export const Screen11_PrendrePhoto: React.FC = () => {
  const { setMobileScreen, updateReportDraft } = useViewStore();

  const handleCapture = () => {
    // Standard photo sample for simulator capture
    const samplePhoto = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600";
    updateReportDraft({ photoUrl: samplePhoto });
    setMobileScreen(12);
  };

  return (
    <div className="h-full bg-black flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background simulated live viewfinder */}
      <img
        src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800"
        alt="Viewfinder"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      <div className="relative z-10 flex justify-between items-center pt-4">
        <button onClick={() => setMobileScreen(10)} className="w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-xs font-bold text-white bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
          PHOTO
        </span>
        <div className="w-10"></div>
      </div>

      <div className="relative z-10 pb-8 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileScreen(10)}
          className="text-xs font-bold text-white uppercase tracking-wider"
        >
          ANNULER
        </button>

        {/* Shutter Button */}
        <button
          onClick={handleCapture}
          className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1 group"
        >
          <div className="w-full h-full rounded-full bg-white group-active:scale-90 transition"></div>
        </button>

        <button
          onClick={handleCapture}
          className="text-xs font-bold text-[#34A853] uppercase tracking-wider bg-black/50 px-3 py-1.5 rounded-full"
        >
          UTILISER
        </button>
      </div>
    </div>
  );
};

// Screen 12: Choix de la catégorie - Étape 2
export const Screen12_ChoixCategorie: React.FC = () => {
  const { setMobileScreen, reportDraft, updateReportDraft } = useViewStore();
  const { data: categories = [] } = useCategories();

  const handleSelect = (catName: string) => {
    updateReportDraft({ category: catName });
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 pt-2 mb-4">
          <button onClick={() => setMobileScreen(10)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Catégorie de l'incident</h2>
            <p className="text-xs text-[#6B7280]">Choisissez la catégorie correspondante</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-4">
          {categories.map((cat) => {
            const IconComp = categoryIconMap[cat.name] || Route;
            const isSelected = reportDraft.category === cat.name;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelect(cat.name)}
                className={`p-4 rounded-[20px] border transition cursor-pointer flex flex-col items-center text-center ${
                  isSelected
                    ? 'bg-[#1E5EFF] text-white border-[#1E5EFF] shadow-md'
                    : 'bg-white border-[#E5E7EB] text-[#1F2937] hover:border-blue-400'
                }`}
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#1E5EFF]'
                  }`}
                >
                  <IconComp className="w-6 h-6" />
                </div>
                <span className="font-bold text-xs">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button
          onClick={() => setMobileScreen(13)}
          className="w-full py-4 bg-[#1E5EFF] text-white font-bold rounded-[18px] shadow-md hover:bg-blue-700 transition"
        >
          Suivant
        </button>
        <p className="text-center text-[11px] text-slate-400 font-semibold">Étape 2 sur 5</p>
      </div>
    </div>
  );
};

// Screen 13: Localisation GPS - Étape 3
export const Screen13_LocalisationGps: React.FC = () => {
  const { setMobileScreen, reportDraft, updateReportDraft } = useViewStore();
  const [pos, setPos] = useState<[number, number]>([reportDraft.location.lat, reportDraft.location.lng]);

  const handlePositionChange = (newPos: [number, number]) => {
    setPos(newPos);
    updateReportDraft({
      location: {
        address: "Position GPS ajustée, Dakar, Sénégal",
        lat: newPos[0],
        lng: newPos[1],
        commune: "Dakar Plateau"
      }
    });
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 pt-2 mb-4">
          <button onClick={() => setMobileScreen(12)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Localisation</h2>
            <p className="text-xs text-[#6B7280]">Position GPS détectée (Sénégal)</p>
          </div>
        </div>

        <div className="flex-1 w-full rounded-[24px] overflow-hidden shadow-xs border border-[#E5E7EB] relative mb-4">
          <LocationPickerMap position={pos} onPositionChange={handlePositionChange} />
          
          <button
            onClick={() => handlePositionChange([14.6937, -17.4441])}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white text-[#1E5EFF] px-4 py-2 rounded-full font-bold text-xs shadow-lg border border-[#E5E7EB] flex items-center gap-2"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>Centrer sur ma position (Dakar)</span>
          </button>
        </div>

        <div className="bg-white p-3 rounded-[16px] border border-[#E5E7EB] mb-4">
          <p className="text-[11px] font-semibold text-slate-400">Adresse détectée</p>
          <p className="text-xs font-bold text-[#1F2937] truncate">
            📍 {reportDraft.location.address}
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setMobileScreen(14)}
            className="w-full py-4 bg-[#1E5EFF] text-white font-bold rounded-[18px] shadow-md hover:bg-blue-700 transition"
          >
            Suivant
          </button>
          <p className="text-center text-[11px] text-slate-400 font-semibold">Étape 3 sur 5</p>
        </div>
      </div>
    </div>
  );
};

// Screen 14: Description & Urgence - Étape 4
export const Screen14_Description: React.FC = () => {
  const { setMobileScreen, reportDraft, updateReportDraft } = useViewStore();
  const [title, setTitle] = useState(reportDraft.title || 'Nid-de-poule sur la route');
  const [description, setDescription] = useState(
    reportDraft.description || 'Grand trou sur la chaussée qui cause des difficultés aux conducteurs et peut provoquer des accidents.'
  );
  const [urgency, setUrgency] = useState<'Faible' | 'Moyenne' | 'Critique'>(reportDraft.urgency || 'Critique');

  const handleNext = () => {
    updateReportDraft({ title, description, urgency });
    setMobileScreen(15);
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 pt-2 mb-4">
          <button onClick={() => setMobileScreen(13)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Description de l'incident</h2>
            <p className="text-xs text-[#6B7280]">Décrivez votre signalement</p>
          </div>
        </div>

        <div className="space-y-4 my-2">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
              Titre du signalement
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-[14px] border border-[#E5E7EB] text-xs text-[#1F2937] font-semibold focus:ring-2 focus:ring-[#1E5EFF]"
              placeholder="Ex: Nid-de-poule sur la route"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
              Description détaillée
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-white rounded-[14px] border border-[#E5E7EB] text-xs text-[#1F2937] font-medium focus:ring-2 focus:ring-[#1E5EFF]"
              placeholder="Expliquez en détail le problème observé..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-2">
              Niveau d'urgence
            </label>
            <div className="space-y-2">
              {[
                { level: 'Faible', color: 'border-emerald-500 text-emerald-600 bg-emerald-50' },
                { level: 'Moyenne', color: 'border-amber-500 text-amber-600 bg-amber-50' },
                { level: 'Critique', color: 'border-red-500 text-red-600 bg-red-50' }
              ].map((u) => (
                <label
                  key={u.level}
                  onClick={() => setUrgency(u.level as any)}
                  className={`flex items-center justify-between p-3 rounded-[14px] border cursor-pointer transition ${
                    urgency === u.level ? u.color + ' ring-2 ring-offset-1' : 'bg-white border-[#E5E7EB]'
                  }`}
                >
                  <span className="font-bold text-xs">{u.level}</span>
                  <input
                    type="radio"
                    name="urgency"
                    checked={urgency === u.level}
                    onChange={() => setUrgency(u.level as any)}
                    className="w-4 h-4 text-[#1E5EFF]"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-2">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-[#34A853] text-white font-bold rounded-[18px] shadow-md hover:bg-emerald-700 transition"
        >
          Suivant
        </button>
        <p className="text-center text-[11px] text-slate-400 font-semibold">Étape 4 sur 5</p>
      </div>
    </div>
  );
};

// Screen 15: Confirmation - Étape 5
export const Screen15_Confirmation: React.FC = () => {
  const { setMobileScreen, reportDraft, resetReportDraft, setSelectedIncidentId } = useViewStore();
  const createIncidentMutation = useCreateIncident();

  const handleSend = async () => {
    try {
      const created = await createIncidentMutation.mutateAsync({
        title: reportDraft.title || "Nid-de-poule sur la route",
        description: reportDraft.description || "Description de l'incident citoyen.",
        category: reportDraft.category || "Routes & Voirie",
        urgency: reportDraft.urgency || "Critique",
        location: reportDraft.location,
        photoUrl: reportDraft.photoUrl
      });
      setSelectedIncidentId(created.id);
      resetReportDraft();
      setMobileScreen(16); // Take to "Mes signalements"
    } catch {
      setMobileScreen(16);
    }
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 pt-2 mb-4">
          <button onClick={() => setMobileScreen(14)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Confirmation</h2>
            <p className="text-xs text-[#6B7280]">Vérifiez votre signalement</p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-[24px] border border-[#E5E7EB] overflow-hidden shadow-xs my-3">
          <img 
            src={reportDraft.photoUrl} 
            alt="Aperçu incident" 
            className="w-full h-44 object-cover" 
          />

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#1E5EFF] bg-blue-50 px-3 py-1 rounded-full">
                📁 {reportDraft.category}
              </span>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full text-white ${
                reportDraft.urgency === 'Critique' ? 'bg-[#EF4444]' :
                reportDraft.urgency === 'Moyenne' ? 'bg-[#F59E0B]' : 'bg-[#22C55E]'
              }`}>
                {reportDraft.urgency}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#1F2937]">{reportDraft.title}</h4>
              <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">
                {reportDraft.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-[#6B7280]">
              📍 {reportDraft.location.address}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-2">
        <button
          onClick={handleSend}
          disabled={createIncidentMutation.isPending}
          className="w-full py-4 bg-[#34A853] text-white font-bold rounded-[18px] shadow-lg shadow-emerald-900/10 hover:bg-emerald-700 transition flex items-center justify-center gap-2"
        >
          {createIncidentMutation.isPending ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Envoyer le signalement</span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-slate-400 font-semibold">Étape 5 sur 5</p>
      </div>
    </div>
  );
};
