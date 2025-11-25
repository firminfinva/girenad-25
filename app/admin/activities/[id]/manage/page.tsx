"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboards/Sidebar";

interface Program {
  id: string;
  time: string;
  event: string;
  order: number;
}

interface Organization {
  id: string;
  name: string;
  order: number;
}

interface Activity {
  id: string;
  title: string;
  programs: Program[];
  organizations: Organization[];
}

const ManageActivityPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [activity, setActivity] = useState<Activity | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  const fetchActivity = async () => {
    try {
      const response = await fetch(`/api/activities/${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setActivity(data);
        setPrograms(data.programs || []);
        setOrganizations(data.organizations || []);
      } else {
        setError("Erreur lors du chargement de l'activité");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setFetching(false);
    }
  };

  const handleAddProgram = () => {
    setPrograms([
      ...programs,
      { id: `temp-${Date.now()}`, time: "", event: "", order: programs.length },
    ]);
  };

  const handleUpdateProgram = (index: number, field: string, value: string) => {
    const updated = [...programs];
    updated[index] = { ...updated[index], [field]: value };
    setPrograms(updated);
  };

  const handleRemoveProgram = (index: number) => {
    setPrograms(programs.filter((_, i) => i !== index));
  };

  const handleAddOrganization = () => {
    setOrganizations([
      ...organizations,
      { id: `temp-${Date.now()}`, name: "", order: organizations.length },
    ]);
  };

  const handleUpdateOrganization = (index: number, value: string) => {
    const updated = [...organizations];
    updated[index] = { ...updated[index], name: value };
    setOrganizations(updated);
  };

  const handleRemoveOrganization = (index: number) => {
    setOrganizations(organizations.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      // Save programs
      const programsResponse = await fetch(
        `/api/activities/${activityId}/programs`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(programs),
        }
      );

      if (!programsResponse.ok) {
        throw new Error("Erreur lors de la sauvegarde des programmes");
      }

      // Save organizations
      const orgsResponse = await fetch(
        `/api/activities/${activityId}/organizations`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(organizations),
        }
      );

      if (!orgsResponse.ok) {
        throw new Error("Erreur lors de la sauvegarde des organisations");
      }

      router.push("/admin/activities");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
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

  if (!activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <p className="text-red-600">Activité non trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gérer: {activity.title}
              </h1>
              <p className="text-gray-600 mb-6">
                Ajoutez des programmes et des organisations pour cette activité
              </p>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Programs Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Programme de l'activité
                  </h2>
                  <button
                    onClick={handleAddProgram}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    + Ajouter un événement
                  </button>
                </div>

                <div className="space-y-4">
                  {programs.map((program, index) => (
                    <div
                      key={program.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg items-start"
                    >
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heure
                        </label>
                        <input
                          type="text"
                          value={program.time}
                          onChange={(e) =>
                            handleUpdateProgram(index, "time", e.target.value)
                          }
                          placeholder="09:00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Événement
                        </label>
                        <input
                          type="text"
                          value={program.event}
                          onChange={(e) =>
                            handleUpdateProgram(index, "event", e.target.value)
                          }
                          placeholder="Description de l'événement"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveProgram(index)}
                        className="mt-6 text-red-600 hover:text-red-900 px-3 py-2"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                  {programs.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Aucun programme ajouté. Cliquez sur "Ajouter un événement"
                      pour commencer.
                    </p>
                  )}
                </div>
              </div>

              {/* Organizations Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Organisations participantes
                  </h2>
                  <button
                    onClick={handleAddOrganization}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    + Ajouter une organisation
                  </button>
                </div>

                <div className="space-y-4">
                  {organizations.map((org, index) => (
                    <div
                      key={org.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg items-center"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={org.name}
                          onChange={(e) =>
                            handleUpdateOrganization(index, e.target.value)
                          }
                          placeholder="Nom de l'organisation"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveOrganization(index)}
                        className="text-red-600 hover:text-red-900 px-3 py-2"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                  {organizations.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Aucune organisation ajoutée. Cliquez sur "Ajouter une
                      organisation" pour commencer.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sauvegarde..." : "Enregistrer"}
                </button>
                <button
                  onClick={() => router.back()}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageActivityPage;
