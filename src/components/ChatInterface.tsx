"use client";

import { useState, useEffect, useMemo } from "react";
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

interface ChatInterfaceProps {
  session: any;
}

export default function ChatInterface({ session }: ChatInterfaceProps) {
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
    if (!session) return;
    const response = await fetch("/api/chats");
    const data = await response.json();
    setChats(data);
  };

  const fetchMessages = async (chatId: string) => {
    if (!session) return;
    const response = await fetch(`/api/messages?chatId=${chatId}`);
    const data = await response.json();
    setMessages(data);
    setSelectedChatId(chatId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setMessages((prev) => [...prev, { _id: Date.now().toString(), role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      let response;
      if (session) {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
            chatId: selectedChatId,
          }),
        });
      } else {
        // If not authenticated, use a different endpoint that doesn't save the chat
        response = await fetch("/api/chat-anonymous", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { _id: Date.now().toString(), role: "assistant", content: data.response }]);
      if (session) {
        setSelectedChatId(data.chatId);
        fetchChats();
      }
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

  const showPreviousChats = useMemo(() => {
    return chats.length > 0 && session
  }, [chats, session])

  return (
    <div className="w-full max-w-5xl">
      <div className="flex">
        {showPreviousChats && (
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onChatSelect={fetchMessages}
          />
        )}
        <div className={showPreviousChats ? "w-3/4" : "w-full"}>
          <div className="bg-white shadow-md rounded-lg max-w-2xl w-full mx-auto">
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