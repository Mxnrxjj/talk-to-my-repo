-- CreateTable
CREATE TABLE "ChatMessageSource" (
    "id" TEXT NOT NULL,
    "chatMessageId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "startLine" INTEGER NOT NULL,
    "endLine" INTEGER NOT NULL,

    CONSTRAINT "ChatMessageSource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatMessageSource" ADD CONSTRAINT "ChatMessageSource_chatMessageId_fkey" FOREIGN KEY ("chatMessageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
