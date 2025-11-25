"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { close, logo, menu } from "@/public/assets";
import thelogo from "@/public/assets/logo.png";
import { navLinks } from "@/constants";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [toggle, setToggle] = useState(false);

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
            {nav.link.startsWith("#") ? (
              <a
                href={pathname === "/" ? nav.link : `/${nav.link}`}
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    const element = document.querySelector(nav.link);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                {nav.title}
              </a>
            ) : (
              <a href={nav.link}>{nav.title}</a>
            )}
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
              <a href="/login" className="hover:text-green-600">Login</a>
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
                {nav.link.startsWith("#") ? (
                  <a
                    href={pathname === "/" ? nav.link : `/${nav.link}`}
                    onClick={(e) => {
                      if (pathname === "/") {
                        e.preventDefault();
                        const element = document.querySelector(nav.link);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }}
                  >
                    {nav.title}
                  </a>
                ) : (
                  <a href={nav.link}>{nav.title}</a>
                )}
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
                  <a href="/login">Login</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
