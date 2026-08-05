import RepositoryForm from "@/components/repository/RepositoryForm";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
          AI-powered repository intelligence
        </p>

        <h1 className="mt-6 text-6xl font-semibold tracking-tight">
          Talk to My Repo
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Understand any GitHub repository using semantic search, embeddings and
          AI.
        </p>

        <div className="mt-12 w-full">
          <RepositoryForm />
        </div>
      </section>
    </main>
  );
}
