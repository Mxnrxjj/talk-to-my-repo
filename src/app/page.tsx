import { db } from "@/lib/db";
import RepositoryForm from "@/components/repository/RepositoryForm";
import RepositoryList from "@/components/repository/RepositoryList";

export default async function Home() {
  const repositories = await db.repository.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Talk to My Repo</h1>

      <RepositoryForm />

      <div className="mt-8">
        <RepositoryList repositories={repositories} />
      </div>
    </main>
  );
}
