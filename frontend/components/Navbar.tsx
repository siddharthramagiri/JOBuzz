"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, logout } = useAuth();

  const handleNavigation = (target: string) => {
    if (pathname === "/") {
      // Scroll on the same page
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home with hash
      router.push(`/#${target}`);
    }
  };
  
  useEffect(() => {
    if (pathname === "/") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    }
  }, [pathname]);

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center">
      <div className="bg-black/60 rounded-full py-2.5 px-8 max-w-4xl w-full mx-auto flex justify-between items-center shadow-lg backdrop-blur-sm">
        <a href="/" className="text-white text-2xl font-sans flex items-center gap-2">
          JoBuzz
        </a>

        <div className="hidden md:flex items-center space-x-10">
          <button onClick={() => handleNavigation("Guide")} className="text-white hover:text-gray-300 transition-colors">How it works</button>
          <button onClick={() => handleNavigation("Docs")} className="text-white hover:text-gray-300 transition-colors">Docs</button>
          {/* <button onClick={() => handleNavigation("about-us")} className="text-white hover:text-gray-300 transition-colors">About Us</button> */}
          <button onClick={() => handleNavigation("faq")} className="text-white hover:text-gray-300 transition-colors">FAQ</button>
          <button onClick={() => handleNavigation("contact")} className="text-white hover:text-gray-300 transition-colors">Contact Us</button>
        </div>

        <div className="relative">
          <div className="absolute -inset-px rounded-lg opacity-30 blur-sm"></div>
          {token ? (
            <button
              className="relative bg-[#2a1717] text-[#ff0000] px-4 py-2 rounded-md hover:bg-[#351d1d] transition-colors"
              onClick={logout}
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/signin"
              className="relative bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
