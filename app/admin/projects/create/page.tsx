"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboards/Sidebar";
import RelatedEntitiesForm from "@/components/projects/RelatedEntitiesForm";

const CreateProjectPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    context: "",
    generalObjective: "",
    interventionArea: "",
    duration: "",
    beneficiaries: "",
    status: "PLANNED",
  });
  const [specificObjectives, setSpecificObjectives] = useState<
    Array<{ content: string; order: number }>
  >([]);
  const [mainActivities, setMainActivities] = useState<
    Array<{ content: string; order: number }>
  >([]);
  const [partners, setPartners] = useState<
    Array<{ name: string; type: string }>
  >([]);
  const [expectedResults, setExpectedResults] = useState<
    Array<{ content: string; order: number }>
  >([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          specificObjectives: specificObjectives.filter(
            (obj) => obj.content.trim() !== ""
          ),
          mainActivities: mainActivities.filter(
            (act) => act.content.trim() !== ""
          ),
          partners: partners.filter((p) => p.name.trim() !== ""),
          expectedResults: expectedResults.filter(
            (r) => r.content.trim() !== ""
          ),
        }),
      });

      if (response.ok) {
        router.push("/admin/projects");
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la création");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Créer un Nouveau Projet
              </h1>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aperçu *
                  </label>
                  <textarea
                    name="overview"
                    required
                    rows={3}
                    value={formData.overview}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contexte *
                  </label>
                  <textarea
                    name="context"
                    required
                    rows={4}
                    value={formData.context}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objectif Général *
                  </label>
                  <textarea
                    name="generalObjective"
                    required
                    rows={3}
                    value={formData.generalObjective}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zone d'Intervention
                    </label>
                    <input
                      type="text"
                      name="interventionArea"
                      value={formData.interventionArea}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bénéficiaires
                  </label>
                  <input
                    type="text"
                    name="beneficiaries"
                    value={formData.beneficiaries}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="PLANNED">Planifié</option>
                    <option value="ONGOING">En cours</option>
                    <option value="COMPLETED">Terminé</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>

                {/* Related Entities */}
                <RelatedEntitiesForm
                  specificObjectives={specificObjectives}
                  mainActivities={mainActivities}
                  partners={partners}
                  expectedResults={expectedResults}
                  onSpecificObjectivesChange={setSpecificObjectives}
                  onMainActivitiesChange={setMainActivities}
                  onPartnersChange={setPartners}
                  onExpectedResultsChange={setExpectedResults}
                />

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Création..." : "Créer le Projet"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProjectPage;
