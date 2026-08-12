import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { NotFoundError } from "@/lib/errors/not-found-error";
import { UnauthorizedError } from "@/lib/errors/unauthorized-error";
import { RateLimitError } from "@/lib/errors/rate-limit-error";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.flatten() }, { status: 400 });
  }

  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  if (error instanceof RateLimitError) {
    return NextResponse.json({ error: error.message }, { status: 429 });
  }

  console.error(error);

  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}
