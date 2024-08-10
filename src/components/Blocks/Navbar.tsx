"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full h-16 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <NabvarIcon />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              ChatterMind
            </span>
          </div>
          <div>
            {false ? (
              <Button>Sign out</Button>
            ) : (
              <Link href="/signin" passHref>
                <Button>Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NabvarIcon() {
  return (
    <svg
      className="h-8 w-8 text-indigo-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>
  );
}