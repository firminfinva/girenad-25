"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface GalleryImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  order: number;
}

interface Gallery {
  id: string;
  title: string | null;
  description: string | null;
  order: number;
  images: GalleryImage[];
}

interface Project {
  id: string;
  title: string;
  overview: string;
  context: string;
  generalObjective: string;
  interventionArea: string;
  duration: string;
  beneficiaries: string;
  specificObjectives: Array<{ id: string; content: string; order: number }>;
  mainActivities: Array<{ id: string; content: string; order: number }>;
  partners: Array<{ id: string; name: string; type: string }>;
  expectedResults: Array<{ id: string; content: string; order: number }>;
  galleries: Gallery[];
}

function ProjetContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    } else {
      setError("ID du projet manquant");
      setLoading(false);
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/projects/${projectId}`);

      if (response.ok) {
        const data = await response.json();
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

  const toggleLang = () => {
    setLang(lang === "fr" ? "en" : "fr");
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
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Projet non trouvé
          </h2>
          <p className="text-gray-600">
            {error || "Le projet demandé n'existe pas."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Language Toggle */}
        <div className="flex justify-end mb-8">
          <button
            onClick={toggleLang}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
          >
            {lang === "fr" ? "English" : "Français"}
          </button>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
            {project.title}
          </h1>
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              {project.overview}
            </p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Context */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-6 bg-blue-500 rounded-full mr-3"></span>
                {lang === "fr"
                  ? "Contexte / Justification"
                  : "Context / Justification"}
              </h3>
              <p className="text-gray-700">{project.context}</p>
            </div>

            {/* General Objective */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-6 bg-green-500 rounded-full mr-3"></span>
                {lang === "fr" ? "Objectif général" : "General Objective"}
              </h3>
              <p className="text-gray-700">{project.generalObjective}</p>
            </div>

            {/* Specific Objectives */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-6 bg-purple-500 rounded-full mr-3"></span>
                {lang === "fr"
                  ? "Objectifs spécifiques"
                  : "Specific Objectives"}
              </h3>
              <ul className="text-gray-700 space-y-1">
                {project.specificObjectives.map((obj) => (
                  <li key={obj.id} className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    {obj.content}
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Activities */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-6 bg-orange-500 rounded-full mr-3"></span>
                {lang === "fr" ? "Activités principales" : "Main Activities"}
              </h3>
              <ul className="text-gray-700 space-y-1">
                {project.mainActivities.map((activity) => (
                  <li key={activity.id} className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    {activity.content}
                  </li>
                ))}
              </ul>
            </div>

            {/* Partners */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-6 bg-red-500 rounded-full mr-3"></span>
                {lang === "fr"
                  ? "Partenaires / Bailleurs"
                  : "Partners / Donors"}
              </h3>
              <ul className="text-gray-700 space-y-1">
                {project.partners.map((partner) => (
                  <li key={partner.id} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {partner.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Intervention Area */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-6 bg-teal-500 rounded-full mr-3"></span>
                {lang === "fr" ? "Zone d'intervention" : "Intervention Area"}
              </h3>
              <p className="text-gray-700">{project.interventionArea}</p>
            </div>

            {/* Duration */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-6 bg-indigo-500 rounded-full mr-3"></span>
                {lang === "fr" ? "Durée du projet" : "Project Duration"}
              </h3>
              <p className="text-gray-700">{project.duration}</p>
            </div>

            {/* Beneficiaries */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-6 bg-pink-500 rounded-full mr-3"></span>
                {lang === "fr" ? "Bénéficiaires" : "Beneficiaries"}
              </h3>
              <p className="text-gray-700">{project.beneficiaries}</p>
            </div>

            {/* Expected Results */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-6 bg-yellow-500 rounded-full mr-3"></span>
                {lang === "fr"
                  ? "Résultats attendus / Impact"
                  : "Expected Results / Impact"}
              </h3>
              <ul className="text-gray-700 space-y-1">
                {project.expectedResults.map((result) => (
                  <li key={result.id} className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    {result.content}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Activities (Galleries) */}
        <div className="space-y-8">
          {project.galleries.map((gallery) => (
            <div
              key={gallery.id}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              {/* Activity Header */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {gallery.title || "Activité"}
                </h2>
                {gallery.description && (
                  <p className="text-white/90 mt-2">{gallery.description}</p>
                )}
              </div>

              {/* Activity Content */}
              {gallery.images.length > 0 && (
                <div className="p-8">
                  {/* Image Gallery */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gallery.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square relative overflow-hidden rounded-lg shadow-lg">
                          <img
                            src={image.imageUrl}
                            alt={
                              image.altText || gallery.title || "Gallery image"
                            }
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage non disponible%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar with Quick Info */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 hidden xl:block">
          <div className="bg-white rounded-xl shadow-xl p-6 w-64">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-6 bg-orange-500 rounded-full mr-3"></span>
              Informations rapides
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-sm">
                  {project.galleries.length} activités
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-sm">
                  {project.galleries.reduce(
                    (acc, gallery) => acc + gallery.images.length,
                    0
                  )}{" "}
                  images
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement du projet...</p>
      </div>
    </div>
  );
}

const ProjetPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProjetContent />
    </Suspense>
  );
};

export default ProjetPage;
