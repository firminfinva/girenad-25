"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string | null;
  imageUrl: string | null;
  status: string;
  programs?: Array<{ time: string; event: string; order: number }>;
  organizations?: Array<{ id: string; name: string; order: number }>;
}

const ActivityDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      const response = await fetch(`/api/activities/${id}`);
      if (response.ok) {
        const data = await response.json();
        setActivity(data);
      } else {
        setError("Activité non trouvée");
      }
    } catch (err) {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 flex items-center justify-center">
        <p className="text-red-600">{error || "Activité non trouvée"}</p>
      </div>
    );
  }

  const formattedDate = new Date(activity.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Check if location is a URL
  const isUrl = (str: string | null): boolean => {
    if (!str) return false;
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 w-full overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full">
            {activity.imageUrl && (
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48">
                  <Image
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="rounded-xl object-cover shadow-lg"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
            <div className="flex-1 text-center lg:text-left min-w-0 w-full">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 break-words">
                {activity.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-4 break-words">
                {formattedDate}
              </p>
              {activity.location && (
                <div className="mb-4">
                  {isUrl(activity.location) ? (
                    <a
                      href={activity.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-2 py-1 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg break-all w-[300px]"
                    >
                      <span className="mr-1 text-xs">🔗</span>
                      <span className="truncate text-sm">
                        {activity.location}
                      </span>
                      <svg
                        className="w-3 h-3 ml-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-lg text-gray-600 break-words">
                      📍 {activity.location}
                    </p>
                  )}
                </div>
              )}
              <div className="text-gray-700 text-base sm:text-lg leading-relaxed break-words">
                {activity.description}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 min-w-0 w-full">
            {/* Program Section */}
            <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full overflow-hidden">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                <span className="break-words">Programme de l'activité</span>
              </h2>
              <div className="space-y-4">
                {activity.programs && activity.programs.length > 0 ? (
                  activity.programs
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg w-full overflow-hidden"
                      >
                        <div className="flex-shrink-0 w-16 text-center">
                          <span className="text-sm font-semibold text-gray-600">
                            {item.time}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium break-words">
                            {item.event}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-600">Programme à venir.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 min-w-0 w-full">
            {/* Organizations Section */}
            {activity.organizations && activity.organizations.length > 0 && (
              <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full overflow-hidden">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="w-2 h-8 bg-purple-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="break-words">
                    Organisations participantes
                  </span>
                </h2>
                <div className="space-y-3">
                  {activity.organizations.map((org) => (
                    <div
                      key={org.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium break-words">
                        {org.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full overflow-hidden">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-orange-500 rounded-full mr-3 flex-shrink-0"></span>
                <span className="break-words">Informations rapides</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 min-w-0">
                  <svg
                    className="w-5 h-5 text-orange-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 break-words">
                    {formattedDate}
                  </span>
                </div>
                {activity.location && !isUrl(activity.location) && (
                  <div className="flex items-center space-x-3 min-w-0">
                    <svg
                      className="w-5 h-5 text-orange-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 break-words">
                      {activity.location}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-3 min-w-0">
                  <svg
                    className="w-5 h-5 text-orange-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 break-words">
                    {activity.programs ? activity.programs.length : 0}{" "}
                    événements programmés
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
