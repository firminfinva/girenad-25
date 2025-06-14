import { clients } from "@/constants";
import styles from "@/styles/style";
import Image from "next/image";
const Partenaire: React.FC = () => (
  <section className="my-4">
    <h1 className="font-poppins font-semibold xs:text-[48px] text-[40px] text-black xs:leading-[76.8px] leading-[66.8px] w-full">
      LES PARTENAIRES
    </h1>
    <div className={`${styles.flexCenter} flex-wrap w-full `}>
      {clients.map((client) => (
        <div
          key={client.id}
          className="xs:w-[25%] w-[100%] xs:mb-0 mb-12 xs:bg-white bg-slate-100 p-2"
        >
          {client?.logo ? (
            <>
              <Image
                src={client.logo}
                alt="client"
                className="xs:w-[80px] w-[100px] object-contain hover:-translate-y-2 cursor-pointer transition-all ease-in-out"
              />
              <br />
            </>
          ) : (
            <></>
          )}

          <h1 className="font-poppins font-semibold xs:text-[28px] text-[20px] text-black xs:leading-[26.8px] leading-[26.8px] w-full">
            {client.title}
          </h1>
          <p className="font-poppins font-normal xs:text-[12px] text-[11px] text-black xs:leading-[24.8px] leading-[14.8px] w-full">
            {client.content}
          </p>
        </div>
      ))}
    </div>
  </section>
);
export default Partenaire;
