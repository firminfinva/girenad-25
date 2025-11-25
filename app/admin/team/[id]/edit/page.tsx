"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboards/Sidebar";

const EditTeamMemberPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    userId: "",
    role: "",
    bio: "",
    linkedinUrl: "",
    twitterUrl: "",
    order: 0,
    featured: false,
  });
  const [userInfo, setUserInfo] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  } | null>(null);

  useEffect(() => {
    fetchTeamMember();
  }, [memberId]);

  const fetchTeamMember = async () => {
    try {
      const response = await fetch(`/api/team/${memberId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          userId: data.userId || "",
          role: data.role || "",
          bio: data.bio || "",
          linkedinUrl: data.linkedinUrl || "",
          twitterUrl: data.twitterUrl || "",
          order: data.order || 0,
          featured: data.featured || false,
        });
        setCurrentImageUrl(data.imageUrl);
        if (data.user) {
          setUserInfo({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phone: data.user.phone,
          });
        }
      } else {
        setError("Erreur lors du chargement du membre de l'équipe");
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
      let imageUrl = currentImageUrl;

      // Upload new image if file is selected
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

      const response = await fetch(`/api/team/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
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
                Modifier le Membre de l'Équipe
              </h1>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {userInfo && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Informations de l'utilisateur (non modifiables ici)
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Nom complet:</p>
                        <p className="font-medium text-gray-900">
                          {userInfo.firstName} {userInfo.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email:</p>
                        <p className="font-medium text-gray-900">
                          {userInfo.email}
                        </p>
                      </div>
                      {userInfo.phone && (
                        <div>
                          <p className="text-gray-600">Téléphone:</p>
                          <p className="font-medium text-gray-900">
                            {userInfo.phone}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Pour modifier ces informations, allez dans la gestion des
                      utilisateurs.
                    </p>
                  </div>
                )}

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
                  {currentImageUrl && !previewUrl && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Photo actuelle:
                      </p>
                      <img
                        src={currentImageUrl}
                        alt="Current"
                        className="max-w-full h-48 object-cover rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  {previewUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Nouvelle photo:
                      </p>
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
                      ? "Mise à jour..."
                      : "Mettre à jour"}
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

export default EditTeamMemberPage;
