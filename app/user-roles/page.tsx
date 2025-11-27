"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthVerification } from "@/hooks/useAuthVerification";
import Sidebar from "@/components/dashboards/Sidebar";

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

const UserRolesManagementPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  // Verify token and role from server (ensures role changes are detected)
  const { loading: verifying, isValid } = useAuthVerification("USER");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRole, setFilterRole] = useState<string>("");

  useEffect(() => {
    if (isValid && token) {
      fetchUsers();
    }
  }, [isValid, token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/roles", {
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
    if (!confirm(`Êtes-vous sûr de vouloir changer le rôle de cet utilisateur en ${newRole} ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}/role`, {
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Administrateur";
      case "MODERATOR":
        return "Modérateur";
      case "USER":
        return "Utilisateur";
      default:
        return role;
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filterRole && user.role !== filterRole) return false;
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
                  Gestion des Rôles Utilisateurs
                </h1>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Filters */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrer par rôle
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Tous les rôles</option>
                  <option value="SUPERADMIN">Super Admin</option>
                  <option value="ADMIN">Administrateur</option>
                  <option value="MODERATOR">Modérateur</option>
                  <option value="USER">Utilisateur</option>
                </select>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    {users.length === 0
                      ? "Aucun utilisateur enregistré"
                      : "Aucun utilisateur ne correspond aux filtres"}
                  </p>
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
                          Rôle Actuel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Changer le Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date de création
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
                            <span
                              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                                userItem.role
                              )}`}
                            >
                              {getRoleLabel(userItem.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={userItem.role}
                              onChange={(e) =>
                                handleUpdateRole(userItem.id, e.target.value)
                              }
                              className="text-xs font-medium px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                              <option value="USER">Utilisateur</option>
                              <option value="MODERATOR">Modérateur</option>
                              <option value="ADMIN">Administrateur</option>
                              <option value="SUPERADMIN">Super Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(userItem.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                Total: {filteredUsers.length} utilisateur(s)
                {filterRole ? ` (${users.length} au total)` : ""}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserRolesManagementPage;

