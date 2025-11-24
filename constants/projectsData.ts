export interface Activity {
  id: string;
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  images: string[];
}

export interface Project {
  id: string;
  title: {
    fr: string;
    en: string;
  };
  overview: {
    fr: string;
    en: string;
  };
  context: {
    fr: string;
    en: string;
  };
  generalObjective: {
    fr: string;
    en: string;
  };
  specificObjectives: string[];
  mainActivities: string[];
  partners: string[];
  interventionArea: string;
  duration: string;
  beneficiaries: string;
  expectedResults: string[];
  activities: Activity[];
}

export const projects: Project[] = [
  {
    id: "ikobo-2025",
    title: {
      fr: "Programme d'appui à l'entrepreneuriat des jeunes",
      en: "Youth Entrepreneurship Support Program",
    },
    overview: {
      fr: "Ce projet vise à renforcer la gestion durable des forêts coutumières à Ikobo, en protégeant les ressources naturelles et en améliorant les moyens de subsistance locaux.",
      en: "This project aims to strengthen sustainable management of customary forests in Ikobo, protecting natural resources and improving local livelihoods.",
    },
    context: {
      fr: "Le chômage des jeunes constitue un défi majeur dans la région de Beni. Ce projet vise à favoriser leur insertion professionnelle.",
      en: "Youth unemployment is a major challenge in the Beni region. This project aims to promote their professional integration.",
    },
    generalObjective: {
      fr: "Renforcer l'autonomie économique des jeunes à travers la formation et l'accès au financement.",
      en: "Strengthen the economic autonomy of young people through training and access to financing.",
    },
    specificObjectives: [
      "Former 200 jeunes aux compétences entrepreneuriales.",
      "Financer 50 microprojets viables.",
    ],
    mainActivities: [
      "Ateliers de formation",
      "Accompagnement technique",
      "Sensibilisation",
      "Suivi-évaluation",
    ],
    partners: ["Union Européenne", "ONG Trocaire", "Kali Academy"],
    interventionArea: "Beni, Butembo et Goma (RDC)",
    duration: "De janvier 2025 à décembre 2026",
    beneficiaries:
      "Jeunes entrepreneurs âgés de 18 à 35 ans, avec une attention particulière aux femmes",
    expectedResults: [
      "Amélioration du taux d'emploi des jeunes de 20 % dans la zone cible.",
      "Création de 50 emplois durables.",
    ],
    activities: [
      {
        id: "sensibilisation",
        title: {
          fr: "Activité 1 - Sensibilisation communautaire",
          en: "Activity 1 - Community Awareness",
        },
        description: {
          fr: "Cette activité consiste à sensibiliser la communauté locale sur l'importance de la gestion durable des forêts.",
          en: "This activity involves raising awareness among the local community about the importance of sustainable forest management.",
        },
        images: [
          "/assets/project1.jpg",
          "/assets/project2.jpg",
          "/assets/project3.jpg",
          "/assets/project1.jpg",
          "/assets/project2.jpg",
          "/assets/project3.jpg",
        ],
      },
      {
        id: "plantation",
        title: {
          fr: "Activité 2 - Plantation d'arbres",
          en: "Activity 2 - Tree Planting",
        },
        description: {
          fr: "Cette activité vise à planter des arbres pour restaurer les zones dégradées et améliorer la biodiversité.",
          en: "This activity aims to plant trees to restore degraded areas and improve biodiversity.",
        },
        images: [
          "/assets/project3.jpg",
          "/assets/project1.jpg",
          "/assets/project2.jpg",
          "/assets/project3.jpg",
          "/assets/project1.jpg",
          "/assets/project2.jpg",
        ],
      },
    ],
  },
];
