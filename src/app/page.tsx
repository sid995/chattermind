import ChatWindow from "@/components/Blocks/ChatWindow";
import Sidebar from "@/components/Blocks/Sidebar";

export default function Page() {
  return (
    <main className="flex flex-1">
      <Sidebar />
      <section className="w-full">
        <ChatWindow />
      </section>
    </main>
  );
}
