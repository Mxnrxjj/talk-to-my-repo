import { api } from "./client";

import type { ChatRequest, ChatResponse } from "@/types/chat";

export async function sendMessage(
  chatId: string,
  body: ChatRequest,
): Promise<ChatResponse> {
  return api<ChatResponse>(`/api/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function createChat(repositoryId: string) {
  return api<{ id: string }>("/api/chats", {
    method: "POST",
    body: JSON.stringify({
      repositoryId,
    }),
  });
}

export async function renameChat(chatId: string, title: string) {
  return api(`/api/chats/${chatId}`, {
    method: "PATCH",
    body: JSON.stringify({
      title,
    }),
  });
}

export async function deleteChat(chatId: string) {
  return api(`/api/chats/${chatId}`, {
    method: "DELETE",
  });
}

export async function sendMessageStream(
  chatId: string,
  body: ChatRequest,
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const response = await fetch(`/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  return response.body.getReader();
}
