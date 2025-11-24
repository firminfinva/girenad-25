"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboards/Sidebar";
import RelatedEntitiesForm from "@/components/projects/RelatedEntitiesForm";

const EditProjectPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    Array<{ id?: string; content: string; order: number }>
  >([]);
  const [mainActivities, setMainActivities] = useState<
    Array<{ id?: string; content: string; order: number }>
  >([]);
  const [partners, setPartners] = useState<
    Array<{ id?: string; name: string; type: string }>
  >([]);
  const [expectedResults, setExpectedResults] = useState<
    Array<{ id?: string; content: string; order: number }>
  >([]);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title || "",
          overview: data.overview || "",
          context: data.context || "",
          generalObjective: data.generalObjective || "",
          interventionArea: data.interventionArea || "",
          duration: data.duration || "",
          beneficiaries: data.beneficiaries || "",
          status: data.status || "PLANNED",
        });
        // Load related entities
        setSpecificObjectives(
          data.specificObjectives?.map((obj: any) => ({
            id: obj.id,
            content: obj.content,
            order: obj.order,
          })) || []
        );
        setMainActivities(
          data.mainActivities?.map((act: any) => ({
            id: act.id,
            content: act.content,
            order: act.order,
          })) || []
        );
        setPartners(
          data.partners?.map((p: any) => ({
            id: p.id,
            name: p.name,
            type: p.type,
          })) || []
        );
        setExpectedResults(
          data.expectedResults?.map((r: any) => ({
            id: r.id,
            content: r.content,
            order: r.order,
          })) || []
        );
      } else {
        setError("Erreur lors du chargement du projet");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setFetching(false);
    }
  };

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
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          specificObjectives: specificObjectives.map((obj) => ({
            content: obj.content,
            order: obj.order,
          })),
          mainActivities: mainActivities.map((act) => ({
            content: act.content,
            order: act.order,
          })),
          partners: partners.map((p) => ({
            name: p.name,
            type: p.type,
          })),
          expectedResults: expectedResults.map((r) => ({
            content: r.content,
            order: r.order,
          })),
        }),
      });

      if (response.ok) {
        router.push("/admin/projects");
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Modifier le Projet
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
                    {loading ? "Mise à jour..." : "Mettre à jour"}
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

export default EditProjectPage;
