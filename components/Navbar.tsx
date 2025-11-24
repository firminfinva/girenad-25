"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { close, logo, menu } from "@/public/assets";
import thelogo from "@/public/assets/logo.png";
import { navLinks } from "@/constants";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const router = useRouter();
  const [toggle, setToggle] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to send OTP");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      // Only proceed if response is successful (status 200-299)
      if (res.ok && res.status >= 200 && res.status < 300) {
        // Verify that we have both token and user data
        if (data.token && data.user) {
          // Store token and user in auth context
          login(data.token, data.user);
          setShowLoginModal(false);
          setEmail("");
          setOtp("");
          setStep("email");
          router.push("/dashboard");
        } else {
          setError("Données de connexion incomplètes");
        }
      } else {
        // OTP verification failed - do NOT login
        setError(data.error || "OTP invalide ou expiré");
        // Clear OTP input
        setOtp("");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="w-full bg-white flex py-1 justify-between items-center navbar">
      <a href="/">
        <Image src={thelogo} alt="girenad" width={160} height={64} />
      </a>
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] text-black ${
              index === navLinks.length - 1 ? "mr-0" : "mr-10"
            }`}
          >
            <a href={`${nav.link}`}>{nav.title}</a>
          </li>
        ))}
        {isAuthenticated ? (
          <>
            <li className="font-poppins font-normal cursor-pointer text-[16px] text-black ml-10">
              <a href="/dashboard" className="hover:text-green-600">
                Dashboard
              </a>
            </li>
            <li className="font-poppins font-normal cursor-pointer text-[16px] text-black ml-10">
              <button onClick={handleLogout} className="hover:text-red-600">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="font-poppins font-normal cursor-pointer text-[16px] text-black ml-10">
              <a href="/register" className="hover:text-green-600">
                Sign Up
              </a>
            </li>
            <li className="font-poppins font-normal cursor-pointer text-[16px] text-black ml-10">
              <button onClick={() => setShowLoginModal(true)}>Login</button>
            </li>
          </>
        )}
      </ul>
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <Image
          src={toggle ? close : menu}
          alt="menu"
          className="object-contain"
          width={28}
          height={28}
          onClick={() => setToggle((prev) => !prev)}
        />
        <div
          className={`${toggle ? "flex" : "hidden"}
            p-6 bg-white absolute top-20 ring-0 my-[0.6rem] w-full rounded-xl sidebar`}
        >
          <ul className="list-none flex flex-col justify-end px-[50px] items-left flex-1">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-normal cursor-pointer text-[23px] text-black ${
                  index === navLinks.length - 1 ? "mr-0" : "mb-4"
                }`}
              >
                <a href={`${nav.link}`}>{nav.title}</a>
              </li>
            ))}
            {isAuthenticated ? (
              <>
                <li className="font-poppins font-normal cursor-pointer text-[23px] text-black mb-4">
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li className="font-poppins font-normal cursor-pointer text-[23px] text-black mb-4">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="font-poppins font-normal cursor-pointer text-[23px] text-black mb-4">
                  <a href="/register">Sign Up</a>
                </li>
                <li className="font-poppins font-normal cursor-pointer text-[23px] text-black mb-4">
                  <button onClick={() => setShowLoginModal(true)}>Login</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {step === "email" ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
            <button
              onClick={() => {
                setShowLoginModal(false);
                setEmail("");
                setOtp("");
                setStep("email");
                setError("");
              }}
              className="w-full mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
