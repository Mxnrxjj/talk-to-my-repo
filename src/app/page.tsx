import Link from "next/link";
import {
  ArrowRight,
  Database,
  ExternalLink,
  FileCode,
  GitBranch,
  MessageSquareCode,
  Network,
  Search,
  Zap,
} from "lucide-react";

import RepositoryForm from "@/components/repository/RepositoryForm";
import Navbar from "@/components/layout/Navbar";

const REPO_URL = "https://github.com/Mxnrxjj/talk-to-my-repo";

const PIPELINE = [
  {
    label: "GitHub Repository",
    detail: "A public repo URL is all it takes.",
    dot: "bg-zinc-400",
  },
  {
    label: "Semantic Indexing",
    detail: "Clone → parse → chunk → embed with Voyage AI.",
    dot: "bg-blue-500",
  },
  {
    label: "Relevant Code Retrieval",
    detail: "pgvector similarity search over indexed chunks.",
    dot: "bg-purple-500",
  },
  {
    label: "Grounded AI Answer",
    detail: "Gemini answers from retrieved context, streamed live.",
    dot: "bg-orange-500",
  },
  {
    label: "Source References",
    detail: "Every answer links back to the exact files and lines.",
    dot: "bg-emerald-500",
  },
];

const EXAMPLE_QUESTIONS = [
  "Where is authentication implemented?",
  "How does repository indexing work?",
  "Where is repository cleanup performed?",
  "Explain the request lifecycle.",
  "What happens when a repository is indexed?",
];

const TECHNICAL_HIGHLIGHTS = [
  {
    icon: Network,
    label: "Voyage AI embeddings",
    detail: "1024-dimension embeddings for semantic code search.",
  },
  {
    icon: Database,
    label: "PostgreSQL + pgvector",
    detail: "Files, chunks and vectors live in one database.",
  },
  {
    icon: MessageSquareCode,
    label: "Gemini",
    detail: "Generates answers grounded in retrieved code.",
  },
  {
    icon: GitBranch,
    label: "BullMQ",
    detail: "Indexing runs as an async, queued background job.",
  },
  {
    icon: Zap,
    label: "Streaming responses",
    detail: "Answers stream to the chat as they're generated.",
  },
  {
    icon: FileCode,
    label: "Source-aware citations",
    detail: "Responses cite the files and line ranges they used.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section
        id="try"
        className="mx-auto flex max-w-3xl scroll-mt-16 flex-col items-center px-6 py-28 text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Semantic code search · grounded answers
        </p>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
          Understand any codebase.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          Ask questions about unfamiliar repositories and get grounded answers
          with direct source references.
        </p>

        <div className="mt-12 w-full max-w-xl">
          <RepositoryForm />
        </div>

        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          View on GitHub
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </section>

      {/* How It Works */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            How it works
          </h2>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Every answer is traced back through this pipeline.
          </p>

          <ol className="mt-12 space-y-0">
            {PIPELINE.map((step, index) => (
              <li
                key={step.label}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                {index < PIPELINE.length - 1 && (
                  <span className="absolute top-4 left-[5px] h-full w-px bg-border" />
                )}

                <span
                  className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${step.dot}`}
                />

                <div>
                  <p className="font-mono text-sm font-medium">{step.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Example Questions */}
      <section className="border-t">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            Ask things a new teammate would ask
          </h2>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Questions are answered from the actual indexed source, not general
            knowledge.
          </p>

          <div className="mt-10 space-y-2">
            {EXAMPLE_QUESTIONS.map((question) => (
              <div
                key={question}
                className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3"
              >
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="font-mono text-sm">{question}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            The workspace
          </h2>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Conversations, source citations, and repository structure in one
            place.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="flex items-center gap-1.5 border-b px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                workspace/vercel-next.js
              </span>
            </div>

            <div className="flex h-72">
              <div className="hidden w-48 shrink-0 flex-col gap-1 border-r p-3 sm:flex">
                <div className="rounded-md bg-primary/10 px-2.5 py-1.5 text-xs font-medium">
                  New Conversation
                </div>
                <div className="rounded-md px-2.5 py-1.5 text-xs text-muted-foreground">
                  Auth middleware
                </div>
                <div className="rounded-md px-2.5 py-1.5 text-xs text-muted-foreground">
                  Build pipeline
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-end gap-2 p-4">
                <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-xs text-muted-foreground">
                  Where is authentication implemented?
                </div>

                <div className="max-w-[90%] self-start space-y-1.5 rounded-2xl rounded-bl-sm border bg-background px-3 py-2 text-xs">
                  <p className="text-muted-foreground">
                    Authentication is handled in the middleware layer, which
                    validates the session before requests reach protected
                    routes.
                  </p>
                  <p className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                    <FileCode className="h-3 w-3" />
                    middleware.ts:12-34
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Highlights */}
      <section className="border-t">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            Built on
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TECHNICAL_HIGHLIGHTS.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="rounded-xl border bg-card p-4">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">{label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Exists */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Why it exists
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Getting oriented in an unfamiliar repository usually means grepping
            around, reading files that turn out to be unrelated, and piecing
            together how things fit together by hand. TalkToMyRepo indexes a
            repository once and lets you ask direct questions about it, answered
            from the code that&apos;s actually there and backed by the exact
            files and lines it came from.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Start exploring a repository.
          </h2>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="#try"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"
            >
              Try TalkToMyRepo
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              View on GitHub
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
