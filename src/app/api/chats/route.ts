import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { createChatSchema } from "@/lib/validators/chat";
import { RepositoryService } from "@/services/repository.service";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { handleApiError } from "@/lib/api/handle-error";

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    const body = createChatSchema.parse(await request.json());

    // Never trust repositoryId from the client for ownership: verify the
    // repository exists and belongs to the current user before creating
    // a chat under it.
    await RepositoryService.requireOwned(userId, body.repositoryId);

    const chat = await db.chat.create({
      data: {
        repositoryId: body.repositoryId,
      },
    });

    return NextResponse.json(chat, {
      status: 201,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
