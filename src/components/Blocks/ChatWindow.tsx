"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendIcon } from "lucide-react";
import RightDrawer from "./RightDrawer";
import { useParams } from "next/navigation";
import { Message } from "./Message";

export default function ChatWindow() {
  const { msgId } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [shouldGenerateTitle, setShouldGenerateTitle] = useState(false);
  const [shouldSaveMessages, setShouldSaveMessages] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    onFinish: async () => {
      setShouldSaveMessages(true);
      !shouldGenerateTitle && setShouldGenerateTitle(true);
    },
  });

  const prevMessagesLengthRef = useRef(messages.length);

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
  };

  // Save messages to database
  useEffect(() => {
    if (shouldSaveMessages && title) {
      saveMessagesToDb();
      setShouldSaveMessages(false);
    }
  }, [title, shouldSaveMessages]);

  // Generate title
  useEffect(() => {
    if (shouldGenerateTitle && !title) {
      generateTitle();
    }
  }, [shouldGenerateTitle, title]);

  // Fetch old messages when component mounts or msgId changes
  useEffect(() => {
    if (msgId) {
      fetchOldMessages();
    }
  }, [msgId]);

  const fetchOldMessages = async () => {
    try {
      const response = await fetch(`/api/fetch-messages?msgId=${msgId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch old messages");
      }

      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
        setTitle(data.title || null);
      }
    } catch (error) {
      console.error("Error fetching old messages:", error);
    }
  };

  const generateTitle = async () => {
    try {
      const response = await fetch("/api/generate-title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate title");
      }

      const { title } = await response.json();
      setTitle(title);
    } catch (error) {
      console.error("Error generating title:", error);
    }
  };

  const saveMessagesToDb = async () => {
    try {
      const messagesToSave = messages.map((message) => ({
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
      }));

      const response = await fetch("/api/save-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToSave,
          title,
          msgId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save messages: ${errorData.error}`);
      }
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
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <RightDrawer selected={context} />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message: any) => (
            <Message message={message} key={message?.id || message?._id} />
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
