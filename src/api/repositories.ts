import { api } from "./client";
import type {
  CreateRepositoryRequest,
  CreateRepositoryResponse,
  Repository,
} from "@/types/repository";

export async function createRepository(
  body: CreateRepositoryRequest,
): Promise<CreateRepositoryResponse> {
  return api<CreateRepositoryResponse>("/api/repositories", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getRepositories(): Promise<Repository[]> {
  return api<Repository[]>("/api/repositories");
}

export async function getRepository(repositoryId: string): Promise<Repository> {
  return api<Repository>(`/api/repositories/${repositoryId}`);
}

export async function deleteRepository(repositoryId: string): Promise<void> {
  return api<void>(`/api/repositories/${repositoryId}`, {
    method: "DELETE",
  });
}

export async function getRepositoryFile(repositoryId: string, path: string) {
  return api<{
    path: string;
    content: string;
  }>(
    `/api/repositories/${repositoryId}/files?path=${encodeURIComponent(path)}`,
  );
}
