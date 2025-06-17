import { clients } from "@/constants";
import styles from "@/styles/style";
import Image from "next/image";
const Partenaire: React.FC = () => (
  <section id="partenaires" className="my-4">
    <h1 className="font-poppins font-semibold xs:text-[48px] text-[40px] text-black xs:leading-[76.8px] leading-[66.8px] w-full">
      LES PARTENAIRES
    </h1>
    <div className={`${styles.flexCenter} flex-wrap w-full gap-8`}>
      {clients.map((client) => (
        <div
          key={client.id}
          className="flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform duration-300"
        >
          {client?.logo ? (
            <Image
              src={client.logo}
              alt="client"
              className="w-[120px] h-[120px] object-contain"
            />
          ) : null}
          <h1 className="font-poppins font-semibold text-[20px] text-black text-center mt-4">
            {client.title}
          </h1>
        </div>
      ))}
    </div>
  </section>
);
export default Partenaire;
