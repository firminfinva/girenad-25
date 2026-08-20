"use client";
import React, { useState } from "react";
import { useAuthVerification } from "@/hooks/useAuthVerification";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function CreateOfferPage() {
  const { loading: authLoading } = useAuthVerification("ADMIN");
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Basic fields
  const [title, setTitle] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [contractType, setContractType] = useState("");
  const [location, setLocation] = useState("");
  const [vacanciesCount, setVacanciesCount] = useState(1);
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [organizationDescription, setOrganizationDescription] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [positionObjective, setPositionObjective] = useState("");
  const [responsibilities, setResponsibilities] = useState<string>("");
  const [requirements, setRequirements] = useState<string>("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [submissionEmail, setSubmissionEmail] = useState("");
  const [emailSubjectFormat, setEmailSubjectFormat] = useState("");

  async function handleUploadPdf() {
    if (!pdfFile) return setToast("Choisir un fichier PDF d'abord.");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", pdfFile);
      fd.append("resourceType", "raw");
      fd.append("folder", "job_offers");

      if (!token) {
        setToast("Utilisateur non authentifié.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      setPdfUrl(json.url);
      setToast("PDF uploaded.");

      // Attempt auto-parse (stub)
      const p = await fetch("/api/offers/parse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pdfUrl: json.url }),
      });
      if (p.ok) {
        const parsed = await p.json();
        const data = parsed.extraction || {};
        if (data.title) setTitle(data.title);
        if (data.referenceNumber) setReferenceNumber(data.referenceNumber);
        if (data.location) setLocation(data.location);
        if (data.contractType) setContractType(data.contractType);
        if (data.submissionDeadline) setSubmissionDeadline(data.submissionDeadline);
        if (data.responsibilities) setResponsibilities((data.responsibilities || []).join("\n"));
        if (data.requirements) setRequirements((data.requirements || []).join("\n"));
      }
    } catch (err: any) {
      setToast(err?.message || "Erreur lors de l'upload");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    setLoading(true);
    try {
      const body = {
        title,
        referenceNumber,
        contractType,
        vacanciesCount,
        location,
        duration,
        startDate,
        organizationDescription,
        projectDescription,
        positionObjective,
        responsibilities: responsibilities.split(/\n+/).map((s) => s.trim()).filter(Boolean),
        requirements: requirements.split(/\n+/).map((s) => s.trim()).filter(Boolean),
        applicationDocuments: [],
        submissionDeadline: submissionDeadline || null,
        submissionEmail,
        emailSubjectFormat,
        pdfUrl,
      };

      if (!token) {
        setToast("Utilisateur non authentifié.");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/offers`, {
        method: "POST",
        headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Erreur lors de la création");
      setToast("Offre publiée.");
      // redirect to detail
      router.push(`/offers/${json.offer.id}`);
    } catch (err: any) {
      setToast(err?.message || "Erreur lors de la publication");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Créer une offre d'emploi</h1>

      <section className="mb-6">
        <h2 className="font-semibold">Option A — Importer depuis PDF</h2>
        <div className="mt-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
          />
          <button onClick={handleUploadPdf} disabled={loading} className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
            {loading ? "Uploading..." : "Upload & Parse PDF"}
          </button>
          {pdfUrl && (
            <div className="mt-2 text-sm">PDF uploaded: <a href={pdfUrl} target="_blank" rel="noreferrer" className="underline">Open</a></div>
          )}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold">Option B — Saisie manuelle</h2>
        <div className="grid grid-cols-1 gap-3">
          <input placeholder="Titre de l'offre" value={title} onChange={(e)=>setTitle(e.target.value)} className="border p-2" />
          <input placeholder="Numéro de référence" value={referenceNumber} onChange={(e)=>setReferenceNumber(e.target.value)} className="border p-2" />
          <input placeholder="Type de contrat" value={contractType} onChange={(e)=>setContractType(e.target.value)} className="border p-2" />
          <input placeholder="Lieu" value={location} onChange={(e)=>setLocation(e.target.value)} className="border p-2" />
          <input type="number" placeholder="Nombre de postes" value={String(vacanciesCount)} onChange={(e)=>setVacanciesCount(Number(e.target.value))} className="border p-2" />
          <input placeholder="Durée" value={duration} onChange={(e)=>setDuration(e.target.value)} className="border p-2" />
          <input placeholder="Date de début" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="border p-2" />
        </div>

        <div className="mt-4">
          <textarea placeholder="Présentation de l'organisation" value={organizationDescription} onChange={(e)=>setOrganizationDescription(e.target.value)} className="w-full border p-2 h-24" />
          <textarea placeholder="Contexte du projet" value={projectDescription} onChange={(e)=>setProjectDescription(e.target.value)} className="w-full border p-2 h-24 mt-2" />
          <textarea placeholder="Objectif du poste" value={positionObjective} onChange={(e)=>setPositionObjective(e.target.value)} className="w-full border p-2 h-20 mt-2" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <label className="font-medium">Principales responsabilités (une par ligne)</label>
          <textarea value={responsibilities} onChange={(e)=>setResponsibilities(e.target.value)} className="w-full border p-2 h-32" />

          <label className="font-medium">Exigences (une par ligne)</label>
          <textarea value={requirements} onChange={(e)=>setRequirements(e.target.value)} className="w-full border p-2 h-32" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <input type="date" value={submissionDeadline} onChange={(e)=>setSubmissionDeadline(e.target.value)} className="border p-2" />
          <input placeholder="Email de soumission" value={submissionEmail} onChange={(e)=>setSubmissionEmail(e.target.value)} className="border p-2" />
          <input placeholder="Format sujet email" value={emailSubjectFormat} onChange={(e)=>setEmailSubjectFormat(e.target.value)} className="border p-2" />
        </div>

        <div className="mt-6">
          <button onClick={handlePublish} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading?"Publishing...":"Publish Offer"}</button>
        </div>
      </section>

      {toast && <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded">{toast}</div>}
    </div>
  );
}
