"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboards/Sidebar";

const EditActivityPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const activityId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    status: "UPCOMING",
    projectId: "",
  });

  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  const fetchActivity = async () => {
    try {
      const response = await fetch(`/api/activities/${activityId}`);
      if (response.ok) {
        const data = await response.json();
        const date = new Date(data.date);
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          date: localDate,
          location: data.location || "",
          status: data.status || "UPCOMING",
          projectId: data.projectId || "",
        });
        setCurrentImageUrl(data.imageUrl || null);
      } else {
        setError("Erreur lors du chargement de l'activité");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError(
          "Type de fichier non autorisé. Formats acceptés: JPEG, PNG, GIF, WebP"
        );
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Le fichier est trop volumineux. Taille maximale: 10MB");
        return;
      }
      setSelectedFile(file);
      setError("");
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl: string | null = currentImageUrl;

      // Upload new image if file is selected
      if (selectedFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        uploadFormData.append("folder", "girenad/activities");
        uploadFormData.append("resourceType", "image");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || "Erreur lors de l'upload");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
        setUploading(false);
      }

      const response = await fetch(`/api/activities/${activityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          projectId: formData.projectId || null,
          imageUrl,
        }),
      });

      if (response.ok) {
        router.push("/admin/activities");
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
      setUploading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Modifier l'Activité
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
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      required
                      value={formData.date}
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
                      <option value="UPCOMING">À venir</option>
                      <option value="ONGOING">En cours</option>
                      <option value="COMPLETED">Terminée</option>
                      <option value="CANCELLED">Annulée</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  {currentImageUrl && !previewUrl && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Image actuelle:
                      </p>
                      <img
                        src={currentImageUrl}
                        alt="Current"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  {previewUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Nouvelle image:
                      </p>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading || uploading
                      ? uploading
                        ? "Upload de l'image..."
                        : "Mise à jour..."
                      : "Mettre à jour"}
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

export default EditActivityPage;
