"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthVerification } from "@/hooks/useAuthVerification";
import Sidebar from "@/components/dashboards/Sidebar";
import Link from "next/link";
import Image from "next/image";

interface HomepagePartner {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const PartnersManagementPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  const { loading: verifying, isValid } = useAuthVerification("ADMIN");
  const [partners, setPartners] = useState<HomepagePartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isValid && token) {
      fetchPartners();
    }
  }, [isValid, token]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/homepage-partners", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // For admin, we want to see all partners including inactive ones
        // So we need to fetch from a different endpoint or modify the API
        setPartners(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors du chargement des partenaires");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le partenaire "${name}" ?`)) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await fetch(`/api/homepage-partners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchPartners();
        setError("");
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la suppression");
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError("Erreur de connexion");
      alert("Erreur de connexion");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (partner: HomepagePartner) => {
    try {
      const response = await fetch(`/api/homepage-partners/${partner.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active: !partner.active }),
      });

      if (response.ok) {
        fetchPartners();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  if (loading || verifying || !isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">
          {loading ? "Chargement..." : "Vérification en cours..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des Partenaires
                </h1>
                <Link
                  href="/admin/partners/create"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  + Ajouter un Partenaire
                </Link>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {partners.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    Aucun partenaire enregistré
                  </p>
                  <Link
                    href="/admin/partners/create"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition inline-block"
                  >
                    Ajouter le premier partenaire
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => handleToggleActive(partner)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            partner.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {partner.active ? "Actif" : "Inactif"}
                        </button>
                      </div>

                      {partner.logo && (
                        <div className="mb-4 flex justify-center">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={120}
                            height={120}
                            className="object-contain"
                          />
                        </div>
                      )}

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                        {partner.name}
                      </h3>

                      {partner.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {partner.description}
                        </p>
                      )}

                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mb-4 block"
                        >
                          {partner.website}
                        </a>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Link
                          href={`/admin/partners/${partner.id}/edit`}
                          className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(partner.id, partner.name)}
                          disabled={deletingId === partner.id}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === partner.id ? "Suppression..." : "Supprimer"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PartnersManagementPage;

