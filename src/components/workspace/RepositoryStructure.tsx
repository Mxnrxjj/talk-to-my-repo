interface RepositoryStructureProps {
  tree: string;
  onClose: () => void;
}

import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

export default function RepositoryStructure({
  tree,
  onClose,
}: RepositoryStructureProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(tree);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
  return (
    <div className="flex h-full min-h-0 flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Repository Structure</p>

          <p className="text-xs text-muted-foreground">
            High-level overview of the indexed repository
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-muted"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="rounded-md p-2 transition hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <pre className="p-6 font-mono text-sm leading-6">{tree}</pre>
      </div>
    </div>
  );
}
