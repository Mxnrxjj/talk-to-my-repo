interface AsciiTreeProps {
  tree: string;
}

export default function AsciiTree({ tree }: AsciiTreeProps) {
  return (
    <pre className="mt-4 overflow-auto rounded-lg border bg-muted/20 p-4 text-xs leading-6 text-muted-foreground">
      {tree}
    </pre>
  );
}
