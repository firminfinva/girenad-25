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
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord Administrateur
        </h1>
        <p className="text-gray-600">
          Gérez tous les aspects de la plateforme GIRENAD
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Gestion des Utilisateurs
          </h2>
          <div className="space-y-3">
            <Link
              href="/user-roles"
              className="block w-full text-center py-2 px-4 bg-red-700 text-white rounded-md hover:bg-red-800 transition"
            >
              Changer le rôle d&apos;un utilisateur
            </Link>
            <Link
              href="/admin/users"
              className="block w-full text-center py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Tous les Utilisateurs
            </Link>
            <Link
              href="/admin/users/pending"
              className="block w-full text-center py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Utilisateurs en attente
            </Link>
            <Link
              href="/admin/users/create"
              className="block w-full text-center py-2 px-4 bg-red-400 text-white rounded-md hover:bg-red-500 transition"
            >
              Créer un Utilisateur
            </Link>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Gestion des Projets
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/projects"
              className="block w-full text-center py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              Tous les Projets
            </Link>
            <Link
              href="/admin/projects/create"
              className="block w-full text-center py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
            >
              Créer un Projet
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Gestion des Activités
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/activities"
              className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Toutes les Activités
            </Link>
            <Link
              href="/admin/activities/create"
              className="block w-full text-center py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Créer une Activité
            </Link>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Gestion des Offres
          </h2>
          <div className="space-y-3">
            <Link
              href="/offres"
              className="block w-full text-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Toutes les Offres
            </Link>
            <Link
              href="/offres/create"
              className="block w-full text-center py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Créer une Offre
            </Link>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Statistiques
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/statistics"
              className="block w-full text-center py-2 px-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              Voir les Statistiques
            </Link>
            <Link
              href="/admin/reports"
              className="block w-full text-center py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            >
              Rapports
            </Link>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Paramètres
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/settings"
              className="block w-full text-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Paramètres Système
            </Link>
            <Link
              href="/admin/roles"
              className="block w-full text-center py-2 px-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
              Gestion des Rôles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
