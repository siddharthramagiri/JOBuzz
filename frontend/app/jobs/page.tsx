export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";

export default async function JobsPage() {
  let jobs: Array<{
    id: number;
    title: string;
    company: string;
    location: string | null;
    experience: string | null;
    url: string | null;
    description: string | null;
    date_scraped: Date | null;
  }> = [];
  let error: string | null = null;

  try {
    jobs = await prisma.jobs.findMany({
      orderBy: { id: "desc" },
    });
  } catch (e) {
    console.error("Error fetching jobs:", e);
    error = "Failed to load jobs. Make sure your DATABASE_URL is configured.";
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Jobs from Database</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="border p-4 rounded">
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm text-gray-600">{job.company}</p>
              {job.location && <p className="text-sm text-gray-500">Location: {job.location}</p>}
              {job.experience && <p className="text-sm text-gray-500">Experience: {job.experience}</p>}
              {job.url && (
                <p className="text-sm text-blue-600">
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    Job Link
                  </a>
                </p>
              )}
              {job.description && <p className="text-sm mt-2">{job.description}</p>}
              {job.date_scraped && (
                <p className="text-xs text-gray-400 mt-1">
                  Scraped on: {job.date_scraped.toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
