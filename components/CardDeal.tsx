import { card } from "@/public/assets";
import styles, { layout } from "@/styles/style";
import Button from "./Button";
import Image from "next/image";
import ContImg from "@/public/assets/contextimg-removebg.png";

const CardDeal: React.FC = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className="font-poppins font-semibold xs:text-[48px] text-[40px] text-slate-700 xs:leading-[76.8px] leading-[66.8px] w-full">
        Context
      </h2>
      <p className="font-poppins font-normal text-black text-[14px] leading-[20.8px] max-w-[470px] mt-5">
        Apprenez à nous connaître LE CONTEXTE Le changement climatique et la
        perte de biodiversité sont les défis majeurs de notre génération. Le
        carbone retient l’attention locale, nationale et internationale pour la
        lutte contre le changement climatique.
      </p>
      <Button styles="mt-5" />
    </div>
    <div className={`${layout.sectionImg} relative`}>
      {/* Floating Image */}
      <div className="relative mx-auto max-w-[400px] rounded-lg  transition-all duration-300 hover:shadow-2xl hover:scale-105">
        <Image src={ContImg} alt="card" className="rounded-lg object-cover" />
      </div>
    </div>
  </section>
);

export default CardDeal;
