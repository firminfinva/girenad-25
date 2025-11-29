"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/dashboards/Sidebar";
import UserDashboard from "@/components/dashboards/UserDashboard";
import ModeratorDashboard from "@/components/dashboards/ModeratorDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";

const DashboardPage: React.FC = () => {
  const { isAuthenticated, user, token, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyTokenAndRole = async () => {
      if (!loading) {
        if (!isAuthenticated || !token) {
          router.push("/login");
          return;
        }

        // Verify token and refresh user data from server
        try {
          const response = await fetch("/api/auth/verify", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            // Token invalid, redirect to login
            router.push("/login");
            return;
          }

          // Refresh user data from backend (always get latest)
          await refreshUser();
        } catch (error) {
          console.error("Error verifying token:", error);
          router.push("/login");
          return;
        } finally {
          setVerifying(false);
        }
      }
    };

    verifyTokenAndRole();
  }, [isAuthenticated, token, loading, router, refreshUser]);

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Render dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case "SUPERADMIN":
      case "ADMIN":
        return <AdminDashboard user={user} />;
      case "MODERATOR":
        return <ModeratorDashboard user={user} />;
      case "USER":
      default:
        return <UserDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 min-h-screen w-0 overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-full">
          <div className="max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full overflow-x-auto">
              {renderDashboard()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
