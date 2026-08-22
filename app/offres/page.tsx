import prisma from "@/lib/prisma";
import Link from "next/link";
import styles from "@styles/JobOffers.module.css";

export default async function JobOffersPage() {
  const offers = await prisma.jobOffer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2>Filtres</h2>
        <div className={styles.sidebarbutton}>
          <button className={`${styles.filterButton} ${styles.active}`} type="button">
            Tout
          </button>
        </div>
      </div>

      <div className={styles.offers}>
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div key={offer.id} className={styles.offerCard}>
              <div className="flex items-center justify-between">
                <Link href={`/offers/${offer.id}`}>
                  <h2 className={styles.cardTitle}>{offer.title}</h2>
                </Link>
                <div className="flex gap-2">
                  {offer.pdfUrl && (
                    <a
                      href={offer.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="px-2 py-1 border rounded text-sm"
                    >
                      Télécharger PDF
                    </a>
                  )}
                </div>
              </div>

              <p className={styles.cardExpiry}>
                <strong>Date d'expiration:</strong>{" "}
                {offer.submissionDeadline
                  ? new Date(offer.submissionDeadline).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          ))
        ) : (
          <p>Aucune offre disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
}
