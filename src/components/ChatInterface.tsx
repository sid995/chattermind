"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatList from "@/components/ChatList";
import MessageList from "@/components/MessageList";

interface Chat {
  _id: string;
  title: string;
}

interface Message {
  _id: string;
  content: string;
  role: "user" | "assistant";
}

export default function ChatInterface() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchChats();
    }
  }, [session]);

  const fetchChats = async () => {
    const response = await fetch("/api/chats");
    const data = await response.json();
    setChats(data);
  };

  const fetchMessages = async (chatId: string) => {
    const response = await fetch(`/api/messages?chatId=${chatId}`);
    const data = await response.json();
    setMessages(data);
    setSelectedChatId(chatId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !session) return;

    setMessages((prev) => [...prev, { _id: Date.now().toString(), role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          chatId: selectedChatId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { _id: Date.now().toString(), role: "assistant", content: data.response }]);
      setSelectedChatId(data.chatId);
      fetchChats();
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { _id: Date.now().toString(), role: "assistant", content: "Sorry, an error occurred. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="flex">
        <ChatList chats={chats} selectedChatId={selectedChatId} onChatSelect={fetchMessages} />
        <div className="w-3/4">
          <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
            <MessageList messages={messages} />
            <form onSubmit={handleSubmit} className="p-4 border-t flex">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow mr-2"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}