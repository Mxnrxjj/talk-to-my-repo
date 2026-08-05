import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { NotFoundError } from "@/lib/errors/not-found-error";

import { ChatService } from "@/services/chat.service";
import { chatSchema } from "@/lib/validators/chat";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params;

    const body = chatSchema.parse(await request.json());

    const response = await ChatService.answer(chatId, body.question);

    return NextResponse.json(response);
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
