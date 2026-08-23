export const dynamic = "force-dynamic"; // ensure page fetches live data on every request in production
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
              <Link href={`/offers/${offer.id}`}>
                <h2 className={styles.cardTitle}>{offer.title}</h2>
              </Link>
              <p className={styles.cardExpiry}>
                <strong>Date d'expiration:</strong>{" "}
                {offer.submissionDeadline
                  ? new Date(offer.submissionDeadline).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          ))
        ) : (
          <p>Aucune offre disponible pour le moment.Merci</p>
        )}
      </div>
    </div>
  );
}
