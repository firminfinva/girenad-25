"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface ProjectFeaturedImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  order: number;
}

interface Project {
  id: string;
  title: string;
  status: string;
  funder: string | null;
  amount: number | null;
  currency: string | null;
  interventionArea: string;
  actualResults: string | null;
  beneficiaries: string;
  challenges: string | null;
  perspectives: string | null;
  featuredImages: ProjectFeaturedImage[];
  createdAt: string;
}

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/projects/${projectId}`);

      if (response.ok) {
        const data = await response.json();
        // Verify project is completed
        if (data.status !== "COMPLETED") {
          setError("Ce projet n'est pas encore terminé");
          return;
        }
        setProject(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Projet non trouvé");
      }
    } catch (err) {
      setError("Erreur lors du chargement du projet");
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number | null, currency: string | null) => {
    if (!amount) return null;
    const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency || "$";
    return `${currencySymbol} ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Projet non trouvé</h2>
          <p className="text-gray-600 mb-6">{error || "Le projet demandé n'existe pas."}</p>
          <Link
            href="/cv-organisationnel"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retour au CV organisationnel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/cv-organisationnel"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <span>←</span>
            <span>Retour au CV organisationnel</span>
          </Link>
        </div>

        {/* Project Article */}
        <article className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Featured Images */}
          {project.featuredImages && project.featuredImages.length > 0 && (
            <div className="relative w-full h-64 md:h-96">
              <div className="grid grid-cols-2 gap-2 h-full">
                {project.featuredImages.slice(0, 2).map((img) => (
                  <div key={img.id} className="relative overflow-hidden">
                    <Image
                      src={img.imageUrl}
                      alt={img.altText || project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Project Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {project.title}
            </h1>

            {/* Project Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {project.funder && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-green-800 uppercase mb-2">
                    Bailleur de fonds
                  </h3>
                  <p className="text-gray-700">{project.funder}</p>
                </div>
              )}

              {project.amount && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-800 uppercase mb-2">
                    Montant
                  </h3>
                  <p className="text-gray-700 font-semibold">
                    {formatAmount(project.amount, project.currency)}
                  </p>
                </div>
              )}

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-800 uppercase mb-2">
                  Zone d'intervention
                </h3>
                <p className="text-gray-700">{project.interventionArea}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-orange-800 uppercase mb-2">
                  Effectif des bénéficiaires
                </h3>
                <p className="text-gray-700">{project.beneficiaries}</p>
              </div>
            </div>

            {/* Actual Results - Main narrative */}
            {project.actualResults && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-green-500 rounded-full mr-3"></span>
                  Principaux résultats
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {project.actualResults}
                  </p>
                </div>
              </div>
            )}

            {/* Challenges */}
            {project.challenges && (
              <div className="mb-8 bg-yellow-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-yellow-500 rounded-full mr-3"></span>
                  Défis rencontrés
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {project.challenges}
                </p>
              </div>
            )}

            {/* Perspectives */}
            {project.perspectives && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                  Perspectives
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {project.perspectives}
                </p>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

