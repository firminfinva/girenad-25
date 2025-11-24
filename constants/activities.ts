import Project1 from "@/public/assets/project1.jpg";
import Project2 from "@/public/assets/project2.jpg";
import Project3 from "@/public/assets/project3.jpg";

export const activities = [
  {
    id: "activity-1",
    title: "Atelier de Reboisement Communautaire",
    description:
      "Session interactive pour former les communautés locales aux techniques de reboisement durable autour du Parc National des Virunga. Objectif : planter 500 arbres et renforcer les capacités des participants. Cet atelier comprend des démonstrations pratiques sur la sélection des espèces d'arbres adaptées au climat local, les méthodes de plantation respectueuses de l'environnement, et l'importance de la biodiversité dans la préservation des écosystèmes. Les participants apprendront également à surveiller la croissance des arbres et à maintenir les plantations sur le long terme. Cette initiative vise à restaurer les forêts dégradées, à prévenir l'érosion des sols, et à créer des emplois locaux dans le secteur de la foresterie durable. En plus des aspects techniques, l'atelier aborde les aspects socio-économiques, en montrant comment le reboisement peut améliorer les moyens de subsistance des communautés tout en contribuant à la lutte contre le changement climatique.",
    date: "15 Octobre 2023",
    img: Project1,
    frenchTitle: "Atelier de Reboisement Communautaire",
    participatingOrganizations: ["WWF", "UCB", "Communauté Locale de Virunga"],
    onlineEventLink: "https://zoom.us/j/123456789",
    program: [
      { time: "09:00", event: "Accueil et inscription des participants" },
      { time: "10:00", event: "Atelier sur les techniques de reboisement" },
      { time: "12:00", event: "Pause déjeuner" },
      { time: "13:00", event: "Activité pratique de plantation" },
      { time: "16:00", event: "Clôture et évaluation" },
    ],
  },
  {
    id: "activity-2",
    title: "Formation en Gouvernance Locale",
    description:
      "Programme de formation pour les leaders communautaires sur la gestion participative des ressources naturelles, incluant des ateliers sur les droits fonciers et la décentralisation. Cette formation intensive couvre les principes fondamentaux de la gouvernance démocratique, les mécanismes de participation citoyenne, et les stratégies de résolution de conflits liés aux ressources naturelles. Les participants exploreront les cadres juridiques nationaux et internationaux régissant l'accès aux terres et aux ressources, ainsi que les meilleures pratiques pour une décentralisation efficace. Le programme inclut des études de cas réels de communautés ayant réussi à mettre en place des systèmes de gestion participative, mettant en lumière les défis rencontrés et les solutions adoptées. Les sessions pratiques permettront aux leaders d'acquérir des compétences en facilitation d'ateliers, en négociation, et en mobilisation communautaire, essentielles pour une gouvernance inclusive et durable.",
    date: "22 Novembre 2023",
    img: Project2,
    frenchTitle: "Formation en Gouvernance Locale",
    participatingOrganizations: [
      "UCB",
      "Ministère de l'Environnement",
      "ONG Locale",
    ],
    onlineEventLink: "",
    program: [
      { time: "08:30", event: "Ouverture et introduction" },
      { time: "09:30", event: "Session sur les droits fonciers" },
      { time: "11:00", event: "Atelier sur la décentralisation" },
      { time: "12:30", event: "Pause déjeuner" },
      { time: "13:30", event: "Gestion participative des ressources" },
      { time: "15:30", event: "Clôture" },
    ],
  },
  {
    id: "activity-3",
    title: "Campagne de Sensibilisation Écologique",
    description:
      "Campagne de sensibilisation dans les écoles et communautés de Goma pour promouvoir la conservation des écosystèmes et l'utilisation durable de l'énergie. Cette campagne ambitieuse vise à éduquer les jeunes générations et les adultes sur l'importance de la biodiversité, les impacts du changement climatique, et les pratiques écologiques quotidiennes. À travers des ateliers interactifs, des pièces de théâtre éducatives, et des distributions de matériels pédagogiques, la campagne aborde des thèmes tels que la réduction des déchets, l'économie d'énergie, la protection des espèces menacées, et l'importance des espaces verts urbains. Les écoles participantes recevront des kits éducatifs comprenant des guides pédagogiques, des posters informatifs, et des outils pour des projets scolaires sur l'environnement. La campagne inclut également des événements communautaires avec des experts en environnement, des projections de documentaires, et des concours écologiques pour encourager la participation active.",
    date: "5 Décembre 2023",
    img: Project3,
    frenchTitle: "Campagne de Sensibilisation Écologique",
    participatingOrganizations: ["WWF", "Écoles de Goma", "Communauté de Goma"],
    onlineEventLink: "https://meet.google.com/abc-def-ghi",
    program: [
      { time: "14:00", event: "Conférence d'ouverture" },
      { time: "15:00", event: "Ateliers interactifs en écoles" },
      { time: "16:30", event: "Distribution de matériels éducatifs" },
      { time: "18:00", event: "Événement de clôture" },
    ],
  },
];
