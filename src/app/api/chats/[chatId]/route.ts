import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { ChatService } from "@/services/chat.service";
import { NotFoundError } from "@/lib/errors/not-found-error";

const updateChatSchema = z.object({
  title: z.string().trim().min(1).max(100),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params;

    const body = updateChatSchema.parse(await request.json());

    const chat = await ChatService.rename(chatId, body.title);

    return NextResponse.json(chat);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 404,
        },
      );
    }

    throw error;
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params;

    await ChatService.delete(chatId);

    return new NextResponse(null, {
      status: 204,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 404,
        },
      );
    }

    throw error;
  }
}
