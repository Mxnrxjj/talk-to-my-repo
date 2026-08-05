export type RepositoryStatus =
  | "QUEUED"
  | "CLONING"
  | "PARSING"
  | "CHUNKING"
  | "EMBEDDING"
  | "READY"
  | "FAILED";

export interface Repository {
  id: string;
  githubUrl: string;
  name: string | null;
  owner: string | null;
  branch: string | null;

  status: RepositoryStatus;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRepositoryRequest {
  githubUrl: string;
}

export interface CreateRepositoryResponse extends Repository {}
