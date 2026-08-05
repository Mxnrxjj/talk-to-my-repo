import { z } from "zod";

export const createChatSchema = z.object({
  repositoryId: z.string().trim().min(1),
});

export const chatSchema = z.object({
  question: z.string().trim().min(1),
});
