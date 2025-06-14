"use client";

import { useState, useEffect } from "react";

// Define the type for a single job offer
interface JobOffer {
  title: string;
  description: string;
  expiryDate: string;
}

// Define the props for the JobOffers component
interface JobOffersProps {
  offers: JobOffer[];
}

const JobOffers: React.FC<JobOffersProps> = ({ offers }) => {
  const [filter, setFilter] = useState<"all" | "new" | "expired">("all");
  const [filteredOffers, setFilteredOffers] = useState<JobOffer[]>([]);

  useEffect(() => {
    const currentDate = new Date();
    if (filter === "new") {
      setFilteredOffers(
        offers.filter((offer) => new Date(offer.expiryDate) > currentDate)
      );
    } else if (filter === "expired") {
      setFilteredOffers(
        offers.filter((offer) => new Date(offer.expiryDate) <= currentDate)
      );
    } else {
      setFilteredOffers(offers);
    }
  }, [filter, offers]);

  return (
    <div>
      <div>
        <button onClick={() => setFilter("all")}>All Offers</button>
        <button onClick={() => setFilter("new")}>New Offers</button>
        <button onClick={() => setFilter("expired")}>Expired Offers</button>
      </div>

      {filteredOffers?.length > 0 ? (
        <ul>
          {filteredOffers.map((offer, index) => (
            <li key={index}>
              <h2>{offer.title}</h2>
              <p>{offer.description}</p>
              <p>
                Expiry Date: {new Date(offer.expiryDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No offers available.</p>
      )}
    </div>
  );
};

export default JobOffers;
