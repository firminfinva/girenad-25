import {
  facebook,
  instagram,
  linkedin,
  twitter,
  airbnb,
  binance,
  coinbase,
  dropbox,
  send,
  shield,
  star,
} from "@/public/assets";
import Project1 from "@/public/assets/project1.jpg";
import Project2 from "@/public/assets/project2.jpg";
import Project3 from "@/public/assets/project3.jpg";
import UCB from "@/public/assets/UCB-logo.png";
import COD from "@/public/assets/co2logic-logo.png";
import WWF from "@/public/assets/wwf.png";

import { describe } from "node:test";
import { title } from "process";

export const navLinks = [
  {
    id: "accueil",
    title: "Accueil",
    link: "/",
  },

  {
    id: "programme",
    title: "Programme",
    link: "#programme",
  },

  {
    id: "offres",
    title: "Nos offres",
    link: "/offres",
  },
  {
    id: "partenaires",
    title: "Partenaires",
    link: "#partenaires",
  },
  {
    id: "contact",
    title: "Contact",
    link: "#contact",
  },
];

export const features = [
  {
    id: "feature-1",
    icon: star, // Une icône représentant un feu ou une flamme pour symboliser la consommation de makala.
    title: "Réduire",
    content:
      "Réduire la consommation de makala par habitant grâce à l'utilisation de foyers efficaces. Depuis septembre 2017, 5 346 foyers vendus.",
  },
  {
    id: "feature-2",
    icon: shield, // Une icône de feuille pour illustrer l'écomakala et la foresterie durable.
    title: "Améliorer",
    content: "Produire de l'ecomakala à partir d'une foresterie durable.",
  },
  {
    id: "feature-3",
    icon: send, // Une icône d'arbre pour symboliser le reboisement et la biodiversité.
    title: "Préserver",
    content: "Permettant le reboisement et la protection de la biodiversité.",
  },
];

export const feedback = [
  {
    id: "feedback-1",
    content:
      "Soutenir la transition vers un approvisionnement énergétique durable et éviter la déforestation.Makala est le nom local du charbon de bois produit à partir du bois récolté sur les arbres, qui, avec le bois de feu, est la seule source d'énergie accessible aux communautés du Nord-Kivu. À l'heure actuelle, la part du lion du makala sur le marché est produite à partir des forêts naturelles du parc national des Virunga. Vu qu'il est interdit de récolter du bois dans ces forêts, le makala est produit illégalement.L'approvisionnement en bois énergie est un enjeu complexe, notamment pour réduire la déforestation dans le Parc National des Virunga sans augmenter le prix du makala pour les ménages de Goma. Le projet éco-makala repose sur l'objectif de commercialiser du makala durable, produit légalement, dit éco-makala, qui est produit à partir d'arbres à croissance rapide, plantés sur les zones périphériques du Parc National des Virunga.",
    name: "Herman Jensen",
    title: "Makala → ecomakala",
    img: Project1,
  },
  {
    id: "feedback-2",
    content:
      "Soutenir la transition vers un approvisionnement énergétique durable et éviter la déforestation.L'Est de la RDC et plus précisément la province du Nord-Kivu est la région la plus densément peuplée de la République démocratique du Congo (RDC). Plus de 90% de la population dépend du bois énergie et/ou du charbon de bois pour ses besoins énergétiques. Ces deux faits entraînent une énorme pression sur les ressources forestières de la région. La quantité de ressources forestières légales n'est pas suffisante pour assurer les besoins de la population locale, entraînant une augmentation importante des coûts d'achat de bois et de charbon de bois (pression sur les ménages) et une dépendance de l'approvisionnement par l'exploitation illégale et non durable des les forêts du Parc Naturel des Virunga (ViPN), le parc le plus ancien et le plus diversifié d'Afrique. Le ViNP est reconnu comme site du patrimoine mondial de l'UNESCO, mais souffre de déforestation et de dégradation principalement dues à l'expansion agricole et à l'extraction de bois à des fins énergétiques pour et par la population locale. Mais, le commerce du charbon de bois est une activité presque totalement illégale aux mains de groupes armés et les prix continuent d'augmenter, et donc pas en faveur de la population locale.",
    name: "Steve Mark",
    title: "Efficacité énergétique / Reboisement",
    img: Project2,
  },
  {
    id: "feedback-3",
    content:
      "Reboisement avec des plantations d'arbres exploitables autour du Parc National des Virunga à travers un programme local intégré avec des co-bénéfices socio-économiques importants pour la population locale.Les principaux acteurs du projet sont le millier de petits agriculteurs, propriétaires fonciers possédant moins de 5 ha de terres et planteurs d'arbres candidats à la production de makala dans la zone choisie pour le projet. L'intérêt de travailler avec des petits agriculteurs est triple : ils peuvent réellement bénéficier du développement de nouvelles techniques, débloquer de nouvelles sources de revenus et réduire les risques de destruction, de vol ou d'extorsion grâce au nombre élevé de parcelles plantées (voir encadré 1). La propriété foncière est une question complexe pour les petits planteurs d'arbres. Sous l'égide des autorités traditionnelles et administratives, le projet visait à s'assurer que toutes les terres envisagées pour la plantation d'arbres ne faisaient pas l'objet d'un litige foncier et que le candidat à la plantation était autorisé par les autorités à utiliser la terre. La sécurité foncière, qu'elle soit réelle ou de facto, devrait garantir que le planteur d'arbres a le droit d'exploiter la terre au moins jusqu'à ce que la plantation soit mûre pour la récolte. Un autre facteur crucial dans notre choix de parcelles à planter était de s'assurer que les parcelles de reboisement ne se trouvaient pas dans le parc national des Virunga. Nous nous sommes également assurés que les parcelles choisies n'avaient pas fait l'objet d'une exploitation forestière primaire ou secondaire ou d'une plantation récemment récoltée.",
    name: "Kenn Gallagher",
    title: "Préserver : Reboisement",
    img: Project3,
  },
];

export const stats = [
  {
    id: "stats-1",
    title: "Ha plantés",
    value: "13k+",
    describe1: "Plus de 13.000 ha ont été plantés entre",
    describe2: " 2009 - 2019",
  },
  {
    id: "stats-2",
    title: "Personnes et partenariats",
    value: "10k+",
    describe1: "10.000 arboriculteurs ont été formés 84 associations ",
    describe2: "locales sont impliquées",
  },
  {
    id: "stats-3",
    title: "La surface de Goma",
    value: "1959",
    describe1: "1959 = 4.8 Km2 ",
    describe2: "2004 = 35 km² → 2015 = 75 km²",
  },
  {
    id: "stats-4",
    title: "Population in Goma",
    value: "670k",
    describe1: "2004 = 550.000 ",
    describe2: "2020 = 670.000",
  },
];

export const footerLinks = [
  {
    id: "footerLinks-1",
    title: "Liens Utiles",
    links: [
      {
        name: "Content",
        link: "https://www.hoobank.com/content/",
      },

      {
        name: "ODD et co-bénéfices",
        link: "https://www.hoobank.com/create/",
      },
      {
        name: "Faits et chiffres",
        link: "https://www.hoobank.com/explore/",
      },
      {
        name: "Partenaires",
        link: "https://www.hoobank.com/terms-and-services/",
      },
      {
        name: "Contact",
        link: "https://www.hoobank.com/terms-and-services/",
      },
    ],
  },
  {
    id: "footerLinks-2",
    title: "Programme",
    links: [
      {
        name: "Makala → ecomakala",
        link: "https://www.hoobank.com/help-center/",
      },

      {
        name: "Efficacité énergétique / Reboisement",
        link: "https://www.hoobank.com/partners/",
      },
      {
        name: "Préserver : Reboisement",
        link: "https://www.hoobank.com/suggestions/",
      },
    ],
  },
  {
    id: "footerLinks-3",
    title: "Contact",
    links: [
      {
        name: "+243 994 261 583",
        link: "",
      },
      {
        name: "+243 998 054 815",
        link: "",
      },
      {
        name: "contact@ugpcarbonenk.cd",
        link: "mailto:contact@ugpcarbonenk.cd",
      },
      {
        name: " Goma,Nord-Kivu, RDC",
        link: "",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];

export const clients = [
  {
    id: "client-1",
    title: "Philantropist: UCB",
    logo: UCB,
    content:
      "L'ambition d'UCB est de transformer la vie des personnes atteintes de maladies graves.Nous nous concentrons sur les troubles neurologiques et immunologiques - plaçant les patients au centre de notre monde. Nous sommes inspirés par les patients. Guidé par la science.",
  },
  {
    id: "client-2",
    title: "Porteur de projet : CO2logic",
    logo: COD,
    content:
      "CO2logic est une organisation internationale et indépendante de conseil sur le climat.CO2logic est spécialisé dans le calcul, la réduction et la compensation des émissions de CO2. Il aide les organisations dans leur transition vers une économie bas carbone et à valeur ajoutée.",
  },
  {
    id: "client-3",
    title: "ONG locale et agriculteurs",
    logo: "",
    content:
      "Le projet ecomakala-virunga climat & reboisement est conçu comme un projet de reboisement communautaire, par conséquent,de nombreuses communautés des territoires de Masisi, Rutshuru, Lubero et Beni sont celles qui mettent en œuvre les activités de reboisement. Ils bénéficieront grandement du projet. C'est un projet climatique par le peuple pour le peuple",
  },
  {
    id: "client-4",
    title: "",
    logo: WWF,
    content:
      "Pour cela, les petits propriétaires terriens sont organisés en associations, qui s'engagent auprès du WWF pour mener à bien les activités de reboisement.Depuis sa création en 2007, le Projet a impliqué 67 associations paysannes locales et signé 6.199 contrats de reboisement, ce qui représente la participation de 4.933 planteurs.",
  },
];
