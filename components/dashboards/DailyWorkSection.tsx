"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface DailyWork {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  workDate: string;
  completedAt: string | null;
}

const DailyWorkSection: React.FC = () => {
  const { token } = useAuth();
  const [dailyWork, setDailyWork] = useState<DailyWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState("");
  const [newWorkDescription, setNewWorkDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDailyWork();
    }
  }, [token]);

  const fetchDailyWork = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(`/api/daily-work?date=${today}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDailyWork(data);
      }
    } catch (error) {
      console.error("Error fetching daily work:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkTitle.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch("/api/daily-work", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newWorkTitle,
          description: newWorkDescription || null,
        }),
      });

      if (response.ok) {
        setNewWorkTitle("");
        setNewWorkDescription("");
        setShowAddForm(false);
        fetchDailyWork();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de l'ajout");
      }
    } catch (error) {
      alert("Erreur de connexion");
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

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const completedCount = dailyWork.filter((w) => w.completed).length;
  const totalCount = dailyWork.length;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-2xl">
            ✅
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Travail du Jour
            </h2>
            <p className="text-sm text-gray-600">{today}</p>
          </div>
        </div>
        {totalCount > 0 && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {completedCount} / {totalCount} complété{totalCount > 1 ? "s" : ""}
            </p>
            <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-indigo-600 rounded-full transition-all"
                style={{
                  width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-gray-600 text-center py-4">Chargement...</p>
      ) : (
        <>
          {dailyWork.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              Aucune tâche pour aujourd'hui
            </p>
          ) : (
            <div className="space-y-2 mb-4">
              {dailyWork.map((work) => (
                <div
                  key={work.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    work.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={work.completed}
                    onChange={() => handleToggleComplete(work.id, work.completed)}
                    className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        work.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {work.title}
                    </p>
                    {work.description && (
                      <p
                        className={`text-xs mt-1 ${
                          work.completed ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {work.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(work.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddForm ? (
            <form onSubmit={handleAddWork} className="space-y-3">
              <input
                type="text"
                value={newWorkTitle}
                onChange={(e) => setNewWorkTitle(e.target.value)}
                placeholder="Titre de la tâche *"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <textarea
                value={newWorkDescription}
                onChange={(e) => setNewWorkDescription(e.target.value)}
                placeholder="Description (optionnel)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50"
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
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium text-sm"
            >
              + Ajouter une Tâche
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default DailyWorkSection;

