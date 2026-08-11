import { RepositoryService } from "@/services/repository.service";

import RepositoryList from "@/components/repository/RepositoryList";
import Navbar from "@/components/layout/Navbar";

export default async function DashboardPage() {
  const repositories = await RepositoryService.getAllWithCounts();

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Repositories
          </h1>

          <p className="mt-3 text-muted-foreground">
            All repositories you've indexed.
          </p>
        </div>

        <div className="mt-8">
          <RepositoryList repositories={repositories} />
        </div>
      </section>
    </main>
  );
}
