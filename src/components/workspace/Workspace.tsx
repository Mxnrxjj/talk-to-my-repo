"use client";

import { Chat as PrismaChat } from "@prisma/client";
import { Repository } from "@/types/repository";

import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceSidebar from "./WorkspaceSidebar";
import { useEffect, useState } from "react";

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
}

export default function Workspace({
  repository,
  chats,
  activeChatId,
  messages,
  tree,
}: WorkspaceProps) {
  const PANEL_TRANSITION_MS = 300;

  const [showStructure, setShowStructure] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    startLine: number;
    endLine: number;
  } | null>(null);

  const [panelFile, setPanelFile] = useState<typeof selectedFile>(null);

  useEffect(() => {
    if (selectedFile) {
      setPanelFile(selectedFile);
      return;
    }

    if (panelFile) {
      const timeout = setTimeout(() => setPanelFile(null), PANEL_TRANSITION_MS);
      return () => clearTimeout(timeout);
    }
  }, [selectedFile, panelFile]);

  return (
    <main className="flex h-screen flex-col bg-background">
      <WorkspaceHeader repository={repository} />

      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar
          repository={repository}
          chats={chats}
          activeChatId={activeChatId}
          onShowStructure={() => {
            setSelectedFile(null);
            setShowStructure(true);
          }}
        />

        <section className="flex h-full min-h-0 flex-1 bg-background">
          <div className="flex h-full min-h-0 flex-1 overflow-hidden">
            <div className="h-full min-h-0 flex-1">
              <Chat
                chatId={activeChatId}
                messages={messages}
                onSourceClick={(path, startLine, endLine) => {
                  setShowStructure(false);

                  setSelectedFile({
                    path,
                    startLine,
                    endLine,
                  });
                }}
              />
            </div>

            <div
              className={`h-full min-h-0 shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${
                panelFile || showStructure ? "w-[520px]" : "w-0"
              }`}
            >
              <div className="h-full w-[520px]">
                {panelFile ? (
                  <CodeViewer
                    repositoryId={repository.id}
                    file={panelFile}
                    onClose={() => setSelectedFile(null)}
                  />
                ) : showStructure ? (
                  <RepositoryStructure
                    tree={tree}
                    onClose={() => setShowStructure(false)}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
