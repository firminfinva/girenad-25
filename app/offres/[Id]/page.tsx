"use client";

import React from "react";
import { useParams } from "next/navigation"; // Using Next.js's useParams for navigation
import jobOffers from "@constants/jobsTable"; // Import job offers data
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const JobOfferPage = () => {
  const { Id } = useParams(); // Get the job offer ID from the URL
  const jobOffer = jobOffers.find((offer) => offer.id.toString() === Id); // Find the specific job offer by ID
  const { user } = useAuth();

  if (!jobOffer) {
    return (
      <p className="text-center text-lg text-red-500">
        Offre d'emploi non trouvée.
      </p>
    ); // If the job offer doesn't exist
  }

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/offers/${Id}` : `/offers/${Id}`;

  const copyPublicLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      alert("Lien public copié");
    } catch (err) {
      console.error(err);
    }
  };

  const canEdit = user && (user.role === "ADMIN" || user.role === "SUPERADMIN");

  return (
    <div className="job-offer-page container mx-auto p-10 bg-white rounded-lg shadow-md">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          {jobOffer.title}
        </h1>
        <p className="text-lg text-gray-600 mt-2">{jobOffer.location}</p>
      </header>

      <div className="mb-4 flex gap-3 justify-center">
        <button onClick={copyPublicLink} className="px-3 py-2 border rounded">
          Copier le lien public
        </button>
        {canEdit && (
          <Link href={`/admin/offers/${Id}`} className="px-3 py-2 bg-green-600 text-white rounded">
            Éditer (admin)
          </Link>
        )}
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Détails de l'offre
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <p>
            <strong>Supervision:</strong> {jobOffer.supervision}
          </p>
          <p>
            <strong>Type de Contrat:</strong> {jobOffer.contractType}
          </p>
          <p>
            <strong>Durée:</strong> {jobOffer.duration}
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Mission du Projet
        </h2>
        <p className="text-gray-600 mt-2">{jobOffer.mission}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Responsabilités Générales
        </h2>
        <ul className="list-disc pl-5 mt-2 text-gray-600">
          {jobOffer.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Profil Requis</h2>
        <ul className="list-disc pl-5 mt-2 text-gray-600">
          {jobOffer.profile.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Comment Postuler
        </h2>
        <p className="text-gray-600 mt-2">
          <strong>Date Limite:</strong>{" "}
          {jobOffer.applicationInstructions.deadline}
        </p>
        <p className="mt-2">
          <a
            href={jobOffer.applicationInstructions.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Cliquez ici pour postuler
          </a>
        </p>
        <p className="mt-2 text-gray-600">
          {jobOffer.applicationInstructions.note}
        </p>
      </section>

      {((jobOffer.applicationDocuments && jobOffer.applicationDocuments.length > 0) || typeof jobOffer.applicationDocuments === 'string') && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Documents de candidature</h2>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            {(Array.isArray(jobOffer.applicationDocuments)
              ? jobOffer.applicationDocuments
              : String(jobOffer.applicationDocuments).split(/\n+/).map(s => s.trim()).filter(Boolean)
            ).map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800">
        <p className="text-lg font-semibold">
          <strong>Note:</strong> Tous les documents doivent être soumis sous
          forme de lien, tel que Google Docs ou tout autre lien de partage.
        </p>
      </section>

      {jobOffer.pdfUrl && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Télécharger le PDF</h2>
          <div className="mt-2 p-4 border rounded bg-gray-50 text-center">
            <a href={jobOffer.pdfUrl} target="_blank" rel="noopener noreferrer" download className="px-4 py-2 bg-blue-600 text-white rounded inline-block">
              Télécharger le PDF
            </a>
          </div>
        </section>
      )}

      <footer className="text-center mt-6 text-gray-500">
        <p>
          <em>
            Publié le {new Date(jobOffer.publicationDate).toLocaleDateString()}
          </em>
        </p>
      </footer>
    </div>
  );
};

export default JobOfferPage;
