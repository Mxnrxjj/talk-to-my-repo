import { z } from "zod";

export const createRepositorySchema = z.object({
  githubUrl: z.url(),
});
