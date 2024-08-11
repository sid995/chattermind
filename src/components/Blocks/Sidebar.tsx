"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="bg-muted w-64 border-r h-full overflow-y-auto overflow-x-hidden">
      <nav className="p-4">
        <h3 className="text-lg font-medium mb-4">Previous Chats</h3>
        <ul className="space-y-2">
          {[1, 2, 3, 4, 5].map((chatNum) => (
            <li key={chatNum}>
              <Link
                href="#"
                className="block hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2"
              >
                Chat #{chatNum}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
