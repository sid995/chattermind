"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NavbarProps {
  session: any;
}

export default function Navbar({ session }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      const result = await signIn("github", { callbackUrl: "/", forceNewSession: true });
      if (result?.error) {
        console.error("Sign-in error:", result.error);
      }
    } catch (error) {
      console.error("Sign-in exception:", error);
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="ml-2 text-xl font-semibold text-gray-900">ChatterMind</span>
          </div>
          <div>
            {session ? (
              <Button onClick={() => signOut()}>Sign out</Button>
            ) : (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button>Sign in</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                    <DialogDescription>
                      Choose a method to sign in to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4">
                    <Button onClick={handleSignIn} className="w-full">
                      Sign in with GitHub
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}