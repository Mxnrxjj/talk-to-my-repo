import Link from "next/link";
import { ExternalLink } from "lucide-react";

import ThemeToggle from "./ThemeToggle";

const REPO_URL = "https://github.com/Mxnrxjj/talk-to-my-repo";

export default function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-sm font-medium tracking-tight">
            talk-to-my-repo
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            Dashboard
          </Link>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            GitHub
          </a>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
