"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendIcon } from "lucide-react";
import RightDrawer from "./RightDrawer";
import { useSession } from "next-auth/react";

export default function ChatWindow() {
  const { data: session } = useSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      onFinish: async () => {
        setGotMessages(true);
        await saveMessagesToDb();
      },
    });

  const prevMessagesLengthRef = useRef(messages.length);

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
  };

  const saveMessagesToDb = async () => {
    console.log(session);
    if (!session?.user?.id) return;

    try {
      const newMessages = messages.slice(prevMessagesLengthRef.current);
      await fetch("/api/save-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          messages: newMessages,
        }),
      });
      prevMessagesLengthRef.current = messages.length;
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  };

  useEffect(() => {
    const getContext = async () => {
      const response = await fetch("/api/context", {
        method: "POST",
        body: JSON.stringify({
          messages,
        }),
      });
      const { context } = await response.json();
      setContext(context.map((c: any) => c.id));
    };
    if (gotMessages && messages.length >= prevMessagesLengthRef.current) {
      getContext();
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, gotMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative h-[calc(100vh-theme(spacing.28))] pt-12 flex flex-col max-w-3xl w-full mx-auto">
      <RightDrawer selected={context} />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.role === "system"
                  ? "bg-blue-100"
                  : message.role === "user"
                  ? "bg-gray-100"
                  : "bg-green-100"
              }`}
            >
              <div className="font-bold">
                {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
              </div>
              <div>{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form
        onSubmit={handleMessageSubmit}
        className="mt-4 flex items-center gap-2"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          <SendIcon className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
