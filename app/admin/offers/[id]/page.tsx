"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminEditOfferPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user, token, loading } = useAuth();

  const [loadingOffer, setLoadingOffer] = useState(true);
  const [offer, setOffer] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchOffer = async () => {
      setLoadingOffer(true);
      try {
        const res = await fetch(`/api/offers?id=${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          const o = data.offer || data;
          // normalize JSON fields to arrays/strings for the form
          o.responsibilities = Array.isArray(o.responsibilities) ? o.responsibilities.join("\n") : (o.responsibilities ? JSON.stringify(o.responsibilities) : "");
          o.requirements = Array.isArray(o.requirements) ? o.requirements.join("\n") : (o.requirements ? JSON.stringify(o.requirements) : "");
          o.applicationDocuments = Array.isArray(o.applicationDocuments) ? o.applicationDocuments.join("\n") : (o.applicationDocuments ? JSON.stringify(o.applicationDocuments) : "");
          setOffer(o);
        } else {
          setError("Impossible de charger l'offre.");
        }
      } catch (err) {
        setError("Erreur réseau.");
      } finally {
        setLoadingOffer(false);
      }
    };
    fetchOffer();
  }, [id]);

  if (loading) return <p>Chargement...</p>;

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
    return <p>Accès refusé. Vous devez être administrateur.</p>;
  }

  if (loadingOffer) return <p>Chargement de l'offre...</p>;

  if (!offer) return <p>Offre introuvable.</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOffer((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleUploadPdf = async () => {
    if (!pdfFile) {
      setError("Choisir un fichier PDF d'abord.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", pdfFile);
      fd.append("resourceType", "raw");
      fd.append("folder", "job_offers");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Erreur upload");
      setOffer((prev: any) => ({ ...prev, pdfUrl: json.url }));
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // prepare payload, converting textareas into arrays where needed
      const payload: any = { id };
      const fields = [
        "title",
        "referenceNumber",
        "contractType",
        "vacanciesCount",
        "location",
        "duration",
        "recruitmentType",
        "startDate",
        "organizationDescription",
        "projectDescription",
        "positionObjective",
        "applicationDocuments",
        "submissionDeadline",
        "submissionEmail",
        "emailSubjectFormat",
        "pdfUrl",
      ];

      for (const f of fields) {
        if (offer[f] !== undefined) payload[f] = offer[f];
      }

      // convert counts and dates
      if (payload.vacanciesCount !== undefined) payload.vacanciesCount = Number(payload.vacanciesCount) || null;
      if (payload.submissionDeadline) payload.submissionDeadline = new Date(payload.submissionDeadline);

      // convert responsibilities/requirements/applicationDocuments from newline to arrays
      payload.responsibilities = offer.responsibilities ? offer.responsibilities.split(/\n+/).map((s: string) => s.trim()).filter(Boolean) : [];
      payload.requirements = offer.requirements ? offer.requirements.split(/\n+/).map((s: string) => s.trim()).filter(Boolean) : [];
      payload.applicationDocuments = offer.applicationDocuments ? offer.applicationDocuments.split(/\n+/).map((s: string) => s.trim()).filter(Boolean) : [];

      const res = await fetch("/api/offers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/offers`);
      } else {
        const data = await res.json();
        setError(data?.error || "Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      setError("Erreur réseau lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Modifier l'offre</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        <div>
          <label className="block font-medium">Titre</label>
          <input name="title" value={offer.title || ""} onChange={handleChange} className="w-full border rounded p-2" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium">Numéro de référence</label>
            <input name="referenceNumber" value={offer.referenceNumber || ""} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium">Type de contrat</label>
            <input name="contractType" value={offer.contractType || ""} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium">Lieu</label>
            <input name="location" value={offer.location || ""} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium">Durée</label>
            <input name="duration" value={offer.duration || ""} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>

        <div>
          <label className="block font-medium">Date limite (ISO)</label>
          <input name="submissionDeadline" value={offer.submissionDeadline ? new Date(offer.submissionDeadline).toISOString().slice(0,16) : ""} onChange={handleChange} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block font-medium">PDF URL</label>
          <input name="pdfUrl" value={offer.pdfUrl || ""} onChange={handleChange} className="w-full border rounded p-2" />
        </div>

        <div>
          <label className="block font-medium">Téléverser un nouveau PDF</label>
          <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} className="w-full border rounded p-2" />
          <div className="mt-2">
            <button type="button" onClick={handleUploadPdf} disabled={uploading} className="px-3 py-2 bg-blue-600 text-white rounded">
              {uploading ? "Téléversement..." : "Téléverser et remplacer le PDF"}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium">Description du projet</label>
          <textarea name="projectDescription" value={offer.projectDescription || ""} onChange={handleChange} className="w-full border rounded p-2" rows={4} />
        </div>

        <div>
          <label className="block font-medium">Responsabilités (une par ligne)</label>
          <textarea name="responsibilities" value={offer.responsibilities || ""} onChange={handleChange} className="w-full border rounded p-2" rows={4} />
        </div>

        <div>
          <label className="block font-medium">Exigences (une par ligne)</label>
          <textarea name="requirements" value={offer.requirements || ""} onChange={handleChange} className="w-full border rounded p-2" rows={4} />
        </div>

        <div>
          <label className="block font-medium">Documents de candidature (une par ligne)</label>
          <textarea name="applicationDocuments" value={offer.applicationDocuments || ""} onChange={handleChange} className="w-full border rounded p-2" rows={2} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium">Email de soumission</label>
            <input name="submissionEmail" value={offer.submissionEmail || ""} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium">Format sujet email</label>
            <input name="emailSubjectFormat" value={offer.emailSubjectFormat || ""} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
          <button type="button" onClick={() => router.push(`/admin/offers`)} className="px-4 py-2 border rounded">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
