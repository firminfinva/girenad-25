"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboards/Sidebar";
import Link from "next/link";

interface TeamMember {
  id: string;
  userId: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  order: number;
  featured: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
}

const TeamMembersPage: React.FC = () => {
  const { token, isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTeamMembers();
    }
  }, [isAuthenticated]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/team");
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      } else {
        setError("Erreur lors du chargement des membres de l'équipe");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchTeamMembers();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
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
                  Membres de l'Équipe
                </h1>
                <Link
                  href="/admin/team/create"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  + Ajouter un Membre
                </Link>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {teamMembers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    Aucun membre de l'équipe enregistré
                  </p>
                  <Link
                    href="/admin/team/create"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition inline-block"
                  >
                    Ajouter le premier membre
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {member.user.firstName} {member.user.lastName}
                          </h3>
                          {member.role && (
                            <p className="text-gray-600 text-sm mt-1">
                              {member.role}
                            </p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            {member.user.email}
                          </p>
                        </div>
                        {member.featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            En vedette
                          </span>
                        )}
                      </div>

                      {member.imageUrl && (
                        <div className="mb-4">
                          <img
                            src={member.imageUrl}
                            alt={`${member.user.firstName} ${member.user.lastName}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {member.bio && (
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                          {member.bio}
                        </p>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Link
                          href={`/admin/team/${member.id}/edit`}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-center text-sm"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamMembersPage;
