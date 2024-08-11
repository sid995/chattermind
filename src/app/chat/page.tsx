import ChatWindow from "@/components/Blocks/ChatWindow";
import Navbar from "@/components/Blocks/Navbar";
import Sidebar from "@/components/Blocks/Sidebar";
import { checkIsAuthenticated } from "@/lib/auth/checkIsAuthenticated";
import { redirect } from "next/navigation";

export default async function Page() {
  const isAuthenticated = await checkIsAuthenticated();
  if (!isAuthenticated) {
    redirect("/auth/signin");
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1">
        <Sidebar />
        <section className="w-full">
          <ChatWindow />
        </section>
      </main>
    </>
  );
}
