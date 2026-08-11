import { NextRequest, NextResponse } from "next/server";

import { RepositoryFileService } from "@/services/repository-file.service";
import { RepositoryService } from "@/services/repository.service";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ repositoryId: string }>;
  },
) {
  const { repositoryId } = await params;

  // Dashboard polling behavior
  const repository = await RepositoryService.getByIdWithCounts(repositoryId);

  if (!repository) {
    return NextResponse.json(
      { error: "Repository not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(repository);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ repositoryId: string }> },
) {
  const { repositoryId } = await params;

  const repository = await RepositoryService.getById(repositoryId);

  if (!repository) {
    return NextResponse.json(
      { error: "Repository not found." },
      { status: 404 },
    );
  }

  await RepositoryService.delete(repositoryId);

  return new NextResponse(null, { status: 204 });
}
