import ChatWindow from "@/components/Blocks/ChatWindow";
import Sidebar from "@/components/Blocks/Sidebar";

export default function Page() {
  return (
    <main className="flex flex-1 h-screen">
      <Sidebar />
      <section className="pl-64 h-screen w-full pt-24 flex justify-center">
        <ChatWindow />
      </section>
    </main>
  );
}
