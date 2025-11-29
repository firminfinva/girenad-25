"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthVerification } from "@/hooks/useAuthVerification";
import Sidebar from "@/components/dashboards/Sidebar";
import Link from "next/link";

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string | null;
  status: string;
  creator: {
    firstName: string;
    lastName: string;
  };
}

const ActivitiesManagementPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  // Verify token and role from server (ensures role changes are detected)
  const { loading: verifying, isValid } = useAuthVerification("MODERATOR");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isValid && token) {
      fetchActivities();
    }
  }, [isValid, token]);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/activities");
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      } else {
        setError("Erreur lors du chargement des activités");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setActivities(activities.filter((a) => a.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur de connexion");
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des Activités
                </h1>
                <Link
                  href="/admin/activities/create"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition whitespace-nowrap"
                >
                  + Créer une Activité
                </Link>
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
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                        Titre
                      </th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">
                        Description
                      </th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                        Date
                      </th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[13%]">
                        Statut
                      </th>
                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-4 py-4">
                          <Link
                            href={`/admin/activities/${activity.id}/manage`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-900 hover:underline break-words"
                          >
                            {activity.title}
                          </Link>
                        </td>
                        <td className="px-3 sm:px-4 py-4">
                          <div className="text-sm text-gray-500 break-words line-clamp-2">
                            {activity.description}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(activity.date).toLocaleDateString()}
                        </td>
                        <td className="px-3 sm:px-4 py-4">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 whitespace-nowrap">
                            {activity.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-4 text-sm font-medium">
                          <div className="flex flex-col gap-1">
                            <Link
                              href={`/admin/activities/${activity.id}/edit`}
                              className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                            >
                              Modifier
                            </Link>
                            <button
                              onClick={() => handleDelete(activity.id)}
                              className="text-red-600 hover:text-red-900 text-left whitespace-nowrap"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {activities.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucune activité trouvée</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivitiesManagementPage;
