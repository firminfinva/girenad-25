import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface VerificationResult {
  isValid: boolean;
  userRole: string | null;
  loading: boolean;
}

/**
 * Custom hook to verify token and role from server
 * This ensures that role changes are detected even if user is already logged in
 */
export function useAuthVerification(
  requiredRole?: "SUPERADMIN" | "ADMIN" | "MODERATOR" | "USER"
): VerificationResult {
  const { isAuthenticated, user, token, loading: authLoading, login } =
    useAuth();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const verifyTokenAndRole = async () => {
      if (authLoading) {
        return;
      }

      if (!isAuthenticated || !token) {
        router.push("/login");
        return;
      }

      try {
        // Verify token and get current user role from server
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Token invalid or expired, redirect to login
          router.push("/login");
          return;
        }

        const data = await response.json();

        // Update user role from server (in case it changed)
        if (data.user && user && data.user.role !== user.role) {
          // Role changed, update auth context
          console.warn("Role mismatch detected, updating user data");
          if (login && token) {
            // Update the user in context with new role from server
            login(token, {
              id: data.user.id,
              email: data.user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: data.user.role,
            });
          }
        }

        setUserRole(data.user.role);

        // Check if required role is met
        if (requiredRole) {
          if (requiredRole === "SUPERADMIN" && data.user.role !== "SUPERADMIN") {
            router.push("/dashboard");
            return;
          }
          if (requiredRole === "ADMIN" && data.user.role !== "SUPERADMIN" && data.user.role !== "ADMIN") {
            router.push("/dashboard");
            return;
          }
          if (
            requiredRole === "MODERATOR" &&
            data.user.role !== "SUPERADMIN" &&
            data.user.role !== "ADMIN" &&
            data.user.role !== "MODERATOR"
          ) {
            router.push("/dashboard");
            return;
          }
        }

        setIsValid(true);
      } catch (error) {
        console.error("Error verifying token:", error);
        router.push("/login");
      } finally {
        setVerifying(false);
      }
    };

    verifyTokenAndRole();
  }, [
    isAuthenticated,
    token,
    authLoading,
    router,
    user,
    requiredRole,
    login,
  ]);

  return {
    isValid,
    userRole,
    loading: authLoading || verifying,
  };
}

