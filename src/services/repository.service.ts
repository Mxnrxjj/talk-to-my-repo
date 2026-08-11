import { db } from "@/lib/db";
import { repositoryQueue } from "@/lib/queue";
import { RepositoryStatus } from "@prisma/client";

export class RepositoryService {
  static async create(githubUrl: string) {
    const repository = await db.repository.create({
      data: {
        githubUrl,
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

  static async getAll() {
    return db.repository.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getAllWithCounts() {
    return db.repository.findMany({
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
}
