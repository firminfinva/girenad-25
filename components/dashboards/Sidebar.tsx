"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

interface SidebarItem {
  title: string;
  href: string;
  icon: string;
  roles?: ("ADMIN" | "MODERATOR" | "USER")[];
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      title: "Tableau de bord",
      href: "/dashboard",
      icon: "📊",
      roles: ["ADMIN", "MODERATOR", "USER"],
    },
    // Admin only items
    {
      title: "Projets",
      href: "/admin/projects",
      icon: "📁",
      roles: ["ADMIN"],
    },
    {
      title: "Activités",
      href: "/admin/activities",
      icon: "🎯",
      roles: ["ADMIN", "MODERATOR"],
    },
    // Admin only items
    {
      title: "Utilisateurs",
      href: "/admin/users",
      icon: "👥",
      roles: ["ADMIN"],
    },
    {
      title: "Statistiques",
      href: "/admin/statistics",
      icon: "📈",
      roles: ["ADMIN"],
    },
    // User items
    {
      title: "Mes Activités",
      href: "/activities",
      icon: "📅",
      roles: ["USER"],
    },
    {
      title: "Offres d'Emploi",
      href: "/offres",
      icon: "💼",
      roles: ["USER"],
    },
  ];

  const filteredItems = sidebarItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role || "USER")
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white
          transform transition-transform duration-300 ease-in-out z-40
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          shadow-2xl
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Image
                  src="/assets/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">GIRENAD</h2>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.firstName?.[0]?.toUpperCase()}
                {user?.lastName?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    user?.role === "ADMIN"
                      ? "bg-red-500/20 text-red-300"
                      : user?.role === "MODERATOR"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {user?.role === "ADMIN"
                    ? "Administrateur"
                    : user?.role === "MODERATOR"
                    ? "Modérateur"
                    : "Utilisateur"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive(item.href)
                      ? "bg-green-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
