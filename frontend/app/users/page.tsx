export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";



export default async function Home() {
  let users: Array<{
    id: number;
    phone_number: string;
    name: string | null;
    registered: boolean;
    interests: string[];
    preferred_locations: string[];
    experience_level: string | null;
  }> = [];
  let error: string | null = null;

  try {
    users = await prisma.user.findMany({
      orderBy: { id: "desc" },
    });
  } catch (e) {
    console.error("Error fetching users:", e);
    error = "Failed to load users. Make sure your DATABASE_URL is configured.";
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users from Database</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : users.length === 0 ? (
        <p>No users yet.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="border p-4 rounded">
              <p className="font-semibold">{user.name || "No name"}</p>
              <p className="text-sm text-gray-600">{user.phone_number}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}