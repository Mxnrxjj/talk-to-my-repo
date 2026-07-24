-- CreateEnum
CREATE TYPE "RepositoryStatus" AS ENUM ('QUEUED', 'CLONING', 'PARSING', 'CHUNKING', 'EMBEDDING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "githubUrl" TEXT NOT NULL,
    "name" TEXT,
    "owner" TEXT,
    "branch" TEXT,
    "status" "RepositoryStatus" NOT NULL DEFAULT 'QUEUED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);
