import { db } from "@/lib/db";

export class RepositoryFileService {
  static async get(repositoryId: string, path: string) {
    return db.repositoryFile.findUnique({
      where: {
        repositoryId_path: {
          repositoryId,
          path,
        },
      },
    });
  }

  static async replaceForRepository(
    repositoryId: string,
    files: { path: string; content: string }[],
  ) {
    await db.$transaction([
      db.repositoryFile.deleteMany({
        where: {
          repositoryId,
        },
      }),

      db.repositoryFile.createMany({
        data: files.map((file) => ({
          repositoryId,
          path: file.path,
          content: file.content,
        })),
      }),
    ]);
  }
}
