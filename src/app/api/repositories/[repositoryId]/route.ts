import { NextRequest, NextResponse } from "next/server";

import { RepositoryService } from "@/services/repository.service";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { handleApiError } from "@/lib/api/handle-error";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ repositoryId: string }>;
  },
) {
  try {
    const userId = await getCurrentUserId();

    const { repositoryId } = await params;

    // Dashboard polling behavior. requireOwnedWithCounts returns 404 for
    // both "doesn't exist" and "belongs to someone else".
    const repository = await RepositoryService.requireOwnedWithCounts(
      userId,
      repositoryId,
    );

    return NextResponse.json(repository);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ repositoryId: string }> },
) {
  try {
    const userId = await getCurrentUserId();

    const { repositoryId } = await params;

    await RepositoryService.requireOwned(userId, repositoryId);

    await RepositoryService.delete(repositoryId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
