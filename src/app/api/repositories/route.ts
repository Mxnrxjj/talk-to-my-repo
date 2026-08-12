import { NextResponse } from "next/server";

import { RepositoryService } from "@/services/repository.service";
import { createRepositorySchema } from "@/lib/validators/repository";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { handleApiError } from "@/lib/api/handle-error";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    const body = await request.json();

    const result = createRepositorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 },
      );
    }

    const repository = await RepositoryService.create(
      userId,
      result.data.githubUrl,
    );

    return NextResponse.json(repository, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    const repositories = await RepositoryService.getAllWithCounts(userId);

    return NextResponse.json(repositories);
  } catch (error) {
    return handleApiError(error);
  }
}
