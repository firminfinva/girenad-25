import { apple, bill, google } from "@/public/assets";
import styles, { layout } from "@/styles/style";
import Image from "next/image";
import Odd from "@/public/assets/odd.png";
const TheOdd: React.FC = () => (
  <section id="product" className={layout.sectionReverse}>
    <div className={layout.sectionImgReverse}>
      <Image
        src={Odd}
        alt="billing"
        className="w-[100%] h-[100%] relative z-[5]"
      />
      <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
      <div className="absolute z-[0] -left-1/2 bottom-0 w-[50%] h-[50%] rounded-full pink__gradient" />
    </div>
    <div className={`${layout.sectionInfo}`}>
      <h2 className="font-poppins font-semibold xs:text-[48px] text-[40px] text-black xs:leading-[76.8px] leading-[66.8px] w-full">
        ODD & PRINCIPAUX <br className="sm:block hidden" /> CO-BÉNÉFICES
      </h2>
      <p className="font-poppins font-normal text-black text-[18px] leading-[30.8px]  max-w-[470px] mt-5">
        Le projet climatique ecomakala contribue à de nombreux objectifs de
        développement durable (ODD) des Nations Unies tels que Pas de pauvreté,
        Faim zéro, Bonne santé et bien-être, Travail décent et croissance
        économique, Villes et communautés durables, Consommation et production
        responsables, Action pour le climat, Vie sur terre & Partenariats pour
        les objectifs.
      </p>
    </div>
  </section>
);

export default TheOdd;
