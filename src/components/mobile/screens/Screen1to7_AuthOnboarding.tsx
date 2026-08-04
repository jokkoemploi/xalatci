import React, { useState } from 'react';
import { useViewStore } from '../../../store/useViewStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { XalatLogo } from '../../common/XalatLogo';
import { 
  ArrowRight, 
  MapPin, 
  Clock, 
  Users, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  CheckCircle2, 
  ChevronLeft,
  Eye,
  EyeOff
} from 'lucide-react';

// Screen 1: Splash Screen
export const Screen1_Splash: React.FC = () => {
  const { setMobileScreen } = useViewStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="h-full bg-gradient-to-b from-[#F8FAFC] via-white to-blue-50/50 flex flex-col justify-between p-6 text-center">
      <div className="pt-16 flex flex-col items-center">
        <XalatLogo size="xl" showSubtitle={true} />
      </div>

      <div className="my-auto py-8">
        <p className="text-sm font-medium text-[#6B7280] max-w-xs mx-auto leading-relaxed">
          Ensemble, rendons nos villes plus sûres, plus propres et plus vivables.
        </p>
      </div>

      <div className="pb-8 space-y-3">
        <button
          onClick={() => setMobileScreen(2)}
          className="w-full py-4 bg-[#1E5EFF] hover:bg-blue-700 text-white font-bold rounded-[18px] shadow-lg shadow-blue-500/10 transition flex items-center justify-center gap-2 text-sm"
        >
          <span>Découvrir XALAT-CI</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            if (!isAuthenticated) {
              setMobileScreen(5);
            } else {
              setMobileScreen(8);
            }
          }}
          className="w-full py-3 text-xs font-semibold text-[#1E5EFF] hover:underline flex items-center justify-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Accéder au Dashboard (Connexion)</span>
        </button>
      </div>
    </div>
  );
};

// Screen 2: Onboarding 1
export const Screen2_Onboarding1: React.FC = () => {
  const { setMobileScreen } = useViewStore();

  return (
    <div className="h-full bg-white flex flex-col justify-between p-6">
      <div className="flex justify-between items-center pt-2">
        <div className="w-8"></div>
        <button 
          onClick={() => setMobileScreen(5)}
          className="text-xs font-bold text-slate-400 hover:text-[#1E5EFF]"
        >
          Passer
        </button>
      </div>

      <div className="flex flex-col items-center text-center my-auto py-4">
        <div className="w-48 h-48 rounded-full bg-blue-50 flex items-center justify-center mb-8 relative">
          <MapPin className="w-20 h-20 text-[#1E5EFF]" />
          <div className="absolute top-4 right-4 bg-[#34A853] p-3 rounded-full text-white shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#1F2937] mb-3">
          Signalez facilement les incidents
        </h2>
        <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs">
          Prenez une photo, décrivez le problème et envoyez votre signalement en quelques clics à votre mairie.
        </p>
      </div>

      <div className="pb-6">
        <div className="flex justify-center gap-2 mb-8">
          <span className="w-8 h-2.5 bg-[#1E5EFF] rounded-full"></span>
          <span className="w-2.5 h-2.5 bg-slate-200 rounded-full"></span>
          <span className="w-2.5 h-2.5 bg-slate-200 rounded-full"></span>
        </div>
        <button
          onClick={() => setMobileScreen(3)}
          className="w-full py-4 bg-[#1E5EFF] text-white font-bold rounded-[18px] shadow-md hover:bg-blue-700 transition"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

// Screen 3: Onboarding 2
export const Screen3_Onboarding2: React.FC = () => {
  const { setMobileScreen } = useViewStore();

  return (
    <div className="h-full bg-white flex flex-col justify-between p-6">
      <div className="flex justify-between items-center pt-2">
        <button onClick={() => setMobileScreen(2)} className="text-slate-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={() => setMobileScreen(5)} className="text-xs font-bold text-slate-400">
          Passer
        </button>
      </div>

      <div className="flex flex-col items-center text-center my-auto py-4">
        <div className="w-48 h-48 rounded-full bg-emerald-50 flex items-center justify-center mb-8">
          <Clock className="w-20 h-20 text-[#34A853]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1F2937] mb-3">
          Suivi en temps réel
        </h2>
        <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs">
          Suivez l'évolution de vos signalements à chaque étape, de la prise en charge à la résolution finale.
        </p>
      </div>

      <div className="pb-6">
        <div className="flex justify-center gap-2 mb-8">
          <span className="w-2.5 h-2.5 bg-slate-200 rounded-full"></span>
          <span className="w-8 h-2.5 bg-[#1E5EFF] rounded-full"></span>
          <span className="w-2.5 h-2.5 bg-slate-200 rounded-full"></span>
        </div>
        <button
          onClick={() => setMobileScreen(4)}
          className="w-full py-4 bg-[#1E5EFF] text-white font-bold rounded-[18px] shadow-md hover:bg-blue-700 transition"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

// Screen 4: Onboarding 3
export const Screen4_Onboarding3: React.FC = () => {
  const { setMobileScreen } = useViewStore();

  return (
    <div className="h-full bg-white flex flex-col justify-between p-6">
      <div className="flex justify-between items-center pt-2">
        <button onClick={() => setMobileScreen(3)} className="text-slate-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={() => setMobileScreen(5)} className="text-xs font-bold text-slate-400">
          Passer
        </button>
      </div>

      <div className="flex flex-col items-center text-center my-auto py-4">
        <div className="w-48 h-48 rounded-full bg-blue-50 flex items-center justify-center mb-8">
          <Users className="w-20 h-20 text-[#1E5EFF]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1F2937] mb-3">
          Votre voix compte
        </h2>
        <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs">
          Ensemble, construisons des villes meilleures, plus sûres et plus responsables pour tous nos citoyens.
        </p>
      </div>

      <div className="pb-6">
        <div className="flex justify-center gap-2 mb-8">
          <span className="w-2.5 h-2.5 bg-slate-200 rounded-full"></span>
          <span className="w-2.5 h-2.5 bg-slate-200 rounded-full"></span>
          <span className="w-8 h-2.5 bg-[#34A853] rounded-full"></span>
        </div>
        <button
          onClick={() => setMobileScreen(5)}
          className="w-full py-4 bg-[#34A853] text-white font-bold rounded-[18px] shadow-md hover:bg-emerald-700 transition"
        >
          Commencer
        </button>
      </div>
    </div>
  );
};

// Screen 5: Connexion (Login)
export const Screen5_Connexion: React.FC = () => {
  const { setMobileScreen } = useViewStore();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email);
    setMobileScreen(8);
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="pt-2 mb-6 flex flex-col items-center">
          <XalatLogo size="md" showSubtitle={true} />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1F2937]">Connexion</h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Bienvenue au Sénégal ! Connectez-vous à votre compte.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
              Email ou Téléphone (+221)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white rounded-[14px] border border-[#E5E7EB] text-xs font-medium text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E5EFF]"
                placeholder="Ex: ousmane.diallo@xalat.sn ou +221 77 123 45 67"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 bg-white rounded-[14px] border border-[#E5E7EB] text-xs font-medium text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#1E5EFF]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => setMobileScreen(7)}
              className="text-xs font-semibold text-[#1E5EFF] hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#1E5EFF] text-white font-bold rounded-[18px] shadow-md hover:bg-blue-700 transition text-sm"
          >
            Se connecter
          </button>
        </form>
      </div>

      <div className="text-center pt-6 pb-2">
        <p className="text-xs text-[#6B7280]">
          Pas encore de compte ?{' '}
          <button
            onClick={() => setMobileScreen(6)}
            className="font-bold text-[#1E5EFF] hover:underline"
          >
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
};

// Screen 6: Inscription (Register)
export const Screen6_Inscription: React.FC = () => {
  const { setMobileScreen } = useViewStore();
  const { register } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    register(name, email, phone);
    setMobileScreen(8);
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6 overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 pt-2 mb-4">
          <button onClick={() => setMobileScreen(5)} className="text-slate-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Créer un compte</h2>
            <p className="text-xs text-[#6B7280]">Remplissez vos informations citoyennes au Sénégal.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1">
              Nom complet
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-[14px] border border-[#E5E7EB] text-xs text-[#1F2937] focus:ring-2 focus:ring-[#1E5EFF]"
                placeholder="Ex: Ousmane Diallo"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1">
              Téléphone (+221)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-[14px] border border-[#E5E7EB] text-xs text-[#1F2937] focus:ring-2 focus:ring-[#1E5EFF]"
                placeholder="+221 77 123 45 67"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-[14px] border border-[#E5E7EB] text-xs text-[#1F2937] focus:ring-2 focus:ring-[#1E5EFF]"
                placeholder="nom@exemple.sn"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-[14px] border border-[#E5E7EB] text-xs text-[#1F2937] focus:ring-2 focus:ring-[#1E5EFF]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input type="checkbox" id="cgu" required className="mt-0.5 rounded text-[#1E5EFF]" defaultChecked />
            <label htmlFor="cgu" className="text-[11px] text-[#6B7280] leading-tight">
              J'accepte les <span className="font-semibold text-[#1E5EFF]">Conditions d'utilisation</span> et la <span className="font-semibold text-[#1E5EFF]">Politique de confidentialité</span>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#34A853] text-white font-bold rounded-[18px] shadow-md hover:bg-emerald-700 transition text-sm mt-2"
          >
            S'inscrire
          </button>
        </form>
      </div>

      <div className="text-center pt-4 pb-2">
        <p className="text-xs text-[#6B7280]">
          Déjà un compte ?{' '}
          <button
            onClick={() => setMobileScreen(5)}
            className="font-bold text-[#1E5EFF] hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};

// Screen 7: Mot de passe oublié
export const Screen7_MotDePasseOublie: React.FC = () => {
  const { setMobileScreen } = useViewStore();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col justify-between p-6">
      <div>
        <div className="pt-4 mb-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1E5EFF] flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">Mot de passe oublié</h2>
          <p className="text-xs text-[#6B7280] mt-2 max-w-xs mx-auto">
            Entrez votre email ou téléphone. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-[#34A853] mx-auto mb-2" />
            <h4 className="font-bold text-xs text-emerald-900">Lien envoyé avec succès !</h4>
            <p className="text-[11px] text-emerald-700 mt-1">
              Vérifiez vos messages ou votre boîte mail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
                Email ou Téléphone
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white rounded-[14px] border border-[#E5E7EB] text-xs text-[#1F2937] focus:ring-2 focus:ring-[#1E5EFF]"
                placeholder="Ex: ousmane.diallo@xalat.sn ou +221 77 123 45 67"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-[#1E5EFF] text-white font-bold rounded-[18px] shadow-md hover:bg-blue-700 transition text-sm"
            >
              Envoyer le lien
            </button>
          </form>
        )}
      </div>

      <div className="text-center pb-4">
        <button
          onClick={() => setMobileScreen(5)}
          className="text-xs font-semibold text-[#6B7280] hover:text-[#1F2937]"
        >
          Retour à la connexion
        </button>
      </div>
    </div>
  );
};
