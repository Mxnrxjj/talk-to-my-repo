import { NextRequest, NextResponse } from "next/server";

import { RepositoryFileService } from "@/services/repository-file.service";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ repositoryId: string }>;
  },
) {
  const { repositoryId } = await params;

  const path = request.nextUrl.searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path." }, { status: 400 });
  }

  const file = await RepositoryFileService.get(repositoryId, path);

  if (!file) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  return NextResponse.json(file);
}
