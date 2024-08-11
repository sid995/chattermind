"use client";

import { Button } from "../ui/button";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";

export const NewChatButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(`/chat/${uuid()}`)}
      className="text-black bg-white hover:bg-slate-100"
    >
      New Chat
    </Button>
  );
};
