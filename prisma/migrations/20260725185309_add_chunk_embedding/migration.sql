-- AlterTable
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "RepositoryChunk" ADD COLUMN     "embedding" vector(1536);
