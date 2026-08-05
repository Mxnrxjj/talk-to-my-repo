interface RepositoryTreeProps {
  tree: string;
}

export default function RepositoryTree({ tree }: RepositoryTreeProps) {
  return (
    <div className="h-full overflow-auto p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Repository Structure</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          A high-level overview of the indexed repository.
        </p>
      </div>

      <pre className="mt-8 overflow-auto rounded-3xl border border-border/60 bg-muted/20 p-8 font-mono text-[13px] leading-7 text-muted-foreground shadow-sm">
        {tree}
      </pre>
    </div>
  );
}
