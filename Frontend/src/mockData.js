export const mockClients = [
  {
    id: "c1",
    name: "Mohamed Chakir",
    phone: "0770 12 34 56",
    segment: "Professionnel",
    currentPlan: "Flexy / Hors-Forfait",
    currentSpend: 3400,
    budgetLimit: 3000,
    dataUsageGB: 78,
    voiceMinutes: 1450,
    smsUsed: 80,
    churnRisk: "Élevé", // "Élevé", "Moyen", "Faible"
    avatarColor: "#D6121D"
  },
  {
    id: "c2",
    name: "Amine Khelifi",
    phone: "0772 89 45 12",
    segment: "VIP",
    currentPlan: "Djezzy Smart 1500",
    currentSpend: 1500,
    budgetLimit: 2500,
    dataUsageGB: 95,
    voiceMinutes: 2800,
    smsUsed: 120,
    churnRisk: "Moyen",
    avatarColor: "#2A2633"
  },
  {
    id: "c3",
    name: "Sarah Bouhired",
    phone: "0771 56 78 90",
    segment: "Jeune",
    currentPlan: "Djezzy Hadra 500",
    currentSpend: 1200, // Pays extra for data passes
    budgetLimit: 1500,
    dataUsageGB: 22,
    voiceMinutes: 450,
    smsUsed: 250,
    churnRisk: "Élevé",
    avatarColor: "#E23B44"
  },
  {
    id: "c4",
    name: "Meriem Belkacem",
    phone: "0770 99 88 77",
    segment: "Grand Public",
    currentPlan: "Djezzy Smart 1000",
    currentSpend: 1000,
    budgetLimit: 1200,
    dataUsageGB: 18,
    voiceMinutes: 800,
    smsUsed: 30,
    churnRisk: "Faible",
    avatarColor: "#8E8896"
  },
  {
    id: "c5",
    name: "Yacine Mahdi",
    phone: "0775 34 12 99",
    segment: "Professionnel",
    currentPlan: "Djezzy Legend 2000",
    currentSpend: 2000,
    budgetLimit: 4000,
    dataUsageGB: 120,
    voiceMinutes: 3200,
    smsUsed: 400,
    churnRisk: "Faible",
    avatarColor: "#1A181E"
  },
  {
    id: "c6",
    name: "Lydia Ouali",
    phone: "0773 44 55 66",
    segment: "Jeune",
    currentPlan: "Flexy / Hors-Forfait",
    currentSpend: 1800,
    budgetLimit: 2000,
    dataUsageGB: 35,
    voiceMinutes: 120,
    smsUsed: 95,
    churnRisk: "Moyen",
    avatarColor: "#FF5E62"
  },
  {
    id: "c7",
    name: "Karim Benchikh",
    phone: "0771 11 22 33",
    segment: "Grand Public",
    currentPlan: "Djezzy Hadra 500",
    currentSpend: 500,
    budgetLimit: 1000,
    dataUsageGB: 2,
    voiceMinutes: 980,
    smsUsed: 15,
    churnRisk: "Faible",
    avatarColor: "#4B4453"
  },
  {
    id: "c8",
    name: "Sofia Benali",
    phone: "0774 77 88 99",
    segment: "VIP",
    currentPlan: "Djezzy Smart 1500",
    currentSpend: 2900, // buying many extra data passes
    budgetLimit: 3000,
    dataUsageGB: 85,
    voiceMinutes: 1800,
    smsUsed: 150,
    churnRisk: "Élevé",
    avatarColor: "#C9141F"
  }
];

export const mockOffers = [
  {
    id: "o1",
    name: "Djezzy Legend 2000",
    type: "Postpayé", // Postpayé / Hybride / Prépayé
    price: 2000,
    validity: "30 Jours",
    data: "100 Go",
    dataValue: 100, // in GB for comparison
    voice: "Illimité vers Djezzy",
    voiceOther: "2000 DZD vers autres réseaux",
    sms: "Illimité vers Djezzy",
    features: ["Accès VIP", "Roaming inclus", "Support Prioritaire"],
    popular: true
  },
  {
    id: "o2",
    name: "Djezzy Smart 1500",
    type: "Hybride",
    price: 1500,
    validity: "30 Jours",
    data: "40 Go",
    dataValue: 40,
    voice: "Illimité vers Djezzy",
    voiceOther: "1500 DZD vers autres réseaux",
    sms: "150 SMS",
    features: ["Report de data", "Option Double SIM dispo"],
    popular: false
  },
  {
    id: "o3",
    name: "Djezzy Smart 1000",
    type: "Hybride",
    price: 1000,
    validity: "30 Jours",
    data: "20 Go",
    dataValue: 20,
    voice: "Illimité vers Djezzy",
    voiceOther: "1000 DZD vers autres réseaux",
    sms: "100 SMS",
    features: ["Idéal réseaux sociaux", "Contrôle de consommation"],
    popular: false
  },
  {
    id: "o4",
    name: "Djezzy Hadra 500",
    type: "Prépayé",
    price: 500,
    validity: "30 Jours",
    data: "5 Go",
    dataValue: 5,
    voice: "Illimité vers Djezzy",
    voiceOther: "500 DZD vers autres réseaux",
    sms: "Sans SMS inclus",
    features: ["Spécial Appels", "Petit budget"],
    popular: false
  },
  {
    id: "o5",
    name: "Djezzy Speed 1000",
    type: "Prépayé",
    price: 1000,
    validity: "30 Jours",
    data: "30 Go",
    dataValue: 30,
    voice: "Sans appels inclus",
    voiceOther: "Tarif standard",
    sms: "Sans SMS inclus",
    features: ["100% Data", "Vitesse Max 4G+"],
    popular: false
  },
  {
    id: "o6",
    name: "Djezzy Speed 2000",
    type: "Prépayé",
    price: 2000,
    validity: "30 Jours",
    data: "80 Go",
    dataValue: 80,
    voice: "Sans appels inclus",
    voiceOther: "Tarif standard",
    sms: "Sans SMS inclus",
    features: ["Spécial Streaming / Télétravail", "Option Multi-SIM"],
    popular: true
  }
];

export const mockHistory = [
  {
    id: "h1",
    clientName: "Mohamed Chakir",
    clientPhone: "0770 12 34 56",
    date: "2026-05-27 15:42",
    currentPlan: "Flexy / Hors-Forfait",
    recommendedPlan: "Djezzy Smart 1500",
    currentSpend: 3400,
    recommendedPrice: 1500,
    matchingScore: 94,
    justification: "Le client dépense 3 400 DZD en hors-forfait et pass internet à l'acte pour consommer 78 Go de data. En passant à Djezzy Smart 1500, il réduit ses dépenses mensuelles de 1 900 DZD tout en profitant d'une enveloppe de 40 Go plus des appels illimités vers Djezzy qui couvrent 80% de ses besoins.",
    status: "Appliquée"
  },
  {
    id: "h2",
    clientName: "Sofia Benali",
    clientPhone: "0774 77 88 99",
    date: "2026-05-27 11:20",
    currentPlan: "Djezzy Smart 1500",
    recommendedPlan: "Djezzy Legend 2000",
    currentSpend: 2900,
    recommendedPrice: 2000,
    matchingScore: 98,
    justification: "Le client est sur Smart 1500 mais achète systématiquement des pass internet supplémentaires (spend total de 2900 DZD) pour sa forte consommation (85 Go). Djezzy Legend 2000 lui offre 100 Go directement pour 2000 DZD, lui faisant économiser 900 DZD tout en évitant les interruptions de service.",
    status: "Appliquée"
  },
  {
    id: "h3",
    clientName: "Sarah Bouhired",
    clientPhone: "0771 56 78 90",
    date: "2026-05-26 09:15",
    currentPlan: "Djezzy Hadra 500",
    recommendedPlan: "Djezzy Smart 1000",
    currentSpend: 1200,
    recommendedPrice: 1000,
    matchingScore: 89,
    justification: "Le client consomme beaucoup de data (22 Go) par rapport à son offre djezzy Hadra 500 (voix). Il dépense 1200 DZD au total. L'offre Smart 1000 lui offre 20 Go et appels illimités, stabilisant son budget mensuel à 1000 DZD.",
    status: "Envoyée par SMS"
  },
  {
    id: "h4",
    clientName: "Lydia Ouali",
    clientPhone: "0773 44 55 66",
    date: "2026-05-25 16:30",
    currentPlan: "Flexy / Hors-Forfait",
    recommendedPlan: "Djezzy Speed 1000",
    currentSpend: 1800,
    recommendedPrice: 1000,
    matchingScore: 91,
    justification: "Profil orienté uniquement data (35 Go consommés, très peu d'appels). La recharge à la carte lui coûte 1800 DZD. L'offre Djezzy Speed 1000 (30 Go) est idéale pour optimiser son budget.",
    status: "Ignorée"
  }
];
