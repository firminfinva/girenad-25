"use client";

import React, { useState, useEffect } from "react";
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

const CVOrganisationnelPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompletedProjects();
  }, []);

  const fetchCompletedProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/projects?status=COMPLETED");

      if (response.ok) {
        const data = await response.json();
        // Filter projects that have CV organisationnel data
        const projectsWithCV = data.filter(
          (p: Project) =>
            p.actualResults || p.funder || p.amount || p.challenges || p.perspectives
        );
        setProjects(projectsWithCV);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors du chargement des projets");
      }
    } catch (err) {
      setError("Erreur lors du chargement des projets");
      console.error("Error fetching projects:", err);
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
          <p className="text-gray-600">Chargement du CV organisationnel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Erreur</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            CV Organisationnel
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos réalisations et notre expérience dans la mise en œuvre
            de projets de développement. Ces récits présentent nos succès, les
            défis rencontrés et les perspectives d'avenir.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-xl p-12 text-center">
            <p className="text-gray-600 text-lg">
              Aucun projet réalisé avec les informations du CV organisationnel
              pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <article
                key={project.id}
                className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Featured Image */}
                {project.featuredImages && project.featuredImages.length > 0 && (
                  <div className="relative w-full h-48">
                    <Image
                      src={project.featuredImages[0].imageUrl}
                      alt={project.featuredImages[0].altText || project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Project Title */}
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 line-clamp-2">
                    {project.title}
                  </h2>

                  {/* Project Metadata - Summary */}
                  <div className="space-y-2 mb-4">
                    {project.funder && (
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Bailleur:</span>{" "}
                        <span className="text-gray-600">{project.funder}</span>
                      </div>
                    )}
                    {project.amount && (
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">Montant:</span>{" "}
                        <span className="text-gray-600">
                          {formatAmount(project.amount, project.currency)}
                        </span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-semibold text-gray-700">Zone:</span>{" "}
                      <span className="text-gray-600">{project.interventionArea}</span>
                    </div>
                  </div>

                  {/* Actual Results Preview */}
                  {project.actualResults && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {project.actualResults.substring(0, 150)}...
                    </p>
                  )}

                  {/* Link to details */}
                  <Link
                    href={`/cv-organisationnel/${project.id}`}
                    className="inline-block w-full text-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Voir les détails
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CVOrganisationnelPage;
