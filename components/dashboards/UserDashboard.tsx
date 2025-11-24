"use client";
import Link from "next/link";

interface UserDashboardProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenue, {user.firstName} !
        </h1>
        <p className="text-gray-600">
          Gérez vos activités et consultez les offres disponibles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-2xl">
              📅
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Mes Activités
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            Consultez et participez aux activités disponibles
          </p>
          <Link
            href="/activities"
            className="inline-block w-full text-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
          >
            Voir les Activités
          </Link>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl">
              💼
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Offres d'Emploi
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            Découvrez les opportunités d'emploi disponibles
          </p>
          <Link
            href="/offres"
            className="inline-block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
          >
            Voir les Offres
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
