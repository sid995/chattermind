'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function WelcomeScreen() {
  const router = useRouter();
  const routeChange = () => {
    router.push("/auth/signin")
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to AI Customer Support</h1>
      <p className="mb-4">Get instant help with our AI-powered support system.</p>
      <Button onClick={routeChange}>Sign in to get support</Button>
    </div>
  );
}