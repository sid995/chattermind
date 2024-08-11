"use client";

import React, { useState, useEffect } from "react";
import { urls } from "../Context/url";
import { clearIndex, crawlDocument } from "../Context/util";
import { Card, ICard } from "../Context/Card";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Drawer } from "vaul";

const shimmerStyles = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.5) 50%,
    rgba(255,255,255,0) 100%
  );
  background-size: 200% 100%;
  position: relative;
}

.shimmer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  filter: blur(5px);
}
`;

const RightDrawer = ({ selected }: { selected: string[] | null }) => {
  const [entries, setEntries] = useState(urls);
  const [cards, setCards] = useState<ICard[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading placeholder
  }

  return (
    <>
      <style>{shimmerStyles}</style>
      <Drawer.Root direction="right">
        <Drawer.Trigger className="fixed top-24 right-10">
          <span className="border-solid border-2 border-[#e5e7eb] block w-auto h-auto p-1 relative rounded">
            <Menu className="w-5 h-5" />
          </span>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/60" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[600px] mt-0 fixed right-0 max-w-full">
            <Drawer.Title className="pt-4 px-4 text-2xl">
              Select context below
            </Drawer.Title>
            <div className="p-4 bg-white flex-1">
              <div className="flex flex-col flex-1">
                <div className="flex overflow-x-auto space-x-2 mb-4 pb-2">
                  {entries.map((entry, key) => (
                    <Button
                      key={`${key}-${entry.loading}`}
                      variant={entry.seeded ? "default" : "ghost"}
                      className={cn(
                        "px-3 py-2 rounded-md font-mono text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300",
                        entry.seeded
                          ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                          : "hover:bg-gray-200",
                        entry.loading && "shimmer"
                      )}
                      onClick={() =>
                        crawlDocument(
                          entry.url,
                          setEntries,
                          setCards,
                          "markdown",
                          256,
                          1
                        )
                      }
                      disabled={entry.loading}
                    >
                      {entry.title}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="px-3 py-2 rounded-md font-mono text-sm transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => clearIndex(setEntries, setCards)}
                  >
                    Clear Index
                  </Button>
                </div>
                <div className="mt-3 h-[calc(100vh-theme(spacing.40))] overflow-x-hidden overflow-y-auto">
                  {cards &&
                    cards.map((card, key) => (
                      <Card key={key} card={card} selected={selected} />
                    ))}
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};

export default RightDrawer;
