import { redirect } from "next/navigation";

import { RepositoryService } from "@/services/repository.service";
import { getOptionalCurrentUserId } from "@/lib/auth/current-user";

import RepositoryList from "@/components/repository/RepositoryList";
import Navbar from "@/components/layout/Navbar";

export default async function DashboardPage() {
  const userId = await getOptionalCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const repositories = await RepositoryService.getAllWithCounts(userId);

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Repositories
          </h1>

          <p className="mt-3 text-muted-foreground">
            All repositories you&apos;ve indexed.
          </p>
        </div>

        <div className="mt-8">
          <RepositoryList repositories={repositories} />
        </div>
      </section>
    </main>
  );
}
