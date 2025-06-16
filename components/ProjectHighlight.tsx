import styles from "@/styles/style";
import { layout } from "@/styles/style";
import Button from "./Button";

const ProjectHighlight: React.FC = () => (
  <section className={`${layout.section} bg-green-50 py-16`}>
    <div className={`${styles.boxWidth} mx-auto px-4`}>
      <h2 className="text-4xl font-bold text-center mb-12 text-green-800">
        Projet en cours
      </h2>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-green-800">
          Gestion communautaire des forêts à Ikobo (2025)
        </h3>
        <p className="text-gray-700 mb-8">
          GIRENAD, avec l'appui de RRI, accompagne la communauté d'Ikobo
          (Nord-Kivu) dans la gestion durable de ses forêts coutumières.
          Objectif : renforcer les droits fonciers, protéger les ressources, et
          améliorer les moyens de subsistance locaux.
        </p>
        <Button styles="mt-5" text="Voir le projet" />
      </div>
    </div>
  </section>
);

export default ProjectHighlight;
