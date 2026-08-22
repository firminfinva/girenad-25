import prisma from "@/lib/prisma";
import React from "react";

type Props = { params: { id: string } };

export default async function OfferDetail({ params }: Props) {
  const id = params.id;
  const offer = await prisma.jobOffer.findUnique({ where: { id } });
  if (!offer) return <div className="p-6">Offre introuvable</div>;

  const responsibilities: string[] = Array.isArray(offer.responsibilities)
    ? offer.responsibilities
    : (offer.responsibilities as any) ?? [];
  const requirements: string[] = Array.isArray(offer.requirements)
    ? offer.requirements
    : (offer.requirements as any) ?? [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{offer.title}</h1>
          <p className="text-sm text-gray-600">{offer.referenceNumber}</p>
        </div>
      </header>

      {/* PDF download is shown in a fixed bottom bar for all offer detail pages */}

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="mb-4">
            <h3 className="font-semibold">Organization & Project Overview</h3>
            <p className="mt-2 whitespace-pre-wrap">{offer.organizationDescription || offer.projectDescription || "-"}</p>
          </div>

          <div className="mb-4 p-4 bg-gray-50 border rounded">
            <h3 className="font-semibold">Position Objective</h3>
            <p className="mt-2">{offer.positionObjective || "-"}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Tasks & Responsibilities</h3>
            <ul className="list-disc ml-6 mt-2">
              {responsibilities.length ? (
                responsibilities.map((r, i) => <li key={i}>{r}</li>)
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Candidate Profile & Requirements</h3>
            <ul className="list-disc ml-6 mt-2">
              {requirements.length ? (
                requirements.map((r, i) => <li key={i}>{r}</li>)
              ) : (
                <li>-</li>
              )}
            </ul>
          </div>

          <div className="mb-4 p-4 border rounded">
            <h3 className="font-semibold">How to Apply</h3>
            <p className="mt-2">Deadline: {offer.submissionDeadline ? new Date(offer.submissionDeadline).toLocaleDateString() : "-"}</p>
            <p>Email: {offer.submissionEmail || "-"}</p>
            <p>Subject format: {offer.emailSubjectFormat || "-"}</p>
          </div>
        </div>

        <aside className="p-4 border rounded">
          <h4 className="font-semibold">Quick Info</h4>
          <dl className="mt-2 text-sm grid gap-1">
            <div><strong>Contract:</strong> {offer.contractType || "-"}</div>
            <div><strong>Location:</strong> {offer.location || "-"}</div>
            <div><strong>Vacancies:</strong> {offer.vacanciesCount ?? "-"}</div>
            <div><strong>Duration:</strong> {offer.duration || "-"}</div>
            <div><strong>Recruitment Type:</strong> {offer.recruitmentType || "-"}</div>
            <div><strong>Start Date:</strong> {offer.startDate || "-"}</div>
            {offer.pdfUrl && (
              <div className="mt-2 text-sm">
                <strong>Document offert:</strong>
                <div className="text-xs text-gray-600">PDF disponible</div>
              </div>
            )}
          </dl>
        </aside>
      </section>

      {offer.pdfUrl && (
        <section className="mb-6">
          <h3 className="font-semibold text-blue-900">Document de l'offre</h3>
          <p className="mt-2 text-sm text-blue-800">Pour plus de détails, téléchargez le PDF officiel de cette offre.</p>
          <div className="mt-4">
            <a
              href={offer.pdfUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="inline-block px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Télécharger le PDF de l'offre
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
