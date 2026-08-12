import { db } from "@/lib/db";
import { repositoryQueue } from "@/lib/queue";
import { RepositoryStatus } from "@prisma/client";
import { NotFoundError } from "@/lib/errors/not-found-error";

export class RepositoryService {
  static async create(userId: string, githubUrl: string) {
    const repository = await db.repository.create({
      data: {
        githubUrl,
        userId,
      },
    });

    await repositoryQueue.add("index-repository", {
      repositoryId: repository.id,
    });

    return repository;
  }

  static async getById(id: string) {
    return db.repository.findUnique({
      where: {
        id,
      },
    });
  }

  static async getByIdWithCounts(id: string) {
    return db.repository.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            files: true,
            chunks: true,
          },
        },
      },
    });
  }

  static async getAll(userId: string) {
    return db.repository.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getAllWithCounts(userId: string) {
    return db.repository.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        _count: {
          select: {
            files: true,
            chunks: true,
          },
        },
      },
    });
  }

  static async updateStatus(id: string, status: RepositoryStatus) {
    return db.repository.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  static async delete(id: string) {
    return db.repository.delete({
      where: {
        id,
      },
    });
  }

  static async requireOwned(userId: string, repositoryId: string) {
    const repository = await db.repository.findUnique({
      where: {
        id: repositoryId,
      },
    });

    if (!repository || repository.userId !== userId) {
      throw new NotFoundError(`Repository ${repositoryId} not found`);
    }

    return repository;
  }

  static async requireOwnedWithCounts(userId: string, repositoryId: string) {
    const repository = await this.getByIdWithCounts(repositoryId);

    if (!repository || repository.userId !== userId) {
      throw new NotFoundError(`Repository ${repositoryId} not found`);
    }

    return repository;
  }
}
