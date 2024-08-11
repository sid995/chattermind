"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Chat = {
  msgId: string;
  title: string;
  createdAt: string;
};

export default function Sidebar() {
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

  return (
    <aside className="h-[calc(100vh-theme(spacing.16))] bg-muted w-64 border-r overflow-y-auto overflow-x-hidden">
      <nav className="flex flex-col h-full">
        <h3 className="p-4 text-lg font-medium mb-4">Previous Chats</h3>
        <div className="pr-2 pl-2 overflow-y-auto flex-1">
          {chats.map((chat) => (
            <div key={chat.msgId}>
              <Link
                href={`/chat/${chat.msgId}`}
                className="hover:bg-gray-200 hover:underline block rounded-md px-2 py-2"
              >
                {chat.title}
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
