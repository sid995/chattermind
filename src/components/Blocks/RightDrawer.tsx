"use client";

import React, { useState } from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { urls } from "../Context/url";
import UrlButton from "../Context/UrlButton";
import { crawlDocument } from "../Context/util";
import { Card, ICard } from "../Context/Card";

const RightDrawer = ({ selected }: { selected: string[] | null }) => {
  const [entries, setEntries] = useState(urls);
  const [cards, setCards] = useState<ICard[]>([]);

  const buttons = entries.map((entry, key) => (
    <div className="" key={`${key}-${entry.loading}`}>
      <UrlButton
        entry={entry}
        onClick={() =>
          crawlDocument(entry.url, setEntries, setCards, "markdown", 256, 1)
        }
      />
    </div>
  ));

  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60" />
        <Drawer.Title>Content</Drawer.Title>
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[600px] mt-0 fixed right-0 max-w-full">
          <div className="p-4 bg-white flex-1">
            <div className="max-w-md mx-auto">
              {buttons}

              {cards &&
                cards.map((card, key) => (
                  <Card key={key} card={card} selected={selected} />
                ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default RightDrawer;
