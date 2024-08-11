import Navbar from "@/components/Blocks/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomeScreen() {
  return (
    <>
      <Navbar />
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to AI Customer Support
        </h1>
        <p className="mb-4">
          Get instant help with our AI-powered support system.
        </p>
        <Link href="/auth/signin">
          <Button>Sign in to get support</Button>
        </Link>
      </div>
    </>
  );
}
