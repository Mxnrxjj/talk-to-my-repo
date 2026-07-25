-- CreateTable
CREATE TABLE "RepositoryChunk" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "startLine" INTEGER NOT NULL,
    "endLine" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepositoryChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RepositoryChunk_repositoryId_idx" ON "RepositoryChunk"("repositoryId");

-- AddForeignKey
ALTER TABLE "RepositoryChunk" ADD CONSTRAINT "RepositoryChunk_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
