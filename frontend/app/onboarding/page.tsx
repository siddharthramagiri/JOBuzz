"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface UserData {
  name: string;
  interests: string[];
  preferred_locations: string[];
  experience_level: string;
  registered: Boolean;
}

const INTERESTS = [
  "Software Engineering",
  "Full Stack Development",
  "Software Development",
  "Data Engineering",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning",
  "AI ML",
  "Generative AI Developer",
  "Cloud Engineering",
  "DevOps",
  "Application Developer",
  "Support & Operations",
  "Management & Strategy",
];

const LOCATIONS = [
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Kolkata",
];

const EXPERIENCE_LEVELS = ["Intern", "Junior", "Mid", "Senior", "Lead"];

export default function OnboardingPage() {
  const [user, setUser] = useState<UserData>({
    name: "",
    interests: [],
    preferred_locations: [],
    experience_level: "",
    registered: false,
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  const phone = typeof window !== "undefined" ? localStorage.getItem("phone") : null;

  // Fetch user data on mount
  useEffect(() => {
    if (!phone) {
      router.replace("/signin");
      return;
    }

    fetch("/api/onboarding", {
      headers: { "x-phone": phone },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUser({
            name: data.name || "",
            interests: data.interests || [],
            preferred_locations: data.preferred_locations || [],
            experience_level: data.experience_level || "",
            registered: data.registered,
          });
        }
      })
      .finally(() => setInitialLoading(false));
  }, [phone, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, ...user }),
    });

    setLoading(false);
    router.replace("/dashboard");
  };

  const toggleSelection = (field: "interests" | "preferred_locations", value: string) => {
    setUser((prev) => {
      const current = prev[field];
      if (current.includes(value)) return { ...prev, [field]: current.filter((v) => v !== value) };
      return { ...prev, [field]: [...current, value] };
    });
  };

  // Check if all fields are filled
  const isFormComplete =
    user.name.trim() !== "" &&
    user.interests.length > 0 &&
    user.preferred_locations.length > 0 &&
    user.experience_level !== "";

  if (initialLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-6">
      <form
        onSubmit={handleSubmit}
        className=" p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6"
      >
        <h1 className="text-2xl font-bold text-black dark:text-white">Edit/ Complete Your Profile</h1>

        {/* Name */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
            className="w-full px-3 py-2 rounded-lg border dark:border-zinc-700 dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>


        {/* <div> */}
        {/* Interests */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button
              key={i}
              type="button"
              onClick={() => toggleSelection("interests", i)}
              className={`px-3 py-1 rounded-full border dark:border-zinc-700 ${
                user.interests.includes(i)
                ? "bg-black text-white dark:bg-zinc-700 dark:text-white"
                : "bg-gray-100 dark:bg-zinc-900 text-black dark:text-white"
                }`}
                >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Locations */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Preferred Locations</label>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((l) => (
              <button
              key={l}
              type="button"
              onClick={() => toggleSelection("preferred_locations", l)}
              className={`px-3 py-1 rounded-full border dark:border-zinc-400 ${
                user.preferred_locations.includes(l)
                ? "bg-black text-white dark:bg-zinc-400 dark:text-black"
                : "bg-gray-100 dark:bg-zinc-800 text-black dark:text-white"
                }`}
                >
                {l}
              </button>
            ))}
          </div>
        </div>
        {/* </div> */}

        {/* Experience Level */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Experience Level</label>
          <select
            value={user.experience_level}
            onChange={(e) => setUser({ ...user, experience_level: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border dark:border-zinc-700 dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            <option value="">Select Level</option>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormComplete || loading}
          className="w-full py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Complete Onboarding"}
        </button>
      </form>
    </div>
  );
}
