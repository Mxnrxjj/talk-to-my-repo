import { NextRequest, NextResponse } from "next/server";

import { RepositoryFileService } from "@/services/repository-file.service";
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

    // Ensures the repository exists and belongs to the current user before
    // any file within it can be read.
    await RepositoryService.requireOwned(userId, repositoryId);

    const path = request.nextUrl.searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Missing path." }, { status: 400 });
    }

    const file = await RepositoryFileService.get(repositoryId, path);

    if (!file) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    return NextResponse.json(file);
  } catch (error) {
    return handleApiError(error);
  }
}
