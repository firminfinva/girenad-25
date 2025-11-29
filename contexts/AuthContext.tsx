"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

export type UserRole = "SUPERADMIN" | "ADMIN" | "MODERATOR" | "USER";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  validated?: boolean;
  phone?: string | null;
  organization?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from backend using token
  const fetchUserData = useCallback(async (authToken: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            role: data.user.role,
            validated: data.user.validated,
            phone: data.user.phone,
            organization: data.user.organization,
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    // Check for token in localStorage on mount
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      // Fetch user data from backend
      fetchUserData(storedToken).then((success) => {
        if (!success) {
          // Token invalid, clear it
          localStorage.removeItem("token");
          setToken(null);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [fetchUserData]);

  const login = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    // Also set token in cookie for middleware access
    document.cookie = `token=${newToken}; path=/; max-age=${
      7 * 24 * 60 * 60
    }; SameSite=Lax`;
    
    // Fetch user data from backend
    await fetchUserData(newToken);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUserData(token);
    }
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);

    // Remove token from localStorage
    try {
      localStorage.removeItem("token");
      // Also remove cookie
      document.cookie = "token=; path=/; max-age=0";
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
