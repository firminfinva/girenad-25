"use client";

import React, { useState } from "react";
import styles from "@styles/JobOffers.module.css";
import jobOffers from "@constants/jobsTable";

const JobOffers = () => {
  const [filter, setFilter] = useState<"all" | "new" | "expired">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

  // Filter job offers based on the selected filter
  const filteredOffers = jobOffers.filter((offer) => {
    const currentDate = new Date();
    const offerDate = new Date(offer.expiryDate);

    if (filter === "new") {
      return offerDate > currentDate; // Show only new offers
    } else if (filter === "expired") {
      return offerDate <= currentDate; // Show only expired offers
    } else {
      return true; // Show all offers
    }
  });

  // Calculate the current page's offers
  const indexOfLastOffer = currentPage * itemsPerPage;
  const indexOfFirstOffer = indexOfLastOffer - itemsPerPage;
  const currentOffers = filteredOffers.slice(
    indexOfFirstOffer,
    indexOfLastOffer
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  return (
    <div className={styles.container}>
      {/* Sidebar Filters */}
      <div className={styles.sidebar}>
        <h2>Filtres</h2>
        <div className={styles.sidebarbutton}>
          <button
            className={`${styles.filterButton} ${
              filter === "all" ? styles.active : ""
            }`}
            onClick={() => setFilter("all")}
          >
            Tout
          </button>
          <button
            className={`${styles.filterButton} ${
              filter === "new" ? styles.active : ""
            }`}
            onClick={() => setFilter("new")}
          >
            Nouvelles Offres
          </button>
          <button
            className={`${styles.filterButton} ${
              filter === "expired" ? styles.active : ""
            }`}
            onClick={() => setFilter("expired")}
          >
            Offres Expirées
          </button>
        </div>
      </div>

      {/* Job Offers */}
      <div className={styles.offers}>
        {currentOffers.length > 0 ? (
          currentOffers.map((offer) => (
            <>
              <div key={offer.id} className={styles.offerCard}>
                <a href={`/offres/${offer.id}`}>
                  <h2 className={styles.cardTitle}>{offer.title}</h2>
                </a>
                {/* <p className={styles.cardDescription}>{offer.description}</p> */}
                <p className={styles.cardExpiry}>
                  <strong>Date d'expiration:</strong>{" "}
                  {new Date(offer.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </>
          ))
        ) : (
          <p>Aucune offre disponible pour le filtre sélectionné.</p>
        )}
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`${styles.pageButton} ${
                currentPage === index + 1 ? styles.active : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={styles.pageButton}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Suivant
          </button>
        </div>
      </div>

      {/* Pagination */}
    </div>
  );
};

export default JobOffers;
