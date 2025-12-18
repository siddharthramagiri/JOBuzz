"use client";

import { useAuth } from "@/context/AuthContext";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Dashboard() {
  const { token, phone, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    async function validate() {
      try {
        if(!phone) { logout(); return; }

        const response = await fetch("/api/onboarding", {
          method: "GET",
          headers: { "x-phone": phone },
        })
        
        console.log(response);
        if (!response.ok) {
          console.error("Failed to fetch user:", response.statusText);
          router.replace("/onboarding");
          return;
        }
        const user = await response.json();
        if (!user || user.registered === false) {
          router.replace("/onboarding");
          return;
        }

        const res = await fetch(
          `${API_URL}/validate-token`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          logout();
          return;
        }
        if (isMounted) setIsLoading(false);
      } catch (error) {
        logout();
      }
    }

    validate();

    return () => {
      isMounted = false;
    };
  }, [token]);


  if (isLoading || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
        <div className="text-black dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            JOBuzz Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              +91 {phone}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You are successfully logged in with your phone number.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
              Authentication
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Phone OTP verified and ready to explore jobs.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
              Token Status
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
              {token.substring(0, 20)}...
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white dark:bg-zinc-900 p-8 rounded-lg shadow">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">
            Getting Started
          </h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li>✓ Phone number authentication with OTP</li>
            <li>✓ Secure token-based session</li>
            <li>✓ Protected routes with middleware</li>
            <li>✓ Ready to integrate job listings</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
