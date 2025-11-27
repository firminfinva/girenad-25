"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/style";
import Image from "next/image";

interface HomepagePartner {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  order: number;
}

const Partenaire: React.FC = () => {
  const [partners, setPartners] = useState<HomepagePartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/homepage-partners");
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Hide section while loading
  }

  if (partners.length === 0) {
    return null; // Hide section if no partners
  }

  return (
    <section id="partenaires" className="my-4">
      <h1 className="font-poppins font-semibold xs:text-[48px] text-[40px] text-black xs:leading-[76.8px] leading-[66.8px] w-full">
        LES PARTENAIRES
      </h1>
      <div className={`${styles.flexCenter} flex-wrap w-full gap-8`}>
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform duration-300"
          >
            {partner.logo ? (
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={120}
                className="w-[120px] h-[120px] object-contain"
              />
            ) : null}
            <h1 className="font-poppins font-semibold text-[20px] text-black text-center mt-4">
              {partner.name}
            </h1>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partenaire;
