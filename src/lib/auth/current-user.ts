import { auth } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors/unauthorized-error";

export async function getCurrentUserId(): Promise<string> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }

  return session.user.id;
}

export async function getOptionalCurrentUserId(): Promise<string | null> {
  const session = await auth();

  return session?.user?.id ?? null;
}
