import styles from "@/styles/style";
import { layout } from "@/styles/style";
import Image from "next/image";
import { FaUsers, FaHandshake, FaBalanceScale, FaLeaf } from "react-icons/fa";

const AboutUs: React.FC = () => (
  <section id="about" className={`${layout.section} bg-white py-16`}>
    <div className={`${styles.boxWidth} mx-auto px-4`}>
      <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">
        Qui sommes-nous ?
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Vision */}
        <div className="bg-green-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-semibold mb-4 text-green-800">Vision</h3>
          <p className="text-gray-700">
            Des communautés locales actrices d'un développement équitable et
            durable grâce à la bonne gouvernance et la gestion inclusive des
            ressources naturelles.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-green-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-semibold mb-4 text-green-800">
            Mission
          </h3>
          <p className="text-gray-700">
            Accompagner les communautés, les entités territoriales et le secteur
            privé pour un développement local durable, respectueux des droits
            humains et de l'environnement.
          </p>
        </div>

        {/* Objectifs stratégiques */}
        <div className="bg-green-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-semibold mb-4 text-green-800">
            Objectifs stratégiques
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <FaUsers className="mr-2 text-green-600" />
              Renforcer les capacités des partenaires locaux
            </li>
            <li className="flex items-center text-gray-700">
              <FaHandshake className="mr-2 text-green-600" />
              Consolider la gouvernance locale et la décentralisation
            </li>
            <li className="flex items-center text-gray-700">
              <FaBalanceScale className="mr-2 text-green-600" />
              Promouvoir l'égalité des sexes et la paix
            </li>
            <li className="flex items-center text-gray-700">
              <FaLeaf className="mr-2 text-green-600" />
              Plaidoyer pour les droits d'accès et de gestion des ressources
              naturelles
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default AboutUs;
