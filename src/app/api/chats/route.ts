import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { db } from "@/lib/db";
import { createChatSchema } from "@/lib/validators/chat";

export async function POST(request: NextRequest) {
  try {
    const body = createChatSchema.parse(await request.json());

    const repository = await db.repository.findUnique({
      where: {
        id: body.repositoryId,
      },
    });

    if (!repository) {
      return NextResponse.json(
        {
          error: "Repository not found",
        },
        {
          status: 404,
        },
      );
    }

    const chat = await db.chat.create({
      data: {
        repositoryId: body.repositoryId,
      },
    });

    return NextResponse.json(chat, {
      status: 201,
    });
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

    throw error;
  }
}
