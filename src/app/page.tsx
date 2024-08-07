import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/ChatInterface";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar session={session} />
      <main className="flex-grow flex flex-col items-center justify-center p-24">
        <ChatInterface session={session} />
      </main>
    </div>
  );
}