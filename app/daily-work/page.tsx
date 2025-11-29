"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthVerification } from "@/hooks/useAuthVerification";
import Sidebar from "@/components/dashboards/Sidebar";

interface DailyWork {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  workDate: string;
  completedAt: string | null;
}

const DailyWorkPage: React.FC = () => {
  const { token, user } = useAuth();
  const { loading: verifying, isValid } = useAuthVerification();
  const [dailyWork, setDailyWork] = useState<DailyWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState("");
  const [newWorkDescription, setNewWorkDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isValid && token) {
      fetchDailyWork();
    }
  }, [isValid, token, selectedDate]);

  const fetchDailyWork = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/daily-work?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDailyWork(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors du chargement");
      }
    } catch (error) {
      console.error("Error fetching daily work:", error);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkTitle.trim()) return;

    try {
      setSubmitting(true);
      setError("");
      
      const requestBody = {
        title: newWorkTitle,
        description: newWorkDescription || null,
        workDate: selectedDate,
      };
      
      console.log("Creating daily work:", requestBody);
      
      const response = await fetch("/api/daily-work", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Daily work created successfully:", data);
        setNewWorkTitle("");
        setNewWorkDescription("");
        setShowAddForm(false);
        await fetchDailyWork();
      } else {
        console.error("Error creating daily work:", data);
        setError(data.error || data.details || "Erreur lors de l'ajout");
      }
    } catch (error: any) {
      console.error("Error creating daily work:", error);
      setError(`Erreur de connexion: ${error?.message || "Erreur inconnue"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/daily-work/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (response.ok) {
        fetchDailyWork();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      alert("Erreur de connexion");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/daily-work/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchDailyWork();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      alert("Erreur de connexion");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString === today;
  };

  const goToDate = (days: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  if (loading || verifying || !isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">
          {loading || verifying ? "Chargement..." : "Vérification en cours..."}
        </p>
      </div>
    );
  }

  const completedCount = dailyWork.filter((w) => w.completed).length;
  const totalCount = dailyWork.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Travail Quotidien
                </h1>
                <p className="text-gray-600">
                  Gérez vos tâches et suivez votre progression quotidienne
                </p>
              </div>

              {/* Date Selection */}
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToDate(-1)}
                      className="p-2 bg-white rounded-md hover:bg-indigo-100 transition text-indigo-600"
                      title="Jour précédent"
                    >
                      ←
                    </button>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    />
                    <button
                      onClick={() => goToDate(1)}
                      className="p-2 bg-white rounded-md hover:bg-indigo-100 transition text-indigo-600"
                      title="Jour suivant"
                    >
                      →
                    </button>
                    {!isToday(selectedDate) && (
                      <button
                        onClick={() =>
                          setSelectedDate(new Date().toISOString().split("T")[0])
                        }
                        className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                      >
                        Aujourd'hui
                      </button>
                    )}
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(selectedDate)}
                    </p>
                    {totalCount > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {completedCount} / {totalCount} complété
                        {totalCount > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
                {totalCount > 0 && (
                  <div className="mt-4">
                    <div className="w-full h-3 bg-gray-200 rounded-full">
                      <div
                        className="h-3 bg-indigo-600 rounded-full transition-all"
                        style={{
                          width: `${(completedCount / totalCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <p className="text-gray-600 text-center py-8">Chargement...</p>
              ) : (
                <>
                  {dailyWork.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">
                        Aucune tâche pour cette date
                      </p>
                      {!showAddForm && (
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition font-medium"
                        >
                          + Ajouter une Tâche
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {dailyWork.map((work) => (
                        <div
                          key={work.id}
                          className={`flex items-start gap-3 p-4 rounded-lg border ${
                            work.completed
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={work.completed}
                            onChange={() =>
                              handleToggleComplete(work.id, work.completed)
                            }
                            className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <p
                              className={`text-base font-medium ${
                                work.completed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {work.title}
                            </p>
                            {work.description && (
                              <p
                                className={`text-sm mt-1 ${
                                  work.completed
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                }`}
                              >
                                {work.description}
                              </p>
                            )}
                            {work.completed && work.completedAt && (
                              <p className="text-xs text-gray-400 mt-2">
                                Complété le{" "}
                                {new Date(work.completedAt).toLocaleString(
                                  "fr-FR"
                                )}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(work.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddForm ? (
                    <form onSubmit={handleAddWork} className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Titre de la tâche *
                        </label>
                        <input
                          type="text"
                          value={newWorkTitle}
                          onChange={(e) => setNewWorkTitle(e.target.value)}
                          placeholder="Ex: Réunion avec l'équipe"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description (optionnel)
                        </label>
                        <textarea
                          value={newWorkDescription}
                          onChange={(e) =>
                            setNewWorkDescription(e.target.value)
                          }
                          placeholder="Détails de la tâche..."
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                        >
                          {submitting ? "Ajout..." : "Ajouter"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddForm(false);
                            setNewWorkTitle("");
                            setNewWorkDescription("");
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium"
                    >
                      + Ajouter une Tâche
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyWorkPage;

