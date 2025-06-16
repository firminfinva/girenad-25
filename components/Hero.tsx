import styles from "@/styles/style";
import { discount, robot } from "@/public/assets";
// import bgImg from "@/public/assets/blog-v2-2.png";

import GetStarted from "./GetStarted";
import Image from "next/image";
import Button from "./Button";

const Hero: React.FC = () => (
  <section
    id="home"
    className={`flex bg-slate-50 text-black md:flex-row flex-col ${styles.paddingY} ${styles.paddingY} bg-[url('/assets/bg2.jpg')] bg-cover bg-center `}
  >
    <div
      className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
    >
      <div className="flex flex-row items-center py-[6px] px-4 bg-slate-900 rounded-[10px] mb-2 w-full">
        <p
          className={`font-poppins font-normal text-dimWhite sm:text-[11px] text-[9px] leading-[30.8px] ml-2 md:whitespace-nowrap`}
        >
          <span className="">
            Groupe d'Appui à la Gestion Intégrée des Ressources Naturelles pour
            les Droits Humains et le Développement Durable
          </span>
        </p>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="flex-1 font-poppins font-semibold ss:text-[40px] text-[45px] ss:leading-[65px] leading-[75px]">
          Nous accompagnons les communautés locales et les entités territoriales
          dans une gouvernance équitable, inclusive et durable.
        </h1>
      </div>

      {/* <div className="mt-8">
        <Button styles="mt-5" text="En savoir plus" />
      </div> */}
    </div>
    <div className={`${styles.flexCenter} flex-1 flex md:my-0 my-10 relative`}>
      {/* <Image
        src={bgImg}
        alt="billings"
        className="w-[90%] h-[90%] relative z-[5] rounded-[50px]"
      /> */}
      <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
      <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-40 white__gradient" />
      <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
    </div>
  </section>
);

export default Hero;
