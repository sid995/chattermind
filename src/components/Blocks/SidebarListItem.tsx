"use client";

import { MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useState } from "react";

type ListItemProps = {
  chat: {
    msgId: string;
    title: string;
    createdAt: string;
  };
  paramsMsgId: string | string[];
  handleDelete: (msgId: string) => void;
};

export const ListItem = ({
  chat,
  paramsMsgId,
  handleDelete,
}: ListItemProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="mb-2 group relative">
      <Link
        href={`/chat/${chat.msgId}`}
        className={`flex items-center px-3 py-2 rounded-md font-mono text-sm transition-colors ${
          paramsMsgId === chat.msgId
            ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
            : "hover:bg-gray-200"
        }`}
      >
        <span className="truncate pr-6">{chat.title}</span>
      </Link>
      <div
        className={`text-gray-400 hover:text-gray-200 p-2 absolute w-2 h-2 top-2 -translate-y-2 right-4 transition-opacity hover:opacity-100 ${
          openDropdown === chat.msgId || paramsMsgId === chat.msgId
            ? "opacity-100"
            : "opacity-50"
        }`}
      >
        <DropdownMenu
          open={openDropdown === chat.msgId}
          onOpenChange={(open: any) =>
            setOpenDropdown(open ? chat.msgId : null)
          }
        >
          <DropdownMenuTrigger asChild>
            <span className="cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="cursor-pointer text-black"
              onClick={() => handleDelete(chat.msgId)}
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
