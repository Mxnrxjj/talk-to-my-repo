import { redirect } from "next/navigation";

import { getOptionalCurrentUserId } from "@/lib/auth/current-user";
import { signIn } from "@/lib/auth";

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const userId = await getOptionalCurrentUserId();

  if (userId) {
    redirect("/dashboard");
  }

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <span className="font-mono text-sm font-medium tracking-tight">
          talk-to-my-repo
        </span>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Understand any codebase.
        </h1>

        {error && (
          <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error === "OAuthAccountNotLinked"
              ? "That email is already linked to a different sign-in method."
              : "Sign-in failed. Please try again."}
          </p>
        )}

        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </main>
  );
}
