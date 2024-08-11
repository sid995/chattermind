"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MoreHorizontal, MoreVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { ListItem } from "./SidebarListItem";

type Chat = {
  msgId: string;
  title: string;
  createdAt: string;
};

export default function Sidebar() {
  const router = useRouter();
  const { msgId: paramsMsgId } = useParams();

  const [chats, setChats] = useState<Chat[]>([]);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/fetch-chats");
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }
      const data = await response.json();
      setChats(data.chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();

    const eventSource = new EventSource("/api/chat-updates");

    eventSource.onmessage = (event) => {
      const newChat = JSON.parse(event.data);
      setChats((prevChats) => {
        const updatedChats = [
          newChat,
          ...prevChats.filter((chat) => chat.msgId !== newChat.msgId),
        ];
        return updatedChats.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleDelete = async (msgId: string) => {
    try {
      const response = await fetch(`/api/delete-chat?msgId=${msgId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      setChats(chats.filter((chat) => chat.msgId !== msgId));

      // Check if the deleted chat is the current one
      if (paramsMsgId === msgId) {
        router.push(`/chat/${uuidv4()}`);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <aside className="h-[calc(100vh-theme(spacing.16))] bg-muted w-64 border-r overflow-y-auto overflow-x-hidden">
      <nav className="flex flex-col h-full">
        <h3 className="p-4 text-lg font-medium mb-4">Previous Chats</h3>
        <div className="pr-2 pl-2 overflow-y-auto flex-1">
          {chats.map((chat) => (
            <ListItem
              key={chat.msgId}
              chat={chat}
              paramsMsgId={paramsMsgId}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}
