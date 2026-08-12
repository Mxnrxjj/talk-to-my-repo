import { notFound, redirect } from "next/navigation";

import { ChatService } from "@/services/chat.service";
import { RepositoryService } from "@/services/repository.service";
import { FileTreeService } from "@/services/file-tree.service";
import { getOptionalCurrentUserId } from "@/lib/auth/current-user";

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
  const userId = await getOptionalCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const { repositoryId } = await params;
  const { chat: chatId } = await searchParams;

  const repository = await RepositoryService.getById(repositoryId);

  // 404 (not 403) whether the repository doesn't exist or belongs to
  // someone else, so repository existence isn't exposed to other users.
  if (!repository || repository.userId !== userId) {
    notFound();
  }

  let chats = await ChatService.getByRepository(repository.id);

  if (chats.length === 0) {
    await ChatService.create(repository.id);
    chats = await ChatService.getByRepository(repository.id);
  }

  const activeChat = chats.find((chat) => chat.id === chatId) ?? chats[0];

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
