import { NextResponse } from "next/server";
import { RepositoryService } from "@/services/repository.service";
import { createRepositorySchema } from "@/lib/validators/repository";

export async function POST(request: Request) {
  const body = await request.json();

  const result = createRepositorySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 },
    );
  }

  const repository = await RepositoryService.create(result.data.githubUrl);

  return NextResponse.json(repository, { status: 201 });
}

export async function GET() {
  const repositories = await RepositoryService.getAll();

  return NextResponse.json(repositories);
}
