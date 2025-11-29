"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthVerification } from "@/hooks/useAuthVerification";
import Sidebar from "@/components/dashboards/Sidebar";

interface OTP {
  id: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  otp: string;
  expiresAt: string;
  createdAt: string;
  used: boolean;
  usedAt: string | null;
  isExpired: boolean;
  isActive: boolean;
}

interface DailyWork {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  workDate: string;
  completedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const StatisticsPage: React.FC = () => {
  const { token, user } = useAuth();
  const { loading: verifying, isValid } = useAuthVerification("ADMIN");
  const [otps, setOtps] = useState<OTP[]>([]);
  const [dailyWork, setDailyWork] = useState<DailyWork[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // OTP Filters
  const [otpFilterUser, setOtpFilterUser] = useState<string>("");
  const [otpFilterDateFrom, setOtpFilterDateFrom] = useState<string>("");
  const [otpFilterDateTo, setOtpFilterDateTo] = useState<string>("");
  const [otpFilterStatus, setOtpFilterStatus] = useState<string>("");

  // Daily Work Filters
  const [dwFilterUser, setDwFilterUser] = useState<string>("");
  const [dwFilterDateFrom, setDwFilterDateFrom] = useState<string>("");
  const [dwFilterDateTo, setDwFilterDateTo] = useState<string>("");
  const [dwFilterStatus, setDwFilterStatus] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"otp" | "dailywork">("otp");

  useEffect(() => {
    if (isValid && token) {
      fetchUsers();
      fetchOTPs();
      fetchDailyWork();
    }
  }, [isValid, token]);

  useEffect(() => {
    if (isValid && token) {
      fetchOTPs();
    }
  }, [otpFilterUser, otpFilterDateFrom, otpFilterDateTo, otpFilterStatus, isValid, token]);

  useEffect(() => {
    if (isValid && token) {
      fetchDailyWork();
    }
  }, [dwFilterUser, dwFilterDateFrom, dwFilterDateTo, dwFilterStatus, isValid, token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchOTPs = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (otpFilterUser) params.append("userId", otpFilterUser);
      if (otpFilterDateFrom) params.append("dateFrom", otpFilterDateFrom);
      if (otpFilterDateTo) params.append("dateTo", otpFilterDateTo);
      if (otpFilterStatus) params.append("status", otpFilterStatus);

      const response = await fetch(`/api/admin/statistics/otps?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOtps(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors du chargement des OTP");
      }
    } catch (error) {
      console.error("Error fetching OTPs:", error);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyWork = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (dwFilterUser) params.append("userId", dwFilterUser);
      if (dwFilterDateFrom) params.append("dateFrom", dwFilterDateFrom);
      if (dwFilterDateTo) params.append("dateTo", dwFilterDateTo);
      if (dwFilterStatus) params.append("status", dwFilterStatus);

      const response = await fetch(`/api/admin/statistics/daily-work?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDailyWork(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors du chargement du travail quotidien");
      }
    } catch (error) {
      console.error("Error fetching daily work:", error);
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const clearOTPFilters = () => {
    setOtpFilterUser("");
    setOtpFilterDateFrom("");
    setOtpFilterDateTo("");
    setOtpFilterStatus("");
  };

  const clearDailyWorkFilters = () => {
    setDwFilterUser("");
    setDwFilterDateFrom("");
    setDwFilterDateTo("");
    setDwFilterStatus("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  if (loading || verifying || !isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">
          {loading || verifying ? "Chargement..." : "Vérification en cours..."}
        </p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques</h1>
              <p className="text-gray-600 mb-6">
                Consultez et filtrez les OTP et le travail quotidien
              </p>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("otp")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "otp"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    OTP ({otps.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("dailywork")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "dailywork"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Travail Quotidien ({dailyWork.length})
                  </button>
                </nav>
              </div>

              {/* OTP Section */}
              {activeTab === "otp" && (
                <div>
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Filtres OTP</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Utilisateur
                        </label>
                        <select
                          value={otpFilterUser}
                          onChange={(e) => setOtpFilterUser(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Tous les utilisateurs</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.firstName} {u.lastName} ({u.email})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de début
                        </label>
                        <input
                          type="date"
                          value={otpFilterDateFrom}
                          onChange={(e) => setOtpFilterDateFrom(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          value={otpFilterDateTo}
                          onChange={(e) => setOtpFilterDateTo(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          value={otpFilterStatus}
                          onChange={(e) => setOtpFilterStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Tous</option>
                          <option value="active">Actif</option>
                          <option value="expired">Expiré</option>
                          <option value="used">Utilisé</option>
                          <option value="unused">Non utilisé</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={clearOTPFilters}
                      className="mt-4 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilisateur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            OTP
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Créé le
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Expire le
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {otps.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                              Aucun OTP trouvé
                            </td>
                          </tr>
                        ) : (
                          otps.map((otp) => (
                            <tr key={otp.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {otp.user.firstName} {otp.user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">{otp.user.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                {otp.otp}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(otp.createdAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(otp.expiresAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    otp.used
                                      ? "bg-blue-100 text-blue-800"
                                      : otp.isExpired
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {otp.used ? "Utilisé" : otp.isExpired ? "Expiré" : "Actif"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {otp.usedAt ? formatDate(otp.usedAt) : "-"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Daily Work Section */}
              {activeTab === "dailywork" && (
                <div>
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Filtres Travail Quotidien</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Utilisateur
                        </label>
                        <select
                          value={dwFilterUser}
                          onChange={(e) => setDwFilterUser(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Tous les utilisateurs</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.firstName} {u.lastName} ({u.email})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de début
                        </label>
                        <input
                          type="date"
                          value={dwFilterDateFrom}
                          onChange={(e) => setDwFilterDateFrom(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          value={dwFilterDateTo}
                          onChange={(e) => setDwFilterDateTo(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          value={dwFilterStatus}
                          onChange={(e) => setDwFilterStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Tous</option>
                          <option value="completed">Complété</option>
                          <option value="pending">En attente</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={clearDailyWorkFilters}
                      className="mt-4 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilisateur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Titre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date de travail
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Complété le
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dailyWork.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                              Aucun travail quotidien trouvé
                            </td>
                          </tr>
                        ) : (
                          dailyWork.map((work) => (
                            <tr key={work.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {work.user.firstName} {work.user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">{work.user.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {work.title}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                {work.description || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDateOnly(work.workDate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    work.completed
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {work.completed ? "Complété" : "En attente"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {work.completedAt ? formatDate(work.completedAt) : "-"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatisticsPage;

