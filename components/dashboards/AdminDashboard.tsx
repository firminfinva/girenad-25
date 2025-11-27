"use client";
import Link from "next/link";

interface AdminDashboardProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord Administrateur
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Gérez tous les aspects de la plateforme GIRENAD
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-red-50 rounded-lg p-4 sm:p-6 border border-red-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Gestion des Utilisateurs
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/user-roles"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-red-700 text-white rounded-md hover:bg-red-800 transition"
            >
              Changer le rôle d&apos;un utilisateur
            </Link>
            <Link
              href="/admin/users"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Tous les Utilisateurs
            </Link>
            <Link
              href="/admin/users/pending"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Utilisateurs en attente
            </Link>
            <Link
              href="/admin/users/create"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-red-400 text-white rounded-md hover:bg-red-500 transition"
            >
              Créer un Utilisateur
            </Link>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 sm:p-6 border border-purple-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Gestion des Projets
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/admin/projects"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              Tous les Projets
            </Link>
            <Link
              href="/admin/projects/create"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
            >
              Créer un Projet
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Gestion des Activités
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/admin/activities"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Toutes les Activités
            </Link>
            <Link
              href="/admin/activities/create"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Créer une Activité
            </Link>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 sm:p-6 border border-green-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Gestion des Offres
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/offres"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Toutes les Offres
            </Link>
            <Link
              href="/offres/create"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Créer une Offre
            </Link>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 border border-yellow-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Statistiques
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/admin/statistics"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              Voir les Statistiques
            </Link>
            <Link
              href="/admin/reports"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            >
              Rapports
            </Link>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4 sm:p-6 border border-indigo-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Paramètres
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/admin/settings"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Paramètres Système
            </Link>
            <Link
              href="/admin/roles"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
              Gestion des Rôles
            </Link>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 sm:p-6 border border-orange-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Gestion des Partenaires
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/admin/partners"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
            >
              Tous les Partenaires
            </Link>
            <Link
              href="/admin/partners/create"
              className="block w-full text-center py-2 px-3 sm:px-4 text-sm sm:text-base bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
            >
              Ajouter un Partenaire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
