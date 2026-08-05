import { Chat } from "@prisma/client";
import { Repository } from "@/types/repository";

import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceSidebar from "./WorkspaceSidebar";

interface WorkspaceProps {
  repository: Repository;
  chats: Chat[];
  activeChatId: string;
  children: React.ReactNode;
}

export default function Workspace({
  repository,
  chats,
  activeChatId,
  children,
}: WorkspaceProps) {
  return (
    <main className="flex h-screen flex-col bg-background">
      <WorkspaceHeader repository={repository} />

      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar
          repository={repository}
          chats={chats}
          activeChatId={activeChatId}
        />

        <section className="flex-1 bg-background">{children}</section>
      </div>
    </main>
  );
}
