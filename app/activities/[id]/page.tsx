import { activities } from "@/constants/activities";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ActivityDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ActivityDetailPage: React.FC<ActivityDetailPageProps> = async ({
  params,
}) => {
  const { id } = await params;
  const activity = activities.find((act) => act.id === id);

  if (!activity) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48">
                <Image
                  src={activity.img}
                  alt={activity.title}
                  className="rounded-xl object-cover shadow-lg"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {activity.frenchTitle || activity.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{activity.date}</p>
              <div className="text-gray-700 text-lg leading-relaxed">
                {activity.description}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Section */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
                Programme de l'activité
              </h2>
              <div className="space-y-4">
                {activity.program && activity.program.length > 0 ? (
                  activity.program.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-16 text-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {item.time}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
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

            {/* Online Event Link */}
            {activity.onlineEventLink && (
              <div className="bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
                  Participation en ligne
                </h2>
                <Link
                  href={activity.onlineEventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
                >
                  Rejoindre l'événement en ligne
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Participating Organizations */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-purple-500 rounded-full mr-3"></span>
                Organisations participantes
              </h2>
              <div className="space-y-3">
                {activity.participatingOrganizations &&
                activity.participatingOrganizations.length > 0 ? (
                  activity.participatingOrganizations.map((org, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">{org}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    Aucune organisation spécifiée.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-2 h-8 bg-orange-500 rounded-full mr-3"></span>
                Informations rapides
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{activity.date}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {activity.participatingOrganizations
                      ? activity.participatingOrganizations.length
                      : 0}{" "}
                    organisations
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {activity.program ? activity.program.length : 0} événements
                    programmés
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
