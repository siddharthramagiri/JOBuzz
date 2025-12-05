"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { token, phone, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure hydration is complete
    const timer = setTimeout(() => {
      if (!token) {
        router.replace("/signin");
      } else {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [token, router]);

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
            JoBuzz Dashboard
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
