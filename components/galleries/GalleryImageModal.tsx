"use client";
import { useState, useEffect } from "react";

interface GalleryImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  order: number;
  createdAt: string;
}

interface Gallery {
  id: string;
  title: string | null;
  description: string | null;
  images: GalleryImage[];
}

interface GalleryImageModalProps {
  projectId: string;
  gallery: Gallery;
  onClose: () => void;
  token: string;
}

const GalleryImageModal: React.FC<GalleryImageModalProps> = ({
  projectId,
  gallery,
  onClose,
  token,
}) => {
  const [images, setImages] = useState<GalleryImage[]>(gallery.images);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: "",
    altText: "",
  });

  useEffect(() => {
    setImages(gallery.images);
  }, [gallery]);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/gallery/${gallery.id}/images`
      );
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length >= 6) {
      setError("Une galerie ne peut contenir que 6 images maximum");
      return;
    }

    if (!formData.imageUrl.trim()) {
      setError("L'URL de l'image est requise");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
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

      if (response.ok) {
        setFormData({ imageUrl: "", altText: "" });
        setShowAddForm(false);
        fetchImages();
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de l'ajout de l'image");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/gallery/${gallery.id}/images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchImages();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-blue-600 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {gallery.title || "Galerie"}
            </h2>
            {gallery.description && (
              <p className="text-white/80 text-sm mt-1">
                {gallery.description}
              </p>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-white/80 text-sm">
              {images.length}/6 images
            </span>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              disabled={images.length >= 6}
            >
              {showAddForm ? "Annuler" : "+ Ajouter une Image"}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ajouter une Image
              </h3>
              <form onSubmit={handleAddImage} className="space-y-4">
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
                <button
                  type="submit"
                  disabled={loading || images.length >= 6}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Ajout..." : "Ajouter l'Image"}
                </button>
              </form>
            </div>
          )}

          {images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                Aucune image dans cette galerie
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Ajouter la première image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    <img
                      src={image.imageUrl}
                      alt={image.altText || gallery.title || "Gallery image"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23ddd' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage non disponible%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {/* Show empty slots if less than 6 */}
              {Array.from({ length: 6 - images.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                >
                  <span className="text-gray-400 text-sm">
                    Emplacement {images.length + index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryImageModal;

