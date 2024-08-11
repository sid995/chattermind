"use client";

import React, { useState } from "react";
import { Drawer } from "vaul";
import { urls } from "../Context/url";
import UrlButton from "../Context/UrlButton";
import { clearIndex, crawlDocument } from "../Context/util";
import { Card, ICard } from "../Context/Card";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

const RightDrawer = ({ selected }: { selected: string[] | null }) => {
  const [entries, setEntries] = useState(urls);
  const [cards, setCards] = useState<ICard[]>([]);

  const buttons = entries.map((entry, key) => (
    <div key={`${key}-${entry.loading}`}>
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
              <div className="flex overflow-x-auto">
                {buttons}
                <Button
                  className="w-full my-2 uppercase active:scale-[98%] transition-transform duration-100"
                  style={{
                    backgroundColor: "#4f6574",
                    color: "white",
                  }}
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
  );
};

export default RightDrawer;
