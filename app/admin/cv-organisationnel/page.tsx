"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthVerification } from "@/hooks/useAuthVerification";
import Sidebar from "@/components/dashboards/Sidebar";
import Image from "next/image";

interface ProjectFeaturedImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  order: number;
}

interface Project {
  id: string;
  title: string;
  status: string;
  funder: string | null;
  amount: number | null;
  currency: string | null;
  interventionArea: string;
  actualResults: string | null;
  beneficiaries: string;
  challenges: string | null;
  perspectives: string | null;
  featuredImages: ProjectFeaturedImage[];
  createdAt: string;
}

const CVOrganisationnelAdminPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  // Verify token and role from server (ensures role changes are detected)
  const { loading: verifying, isValid } = useAuthVerification("ADMIN");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageAltText, setImageAltText] = useState("");

  useEffect(() => {
    if (isValid && token) {
      fetchProjects();
    }
  }, [isValid, token]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        setError("Erreur lors du chargement des projets");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCV = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setImageAltText("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject || !token) return;

    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        status: "COMPLETED",
        funder: formData.get("funder") || null,
        amount: formData.get("amount") ? parseFloat(formData.get("amount") as string) : null,
        currency: formData.get("currency") || "USD",
        actualResults: formData.get("actualResults") || null,
        challenges: formData.get("challenges") || null,
        perspectives: formData.get("perspectives") || null,
      };

      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchProjects();
        handleCloseModal();
        alert("Projet ajouté au CV organisationnel avec succès !");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erreur lors de l'ajout au CV organisationnel");
      }
    } catch (err) {
      console.error("Error adding project to CV:", err);
      alert("Erreur lors de l'ajout au CV organisationnel");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Type de fichier non autorisé. Formats acceptés: JPEG, PNG, GIF, WebP");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Le fichier est trop volumineux. Taille maximale: 10MB");
        return;
      }

      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAddFeaturedImage = async () => {
    if (!selectedProject || !token || !selectedFile) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    if (selectedProject.featuredImages && selectedProject.featuredImages.length >= 2) {
      alert("Vous ne pouvez ajouter que 2 photos phares maximum");
      return;
    }

    setUploading(true);
    try {
      // Step 1: Upload file to Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);
      uploadFormData.append("folder", `girenad/projects/${selectedProject.id}/featured-images`);
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

      // Step 2: Create featured image with Cloudinary URL
      const response = await fetch(`/api/projects/${selectedProject.id}/featured-images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          altText: imageAltText || null,
        }),
      });

      if (response.ok) {
        await fetchProjects();
        if (selectedProject) {
          const updatedProject = await fetch(`/api/projects/${selectedProject.id}`).then((r) => r.json());
          setSelectedProject(updatedProject);
        }
        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        setImageAltText("");
        // Reset file input
        const fileInput = document.getElementById(`featured-image-file-${selectedProject.id}`) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erreur lors de l'ajout de l'image");
      }
    } catch (err) {
      console.error("Error adding featured image:", err);
      alert(err instanceof Error ? err.message : "Erreur lors de l'ajout de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFeaturedImage = async (projectId: string, imageId: string) => {
    if (!token || !confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/featured-images/${imageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchProjects();
        if (selectedProject) {
          const updatedProject = await fetch(`/api/projects/${selectedProject.id}`).then((r) => r.json());
          setSelectedProject(updatedProject);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erreur lors de la suppression de l'image");
      }
    } catch (err) {
      console.error("Error deleting featured image:", err);
      alert("Erreur lors de la suppression de l'image");
    }
  };

  const filteredProjects = filterStatus
    ? projects.filter((p) => p.status === filterStatus)
    : projects;

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
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full">
          <div className="max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full overflow-x-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  CV Organisationnel - Administration
                </h1>
                <p className="text-gray-600">
                  Ajoutez des projets au CV organisationnel en les marquant comme terminés et en remplissant les informations requises.
                </p>
              </div>

              {/* Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filtrer par statut
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tous les projets</option>
                  <option value="PLANNED">Planifié</option>
                  <option value="ONGOING">En cours</option>
                  <option value="COMPLETED">Terminé</option>
                  <option value="CANCELLED">Annulé</option>
                </select>
              </div>

              {/* Projects List */}
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  {error}
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600">Aucun projet trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
                    >
                      <h3 className="font-bold text-gray-800 mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Statut: <span className="font-semibold">{project.status}</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Zone: {project.interventionArea}
                      </p>
                      <button
                        onClick={() => handleAddToCV(project)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Ajouter au CV organisationnel
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal */}
              {showModal && selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                          Ajouter au CV organisationnel
                        </h2>
                        <button
                          onClick={handleCloseModal}
                          className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Projet: <strong>{selectedProject.title}</strong>
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                      {/* Info about status change */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> Le statut du projet sera automatiquement changé à <strong>"Terminé"</strong> lors de l'ajout au CV organisationnel.
                        </p>
                      </div>

                      {/* Funder */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Bailleur de fonds *
                        </label>
                        <input
                          type="text"
                          name="funder"
                          defaultValue={selectedProject.funder || ""}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nom du bailleur de fonds"
                        />
                      </div>

                      {/* Amount and Currency */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Montant *
                          </label>
                          <input
                            type="number"
                            name="amount"
                            step="0.01"
                            defaultValue={selectedProject.amount || ""}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Devise *
                          </label>
                          <select
                            name="currency"
                            defaultValue={selectedProject.currency || "USD"}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="CDF">CDF (FC)</option>
                          </select>
                        </div>
                      </div>

                      {/* Actual Results */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Principaux résultats (synthèse de 200 mots) *
                        </label>
                        <textarea
                          name="actualResults"
                          rows={6}
                          defaultValue={selectedProject.actualResults || ""}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Décrivez les principaux résultats obtenus dans ce projet (environ 200 mots)..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Synthèse de 200 mots présentant les principaux résultats du projet
                        </p>
                      </div>

                      {/* Challenges */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Défis rencontrés
                        </label>
                        <textarea
                          name="challenges"
                          rows={4}
                          defaultValue={selectedProject.challenges || ""}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Décrivez les défis rencontrés lors de la mise en œuvre du projet..."
                        />
                      </div>

                      {/* Perspectives */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Perspectives
                        </label>
                        <textarea
                          name="perspectives"
                          rows={4}
                          defaultValue={selectedProject.perspectives || ""}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Décrivez les perspectives d'avenir pour ce projet..."
                        />
                      </div>

                      {/* Featured Images */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Photos phares ({selectedProject.featuredImages?.length || 0} / 2)
                        </label>
                        <div className="space-y-4">
                          {selectedProject.featuredImages?.map((img) => (
                            <div
                              key={img.id}
                              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <Image
                                src={img.imageUrl}
                                alt={img.altText || ""}
                                width={100}
                                height={100}
                                className="object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="text-sm text-gray-600">{img.altText || "Sans description"}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteFeaturedImage(selectedProject.id, img.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Supprimer
                              </button>
                            </div>
                          ))}
                          {(!selectedProject.featuredImages || selectedProject.featuredImages.length < 2) && (
                            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                              <p className="text-sm text-gray-600 mb-4 text-center">
                                Ajoutez une photo phare (max 2 images)
                              </p>
                              
                              {/* File Input */}
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Sélectionner une image
                                </label>
                                <input
                                  type="file"
                                  id={`featured-image-file-${selectedProject.id}`}
                                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                  onChange={handleFileChange}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Formats acceptés: JPEG, PNG, GIF, WebP (max 10MB)
                                </p>
                              </div>

                              {/* Preview */}
                              {previewUrl && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
                                  <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                                    <Image
                                      src={previewUrl}
                                      alt="Preview"
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Alt Text */}
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Description de l'image (optionnel)
                                </label>
                                <input
                                  type="text"
                                  value={imageAltText}
                                  onChange={(e) => setImageAltText(e.target.value)}
                                  placeholder="Description de l'image"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>

                              {/* Upload Button */}
                              <button
                                type="button"
                                onClick={handleAddFeaturedImage}
                                disabled={!selectedFile || uploading}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {uploading ? "Upload en cours..." : "Ajouter l'image"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-end gap-4 pt-4 border-t">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? "Ajout en cours..." : "Ajouter au CV organisationnel"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CVOrganisationnelAdminPage;

