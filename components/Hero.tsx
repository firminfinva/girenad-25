import styles from "@/styles/style";
import { discount, robot } from "@/public/assets";
// import bgImg from "@/public/assets/blog-v2-2.png";

import GetStarted from "./GetStarted";
import Image from "next/image";

const Hero: React.FC = () => (
  <section
    id="home"
    className={`flex bg-slate-50 text-black md:flex-row flex-col ${styles.paddingY} ${styles.paddingY} bg-[url('/assets/bg2.jpg')] bg-cover bg-center `}
  >
    <div
      className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
    >
      <div className=" flex flex-row items-center py-[6px] px-4 bg-slate-900 rounded-[10px] mb-2">
        <p
          className={`font-poppins font-normal text-dimWhite sm:text-[12px] text-[10px] leading-[30.8px] ml-2`}
        >
          <span className="">
            Énergie durable, lutte contre la pauvreté et protection des forêts
            des Virunga au Nord-Kivu (RDC).
          </span>
        </p>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="flex-1 font-poppins font-semibold ss:text-[40px] text-[45px] ss:leading-[65px] leading-[75px]">
          PROTECTION DU
          <span className="text-gradient"> CLIMAT</span>{" "}
        </h1>
      </div>
      <h1 className="w-full font-poppins font-semibold ss:text-[40px] text-[40px]  ss:leading-[65px] leading-[60px]">
        PAR LE REBOISEMENT ET L'EFFICACITÉ ÉNERGÉTIQUE
      </h1>
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
