import Navbar from "@/components/Blocks/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomeScreen() {
  return (
    <>
      <Navbar />
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to AI Powered Context Parser
        </h1>
        <p className="mb-4 max-w-lg text-center">
          This is an example of an AI powered context parser. We parse through
          websites to provide a better knowledge base for your AI to answer.
        </p>
        <Link href="/auth/signin">
          <Button>Sign in to check your context</Button>
        </Link>
      </div>
    </>
  );
}
