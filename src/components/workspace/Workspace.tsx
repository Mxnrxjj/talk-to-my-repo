"use client";

import { Chat as PrismaChat } from "@prisma/client";
import { Repository } from "@/types/repository";

import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceSidebar from "./WorkspaceSidebar";
import { useState } from "react";

import { ChatSource } from "@/types/chat";
import Chat from "@/components/chat/Chat";
import CodeViewer from "./CodeViewer";
import RepositoryStructure from "./RepositoryStructure";

interface WorkspaceProps {
  repository: Repository;
  chats: PrismaChat[];
  activeChatId: string;

  messages: {
    id: string;
    role: string;
    content: string;
    sources: ChatSource[];
  }[];

  tree: any;

  view: "chat" | "structure";
}

export default function Workspace({
  repository,
  chats,
  activeChatId,
  messages,
  tree,
  view,
}: WorkspaceProps) {
  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    startLine: number;
    endLine: number;
  } | null>(null);

  return (
    <main className="flex h-screen flex-col bg-background">
      <WorkspaceHeader repository={repository} />

      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar
          repository={repository}
          chats={chats}
          activeChatId={activeChatId}
        />

        <section className="flex-1 bg-background">
          {view === "structure" ? (
            <RepositoryStructure tree={tree} />
          ) : (
            <div className="grid h-full grid-cols-[1fr_520px]">
              <Chat
                chatId={activeChatId}
                messages={messages}
                onSourceClick={(path, startLine, endLine) =>
                  setSelectedFile({
                    path,
                    startLine,
                    endLine,
                  })
                }
              />

              <CodeViewer repositoryId={repository.id} file={selectedFile} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
