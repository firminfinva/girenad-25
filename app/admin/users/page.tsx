"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthVerification } from "@/hooks/useAuthVerification";
import Sidebar from "@/components/dashboards/Sidebar";
import Link from "next/link";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  validated: boolean;
  organization: string | null;
  createdAt: string;
}

const UsersManagementPage: React.FC = () => {
  const { token, user } = useAuth();
  const router = useRouter();
  // Verify token and role from server (ensures role changes are detected)
  const { loading: verifying, isValid } = useAuthVerification("ADMIN");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRole, setFilterRole] = useState<string>("");
  const [filterValidated, setFilterValidated] = useState<string>("");

  useEffect(() => {
    if (isValid && token) {
      fetchUsers();
    }
  }, [isValid, token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors du chargement des utilisateurs");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    // Prevent admins from changing their own role
    if (user && user.id === userId) {
      const isCurrentUserAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";
      const isNewRoleNonAdmin = newRole !== "ADMIN" && newRole !== "SUPERADMIN";
      
      if (isCurrentUserAdmin && isNewRoleNonAdmin) {
        alert("Vous ne pouvez pas changer votre propre rôle d'administrateur");
        fetchUsers(); // Refresh to reset the dropdown
        return;
      }
    }

    if (!confirm(`Êtes-vous sûr de vouloir changer le rôle de cet utilisateur en ${newRole} ?`)) {
      fetchUsers(); // Refresh to reset the dropdown
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la mise à jour");
        fetchUsers(); // Refresh to reset the dropdown
      }
    } catch (err) {
      alert("Erreur de connexion");
      fetchUsers(); // Refresh to reset the dropdown
    }
  };

  const handleToggleValidation = async (userId: string, currentStatus: boolean) => {
    // Prevent admins from invalidating themselves
    if (user && user.id === userId && currentStatus === true) {
      alert("Vous ne pouvez pas invalider votre propre compte");
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ validated: !currentStatus }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-yellow-100 text-yellow-800";
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MODERATOR":
        return "bg-purple-100 text-purple-800";
      case "USER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filterRole && user.role !== filterRole) return false;
    if (filterValidated === "validated" && !user.validated) return false;
    if (filterValidated === "unvalidated" && user.validated) return false;
    return true;
  });

  if (loading || verifying || !isValid) {
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
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des Utilisateurs
                </h1>
                <Link
                  href="/admin/users/create"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  + Créer un Utilisateur
                </Link>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrer par rôle
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Tous les rôles</option>
                    <option value="SUPERADMIN">Super Admin</option>
                    <option value="ADMIN">Administrateur</option>
                    <option value="MODERATOR">Modérateur</option>
                    <option value="USER">Utilisateur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrer par statut
                  </label>
                  <select
                    value={filterValidated}
                    onChange={(e) => setFilterValidated(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="validated">Validés</option>
                    <option value="unvalidated">Non validés</option>
                  </select>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {users.length === 0
                      ? "Aucun utilisateur enregistré"
                      : "Aucun utilisateur ne correspond aux filtres"}
                  </p>
                  {users.length === 0 && (
                    <Link
                      href="/admin/users/create"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition inline-block"
                    >
                      Créer le premier utilisateur
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Téléphone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date de création
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((userItem) => (
                        <tr key={userItem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {userItem.firstName} {userItem.lastName}
                            </div>
                            {userItem.organization && (
                              <div className="text-sm text-gray-500">
                                {userItem.organization}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {userItem.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {userItem.phone || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user && user.id === userItem.id && (user.role === "ADMIN" || user.role === "SUPERADMIN") ? (
                              <div className="flex flex-col">
                                <select
                                  value={userItem.role}
                                  disabled
                                  className={`text-xs font-medium px-2 py-1 rounded ${getRoleBadgeColor(
                                    userItem.role
                                  )} border-0 opacity-60 cursor-not-allowed`}
                                  title="Vous ne pouvez pas modifier votre propre rôle"
                                >
                                  <option value="USER">Utilisateur</option>
                                  <option value="MODERATOR">Modérateur</option>
                                  <option value="ADMIN">Administrateur</option>
                                  <option value="SUPERADMIN">Super Admin</option>
                                </select>
                                <span className="text-xs text-gray-500 mt-1">(Vous)</span>
                              </div>
                            ) : (
                              <select
                                value={userItem.role}
                                onChange={(e) =>
                                  handleUpdateRole(userItem.id, e.target.value)
                                }
                                className={`text-xs font-medium px-2 py-1 rounded ${getRoleBadgeColor(
                                  userItem.role
                                )} border-0 focus:ring-2 focus:ring-green-500`}
                              >
                                <option value="USER">Utilisateur</option>
                                <option value="MODERATOR">Modérateur</option>
                                <option value="ADMIN">Administrateur</option>
                                <option value="SUPERADMIN">Super Admin</option>
                              </select>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user && user.id === userItem.id ? (
                              <div className="flex flex-col">
                                <button
                                  disabled
                                  className={`text-xs font-medium px-2 py-1 rounded ${
                                    userItem.validated
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  } opacity-60 cursor-not-allowed`}
                                  title="Vous ne pouvez pas invalider votre propre compte"
                                >
                                  {userItem.validated ? "Validé" : "Non validé"}
                                </button>
                                <span className="text-xs text-gray-500 mt-1">(Vous)</span>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleToggleValidation(
                                    userItem.id,
                                    userItem.validated
                                  )
                                }
                                className={`text-xs font-medium px-2 py-1 rounded ${
                                  userItem.validated
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                } hover:opacity-80 transition`}
                              >
                                {userItem.validated ? "Validé" : "Non validé"}
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(userItem.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link
                              href={`/admin/users/${userItem.id}/edit`}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Modifier
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                Total: {filteredUsers.length} utilisateur(s)
                {filterRole || filterValidated
                  ? ` (${users.length} au total)`
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsersManagementPage;

