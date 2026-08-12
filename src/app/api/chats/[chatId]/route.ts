import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ChatService } from "@/services/chat.service";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { handleApiError } from "@/lib/api/handle-error";

const updateChatSchema = z.object({
  title: z.string().trim().min(1).max(100),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const userId = await getCurrentUserId();

    const { chatId } = await params;

    const body = updateChatSchema.parse(await request.json());

    await ChatService.requireOwned(userId, chatId);

    const chat = await ChatService.rename(chatId, body.title);

    return NextResponse.json(chat);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const userId = await getCurrentUserId();

    const { chatId } = await params;

    await ChatService.requireOwned(userId, chatId);

    await ChatService.delete(chatId);

    return new NextResponse(null, {
      status: 204,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
