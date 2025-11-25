"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboards/Sidebar";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

const CreateTeamMemberPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [formData, setFormData] = useState({
    userId: "",
    role: "",
    bio: "",
    linkedinUrl: "",
    twitterUrl: "",
    order: 0,
    featured: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value) || 0
          : value,
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
      let imageUrl: string | null = null;

      // Upload image if file is selected
      if (selectedFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);
        uploadFormData.append("folder", "girenad/team");
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

      const response = await fetch("/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: formData.userId,
          role: formData.role,
          bio: formData.bio,
          imageUrl,
          linkedinUrl: formData.linkedinUrl,
          twitterUrl: formData.twitterUrl,
          order: formData.order,
          featured: formData.featured,
        }),
      });

      if (response.ok) {
        router.push("/admin/team");
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la création");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
      setUploading(false);
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
                Ajouter un Membre de l'Équipe
              </h1>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Utilisateur * (Les informations de nom, email et téléphone
                    proviendront de l'utilisateur sélectionné)
                  </label>
                  {loadingUsers ? (
                    <p className="text-gray-500 text-sm">
                      Chargement des utilisateurs...
                    </p>
                  ) : (
                    <select
                      name="userId"
                      required
                      value={formData.userId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </option>
                      ))}
                    </select>
                  )}
                  {formData.userId && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      {(() => {
                        const selectedUser = users.find(
                          (u) => u.id === formData.userId
                        );
                        return selectedUser ? (
                          <div className="text-sm text-gray-700">
                            <p>
                              <strong>Nom:</strong> {selectedUser.firstName}{" "}
                              {selectedUser.lastName}
                            </p>
                            <p>
                              <strong>Email:</strong> {selectedUser.email}
                            </p>
                            {selectedUser.phone && (
                              <p>
                                <strong>Téléphone:</strong> {selectedUser.phone}
                              </p>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle / Poste
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Ex: Directeur Exécutif"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo (JPEG, PNG, GIF, WebP - Max 10MB)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  {previewUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Aperçu:</p>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biographie
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Description du membre de l'équipe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleChange}
                      placeholder="https://twitter.com/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordre d'affichage
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="mr-2 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Mettre en vedette
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading
                      ? "Upload en cours..."
                      : loading
                      ? "Création..."
                      : "Créer le Membre"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
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

export default CreateTeamMemberPage;
