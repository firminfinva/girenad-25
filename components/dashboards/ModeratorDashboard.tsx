"use client";
import Link from "next/link";

interface ModeratorDashboardProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const ModeratorDashboard: React.FC<ModeratorDashboardProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord Modérateur
        </h1>
        <p className="text-gray-600">
          Gérez les projets, activités et validez les utilisateurs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Gestion des Activités
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/activities"
              className="block w-full text-center py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              Voir toutes les Activités
            </Link>
            <Link
              href="/admin/activities/create"
              className="block w-full text-center py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
            >
              Créer une Activité
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Gestion des Offres
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/projects"
              className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Voir tous les Projets
            </Link>
            <Link
              href="/admin/projects/create"
              className="block w-full text-center py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Créer un Projet
            </Link>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Validation des Utilisateurs
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/users"
              className="block w-full text-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Gérer les Utilisateurs
            </Link>
            <Link
              href="/admin/users/pending"
              className="block w-full text-center py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Utilisateurs en attente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
