"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboards/Sidebar";

interface GalleryImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  order: number;
  createdAt: string;
}

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  order: number;
  createdAt: string;
  images: GalleryImage[];
}

interface Project {
  id: string;
  title: string;
}

const ProjectGalleryPage: React.FC = () => {
  const { token, isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedActivite, setSelectedActivite] = useState<string>("");
  const [newActiviteTitle, setNewActiviteTitle] = useState("");
  const [showNewActiviteForm, setShowNewActiviteForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    altText: "",
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && projectId) {
      fetchProject();
      fetchGallery();
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

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/gallery`);
      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data);
      } else {
        setError("Erreur lors du chargement de la galerie");
      }
    } catch (err) {
      setError("Erreur de connexion");
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

  const handleCreateActivite = async () => {
    if (!newActiviteTitle.trim()) {
      setError("Le titre de l'activité est requis");
      return;
    }

    setShowNewActiviteForm(false);
    setSelectedActivite(newActiviteTitle);
    setNewActiviteTitle("");
    setShowUploadForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedActivite) {
      setError("Veuillez sélectionner ou créer une activité");
      return;
    }

    // Find the gallery for this activite
    const gallery = galleryItems.find(
      (item) => item.title === selectedActivite
    );

    if (gallery && gallery.images.length >= 6) {
      setError("Une activité ne peut contenir que 6 images maximum");
      return;
    }

    setUploading(true);
    setError("");

    try {
      let response;

      if (gallery) {
        // Add image to existing gallery
        response = await fetch(
          `/api/projects/${projectId}/gallery/${gallery.id}/images`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              imageUrl: formData.imageUrl,
              altText: formData.altText,
            }),
          }
        );
      } else {
        // Create new gallery with first image
        response = await fetch(`/api/projects/${projectId}/gallery`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: selectedActivite,
            description: formData.description,
            imageUrl: formData.imageUrl,
            altText: formData.altText,
          }),
        });
      }

      if (response.ok) {
        setFormData({ title: "", description: "", imageUrl: "", altText: "" });
        setShowUploadForm(false);
        fetchGallery();
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de l'ajout de l'image");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (galleryId: string, imageId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/gallery/${galleryId}/images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchGallery();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  const handleDeleteGallery = async (galleryId: string) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer cette activité et toutes ses images ?"
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
        fetchGallery();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
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
                    Galerie du Projet
                  </h1>
                  {project && (
                    <p className="text-gray-600 mt-1">{project.title}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNewActiviteForm(!showNewActiviteForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    {showNewActiviteForm ? "Annuler" : "+ Nouvelle Activité"}
                  </button>
                  <button
                    onClick={() => {
                      if (galleryItems.length > 0) {
                        setShowUploadForm(!showUploadForm);
                      } else {
                        setError("Créez d'abord une activité");
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    disabled={galleryItems.length === 0}
                  >
                    {showUploadForm ? "Annuler" : "+ Ajouter une Image"}
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

              {showNewActiviteForm && (
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Créer une Nouvelle Activité
                  </h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newActiviteTitle}
                      onChange={(e) => setNewActiviteTitle(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Titre de l'activité (ex: Formation des jeunes)"
                    />
                    <button
                      onClick={handleCreateActivite}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Créer
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Une activité peut contenir jusqu'à 6 images
                  </p>
                </div>
              )}

              {showUploadForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Ajouter une Image
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Activité *
                      </label>
                      <select
                        value={selectedActivite}
                        onChange={(e) => setSelectedActivite(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Sélectionner une activité</option>
                        {galleryItems.map((gallery) => (
                          <option key={gallery.id} value={gallery.title || ""}>
                            {gallery.title || "Sans titre"} (
                            {gallery.images.length}/6)
                          </option>
                        ))}
                      </select>
                      {selectedActivite && (
                        <p className="text-sm text-gray-600 mt-1">
                          {galleryItems.find(
                            (item) => item.title === selectedActivite
                          )?.images.length || 0}
                          /6 images
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de l'Image *
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        required
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Titre
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Titre de l'image"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texte Alternatif
                        </label>
                        <input
                          type="text"
                          name="altText"
                          value={formData.altText}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Description pour l'accessibilité"
                        />
                      </div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Description de l'image"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Ajout..." : "Ajouter l'Image"}
                    </button>
                  </form>
                </div>
              )}

              {galleryItems.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    Aucune activité dans la galerie
                  </p>
                  <button
                    onClick={() => setShowNewActiviteForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Créer la première activité
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {galleryItems.map((gallery) => (
                    <div
                      key={gallery.id}
                      className="bg-white rounded-xl shadow-xl overflow-hidden"
                    >
                      {/* Activity Header */}
                      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6">
                        <div className="flex justify-between items-center">
                          <h2 className="text-2xl font-bold text-white">
                            {gallery.title || "Sans titre"}
                          </h2>
                          <div className="flex gap-2 items-center">
                            <span className="text-white/80 text-sm">
                              {gallery.images.length}/6 images
                            </span>
                            <button
                              onClick={() => handleDeleteGallery(gallery.id)}
                              className="text-white hover:text-red-200 transition"
                              title="Supprimer l'activité"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Image Gallery */}
                      <div className="p-8">
                        {gallery.images.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">
                            Aucune image dans cette activité
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gallery.images.map((image) => (
                              <div
                                key={image.id}
                                className="relative group bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                              >
                                <div className="aspect-square relative overflow-hidden rounded-lg">
                                  <img
                                    src={image.imageUrl}
                                    alt={
                                      image.altText ||
                                      gallery.title ||
                                      "Gallery image"
                                    }
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage non disponible%3C/text%3E%3C/svg%3E";
                                    }}
                                  />
                                </div>
                                <button
                                  onClick={() =>
                                    handleDeleteImage(gallery.id, image.id)
                                  }
                                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                                  title="Supprimer"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            {/* Show empty slots if less than 6 */}
                            {Array.from({
                              length: 6 - gallery.images.length,
                            }).map((_, index) => (
                              <div
                                key={`empty-${index}`}
                                className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                              >
                                <span className="text-gray-400 text-sm">
                                  Emplacement{" "}
                                  {gallery.images.length + index + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
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

export default ProjectGalleryPage;
