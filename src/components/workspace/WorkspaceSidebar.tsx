"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Chat } from "@prisma/client";
import {
  MoreHorizontal,
  FolderTree,
  Loader2,
  MessageSquarePlus,
} from "lucide-react";
import { useState } from "react";

import { Repository } from "@/types/repository";
import { createChat } from "@/api/chats";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { renameChat, deleteChat } from "@/api/chats";

interface WorkspaceSidebarProps {
  repository: Repository;
  chats: Chat[];
  activeChatId: string;
}

export default function WorkspaceSidebar({
  repository,
  chats,
  activeChatId,
}: WorkspaceSidebarProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  async function handleNewConversation() {
    try {
      setCreating(true);

      const chat = await createChat(repository.id);

      router.push(`/workspace/${repository.id}?chat=${chat.id}`);

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(chatId: string) {
    const remaining = chats.filter((c) => c.id !== chatId);

    await deleteChat(chatId);

    if (chatId === activeChatId) {
      if (remaining.length > 0) {
        router.replace(`/workspace/${repository.id}?chat=${remaining[0].id}`);
      } else {
        router.replace(`/workspace/${repository.id}`);
      }

      return;
    }

    router.refresh();
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-muted/20">
      <div className="border-b p-4">
        <Button
          className="w-full justify-start gap-2"
          disabled={creating}
          onClick={handleNewConversation}
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageSquarePlus className="h-4 w-4" />
          )}

          {creating ? "Creating..." : "New Conversation"}
        </Button>
      </div>

      <section className="flex-1 overflow-y-auto p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Conversations
        </h2>

        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center rounded-lg transition",
                chat.id === activeChatId
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {renamingId === chat.id ? (
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={async () => {
                    if (title.trim()) {
                      await renameChat(chat.id, title);
                      router.refresh();
                    }
                    setRenamingId(null);
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      if (title.trim()) {
                        await renameChat(chat.id, title);
                        router.refresh();
                      }
                      setRenamingId(null);
                    }

                    if (e.key === "Escape") {
                      setRenamingId(null);
                    }
                  }}
                  className="mx-2 flex-1 rounded bg-transparent px-2 py-1 text-sm outline-none"
                />
              ) : (
                <Link
                  href={`/workspace/${repository.id}?chat=${chat.id}`}
                  className="flex-1 truncate px-3 py-2 text-sm"
                >
                  {chat.title}
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "mr-1 inline-flex h-7 w-7 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted",
                    chat.id === activeChatId && "opacity-100",
                  )}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setRenamingId(chat.id);
                      setTitle(chat.title);
                    }}
                  >
                    Rename
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => handleDelete(chat.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t p-4">
        <div className="mb-3 flex items-center gap-2">
          <FolderTree className="h-4 w-4" />

          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Repository
          </h2>
        </div>

        <Link
          href={`/workspace/${repository.id}?view=structure`}
          className="block rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
        >
          🌳 Repository Structure
        </Link>
      </section>
    </aside>
  );
}
