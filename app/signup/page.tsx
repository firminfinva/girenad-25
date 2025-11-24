"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SignUpPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to sign up page...</p>
      </div>
    </div>
  );
};

export default SignUpPage;

