import styles, { layout } from "@/styles/style";
import { features } from "@/constants";
import Button from "./Button";
import Image from "next/image";
import { FeatredCardProps } from "@types";

const FeaturesCard: React.FC<FeatredCardProps> = ({
  icon,
  title,
  content,
  index,
}) => (
  <div
    className={`flex flex-row p-6 rounded-[20px] ${
      index !== features.length - 1 ? "mb-6" : "mb-0"
    } feature-card`}
  >
    <div
      className={`w-[64px] h-[64px] rounded-full bg-dimBlue ${styles.flexCenter}`}
    >
      <Image src={icon} alt="icon" className="w-[50%] h-[50%] object-contain" />
    </div>
    <div className="flex-1 flex flex-col ml-3">
      <h4 className="font-poppins font-semibold text-white text-[18px] leading-[24px]">
        {title}
      </h4>
      <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">
        {content}
      </p>
    </div>
  </div>
);
const Business: React.FC = () => (
  <section id="features" className={`${layout.section} flex`}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Conservation & Développement, <br className="sm:block hidden" />
        <span className="text-[20px]">Gouvernance, Droits, Durabilité.</span>
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Notre mission est d'accompagner les communautés locales dans la gestion
        durable des ressources naturelles. Nous travaillons à renforcer la
        gouvernance locale, protéger la biodiversité et créer des moyens de
        subsistance durables pour les populations du Nord-Kivu, tout en
        préservant les écosystèmes fragiles de la région.
      </p>
    </div>
    <div className={`${layout.sectionImg} flex-col`}>
      {features.map((feature, index) => (
        <FeaturesCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </section>
);

export default Business;
