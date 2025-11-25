"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboards/Sidebar";
import GalleryImageModal from "@/components/galleries/GalleryImageModal";

interface Gallery {
  id: string;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: string;
  images: Array<{
    id: string;
    imageUrl: string;
    altText: string | null;
    order: number;
    createdAt: string;
  }>;
}

interface Project {
  id: string;
  title: string;
}

const ProjectGalleriesPage: React.FC = () => {
  const { token, isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && projectId) {
      fetchProject();
      fetchGalleries();
    }
  }, [isAuthenticated, projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`/api/projects/${projectId}/gallery`);
      const data = await response.json();

      if (response.ok) {
        setGalleries(data || []);
      } else {
        const errorMsg =
          data?.error ||
          data?.details ||
          "Erreur lors du chargement des galeries";
        setError(errorMsg);
        console.error("Error fetching galleries:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });
      }
    } catch (err) {
      setError("Erreur de connexion");
      console.error("Error fetching galleries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Le titre de la galerie est requis");
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      });

      if (response.ok) {
        setFormData({ title: "", description: "" });
        setShowCreateForm(false);
        fetchGalleries();
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la création de la galerie");
      }
    } catch (err) {
      setError("Erreur de connexion");
    }
  };

  const handleDeleteGallery = async (galleryId: string) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cette galerie et toutes ses images ?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/gallery/${galleryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchGalleries();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  const handleGalleryClick = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedGallery(null);
    fetchGalleries(); // Refresh galleries to get updated image counts
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Galeries du Projet
                  </h1>
                  {project && (
                    <p className="text-gray-600 mt-1">{project.title}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    {showCreateForm ? "Annuler" : "+ Nouvelle Galerie"}
                  </button>
                  <button
                    onClick={() => router.push("/admin/projects")}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                  >
                    Retour
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {showCreateForm && (
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Créer une Nouvelle Galerie (Activité)
                  </h2>
                  <form onSubmit={handleCreateGallery} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre de la Galerie (Activité) *
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Formation des jeunes"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Description de l'activité"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Créer la Galerie
                    </button>
                  </form>
                </div>
              )}

              {galleries.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    Aucune galerie dans ce projet
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Créer la première galerie
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleries.map((gallery) => (
                    <div
                      key={gallery.id}
                      className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-gray-200 hover:border-green-500 transition cursor-pointer shadow-md hover:shadow-lg"
                      onClick={() => handleGalleryClick(gallery)}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            {gallery.title || "Sans titre"}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGallery(gallery.id);
                            }}
                            className="text-red-600 hover:text-red-800"
                            title="Supprimer la galerie"
                          >
                            🗑️
                          </button>
                        </div>
                        {gallery.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {gallery.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {gallery.images.length}/6 images
                          </span>
                          <span className="text-xs text-gray-400">
                            Cliquez pour gérer les images
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {showImageModal && selectedGallery && (
        <GalleryImageModal
          projectId={projectId}
          gallery={selectedGallery}
          onClose={handleCloseImageModal}
          token={token || ""}
        />
      )}
    </div>
  );
};

export default ProjectGalleriesPage;
