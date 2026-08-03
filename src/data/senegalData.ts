export interface SenegalRegion {
  name: string;
  code: string;
  departments: string[];
}

export const SENEGAL_REGIONS: SenegalRegion[] = [
  {
    name: "Dakar",
    code: "DK",
    departments: ["Dakar", "Guédiawaye", "Keur Massar", "Pikine", "Rufisque"]
  },
  {
    name: "Thiès",
    code: "TH",
    departments: ["M'bour", "Thiès", "Tivaouane"]
  },
  {
    name: "Diourbel",
    code: "DB",
    departments: ["Bambey", "Diourbel", "Mbacké"]
  },
  {
    name: "Saint-Louis",
    code: "SL",
    departments: ["Dagana", "Podor", "Saint-Louis"]
  },
  {
    name: "Louga",
    code: "LG",
    departments: ["Kébémer", "Linguère", "Louga"]
  },
  {
    name: "Fatick",
    code: "FK",
    departments: ["Fatick", "Foundiougne", "Gossas"]
  },
  {
    name: "Kaolack",
    code: "KL",
    departments: ["Guinguinéo", "Kaolack", "Nioro du Rip"]
  },
  {
    name: "Kaffrine",
    code: "KF",
    departments: ["Birkelane", "Kaffrine", "Koungheul", "Malem Hodar"]
  },
  {
    name: "Tambacounda",
    code: "TC",
    departments: ["Bakel", "Goudiry", "Koumpentoum", "Tambacounda"]
  },
  {
    name: "Kolda",
    code: "KD",
    departments: ["Kolda", "Médina Yoro Foulah", "Vélingara"]
  },
  {
    name: "Sédhiou",
    code: "SD",
    departments: ["Bounkiling", "Goudomp", "Sédhiou"]
  },
  {
    name: "Ziguinchor",
    code: "ZG",
    departments: ["Bignona", "Oussouye", "Ziguinchor"]
  },
  {
    name: "Kédougou",
    code: "KG",
    departments: ["Kédougou", "Salémata", "Saraya"]
  },
  {
    name: "Matam",
    code: "MT",
    departments: ["Kanel", "Matam", "Ranérou"]
  }
];

export const SENEGAL_CATEGORIES = [
  "Nids-de-poule",
  "Déchets sauvages",
  "Inondation",
  "Éclairage public défectueux",
  "Eau potable",
  "Assainissement",
  "Voirie",
  "Accident",
  "Incendie",
  "Santé",
  "Électricité",
  "Environnement",
  "Pollution",
  "Sécurité",
  "Transport",
  "Catastrophe naturelle",
  "Bâtiment dangereux",
  "Occupation de la voie publique"
];

export const SENEGAL_CONFIG = {
  country: "Sénégal",
  countryCode: "SN",
  currency: "FCFA",
  currencyLong: "Franc CFA (XOF)",
  timezone: "Africa/Dakar",
  dateFormat: "DD/MM/YYYY",
  phonePrefix: "+221",
  phonePattern: "^\\+221\\s?[37][0678]\\s?[0-9]{3}\\s?[0-9]{2}\\s?[0-9]{2}$",
  phoneExample: "+221 77 123 45 67",
  defaultCenter: [14.6937, -17.4441] as [number, number], // Dakar Center
  defaultZoom: 12
};

export type LanguageCode = "fr" | "wo";

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  fr: {
    appName: "XALAT-CI",
    subtitle: "Plateforme Citoyenne - Sénégal",
    reportIncident: "Signaler un incident",
    myReports: "Mes signalements",
    map: "Carte des incidents",
    dashboard: "Tableau de bord",
    notifications: "Notifications",
    support: "Messagerie Support",
    profile: "Profil Citoyen",
    settings: "Paramètres",
    language: "Langue",
    currency: "FCFA",
    statusPending: "En attente",
    statusInProgress: "En cours",
    statusResolved: "Résolu",
    urgencyLow: "Faible",
    urgencyMedium: "Moyenne",
    urgencyCritical: "Critique",
    searchPlaceholder: "Rechercher un incident, commune, référence...",
    noData: "Aucune donnée disponible",
    retry: "Réessayer",
    loading: "Chargement des données en cours...",
    countryName: "Sénégal"
  },
  wo: {
    appName: "XALAT-CI",
    subtitle: "Kewul Citoyen - Sénégaal",
    reportIncident: "Feusseul ab jafe-jafe",
    myReports: "Suma feusseul yépp",
    map: "Karta mboloo jafe-jafe",
    dashboard: "Pàccu gëstu",
    notifications: "Yégle yépp",
    support: "Vocal ak Ndimbal",
    profile: "Pàccu Nit ki",
    settings: "Lijënti gëstu",
    language: "Làmmiñ",
    currency: "FCFA",
    statusPending: "Mu ngi xaar",
    statusInProgress: "Mu ngi ci yoon",
    statusResolved: "Sotti na",
    urgencyLow: "Gawul lool",
    urgencyMedium: "Dafa am maana",
    urgencyCritical: "Gaw na lool!",
    searchPlaceholder: "Wër ab jafe-jafe, dëkk...",
    noData: "Amul bénn xabar léegi",
    retry: "Pàss-pàssalaat",
    loading: "Xabar yépp mu ngi ñëw...",
    countryName: "Sénégaal"
  }
};
