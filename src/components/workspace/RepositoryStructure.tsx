interface RepositoryStructureProps {
  tree: string;
}

export default function RepositoryStructure({
  tree,
}: RepositoryStructureProps) {
  return (
    <div className="mx-auto max-w-6xl px-12 py-10">
      <h1 className="text-3xl font-semibold">
        A bird's-eye view of the indexed codebase.
      </h1>

      <p className="mt-2 text-muted-foreground">
        A high-level overview of the repository.
      </p>

      <pre className="mt-8 overflow-auto rounded-2xl border bg-muted/20 p-8 font-mono text-sm leading-6">
        {tree}
      </pre>
    </div>
  );
}
