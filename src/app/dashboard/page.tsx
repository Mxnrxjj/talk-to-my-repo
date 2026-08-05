import { db } from "@/lib/db";

import RepositoryList from "@/components/repository/RepositoryList";

export default async function DashboardPage() {
  const repositories = await db.repository.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-semibold tracking-tight">
            Repositories
          </h1>

          <p className="mt-3 text-muted-foreground">
            All repositories you've indexed.
          </p>
        </div>

        <RepositoryList repositories={repositories} />
      </section>
    </main>
  );
}
