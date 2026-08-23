"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboards/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthVerification } from "@/hooks/useAuthVerification";
import Link from "next/link";

interface Offer {
  id: string;
  title: string;
  submissionDeadline?: string | null;
  pdfUrl?: string | null;
  downloadCount?: number | null;
}

const AdminOffersPage: React.FC = () => {
  const { token } = useAuth();
  const { loading: verifying, isValid } = useAuthVerification("ADMIN");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isValid) fetchOffers();
  }, [isValid]);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/offers");
      if (res.ok) {
        const data = await res.json();
        setOffers(data.offers || data);
      } else {
        setError("Erreur lors du chargement des offres");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || verifying || !isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">Vérification en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Offres</h1>
                <div className="flex gap-3">
                  <Link href="/offers" className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-300 transition">
                    Voir la liste publique
                  </Link>
                  <Link href="/offers/create" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                    + Créer une Offre
                  </Link>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="w-full overflow-hidden">
                <table className="w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date limite</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléchargements</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {offers.map((offer) => (
                      <tr key={offer.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 text-sm font-medium text-blue-600">
                          <Link href={`/admin/offers/${offer.id}`}>{offer.title}</Link>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {offer.submissionDeadline ? new Date(offer.submissionDeadline).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {offer.pdfUrl ? (
                            <a href={`/api/offers/download?id=${encodeURIComponent(offer.id)}`} target="_blank" rel="noopener noreferrer" className="text-sm px-2 py-1 border rounded">
                              Télécharger
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">{offer.downloadCount ?? 0}</td>
                        <td className="px-3 py-4 text-sm font-medium">
                          <div className="flex gap-3">
                            <Link href={`/admin/offers/${offer.id}`} className="text-blue-600">Modifier</Link>
                            <a href={`/offers/${offer.id}`} target="_blank" rel="noopener noreferrer" className="text-gray-700">Voir public</a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {offers.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune offre trouvée</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOffersPage;
