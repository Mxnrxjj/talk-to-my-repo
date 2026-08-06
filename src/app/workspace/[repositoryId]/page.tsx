import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { ChatService } from "@/services/chat.service";
import { FileTreeService } from "@/services/file-tree.service";

import Workspace from "@/components/workspace/Workspace";

interface WorkspacePageProps {
  params: Promise<{
    repositoryId: string;
  }>;
  searchParams: Promise<{
    chat?: string;
  }>;
}

export default async function WorkspacePage({
  params,
  searchParams,
}: WorkspacePageProps) {
  const { repositoryId } = await params;
  const { chat: chatId } = await searchParams;

  const repository = await db.repository.findUnique({
    where: {
      id: repositoryId,
    },
  });

  if (!repository) {
    notFound();
  }

  let chats = await ChatService.getByRepository(repository.id);

  if (chats.length === 0) {
    await ChatService.create(repository.id);
    chats = await ChatService.getByRepository(repository.id);
  }

  let activeChat = chats.find((chat) => chat.id === chatId) ?? chats[0];

  if (!activeChat) {
    notFound();
  }

  const tree = await FileTreeService.get(repository.id);

  return (
    <Workspace
      repository={repository}
      chats={chats}
      activeChatId={activeChat.id}
      messages={activeChat.messages}
      tree={tree}
    />
  );
}
