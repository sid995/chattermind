// "use client";

// import { useRef, useEffect } from "react";
// import { SendIcon } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useChat } from "ai/react";

// interface Message {
//   id: string;
//   role: "system" | "user" | "assistant";
//   content: string;
// }

// export default function ChatWindow() {
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const { messages, input, handleInputChange, handleSubmit, isLoading } =
//     useChat({
//       initialMessages: [
//         {
//           id: "system-1",
//           role: "system",
//           content:
//             "Welcome to the Headstarter AI Support Chat! I'm JDP, your AI assistant for questions about the Headstarter fellowship. I can provide information about our three tracks: Entrepreneur, Tech Leader, and Individual Contributor. How can I assist you today?",
//         },
//         {
//           id: "assistant-1",
//           role: "assistant",
//           content:
//             "Hello! How can I help you with information about the Headstarter fellowship?",
//         },
//       ] as Message[],
//     });

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="h-[calc(100vh-theme(spacing.28))] flex flex-col max-w-3xl w-full">
//       <div className="flex-1 overflow-y-auto">
//         <div className="space-y-4">
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`p-4 rounded-lg ${
//                 message.role === "system"
//                   ? "bg-blue-100"
//                   : message.role === "user"
//                   ? "bg-gray-100"
//                   : "bg-green-100"
//               }`}
//             >
//               <div className="font-bold">
//                 {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
//               </div>
//               <div>{message.content}</div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>
//       <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
//         <Input
//           value={input}
//           onChange={handleInputChange}
//           placeholder="Type your message..."
//           disabled={isLoading}
//         />
//         <Button type="submit" disabled={isLoading}>
//           <SendIcon className="w-5 h-5" />
//           <span className="sr-only">Send</span>
//         </Button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useRef } from "react";
import { useChat } from "ai/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendIcon } from "lucide-react";

export default function ChatWindow() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({});

  return (
    <div className="h-[calc(100vh-theme(spacing.28))] flex flex-col max-w-3xl w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.role === "system"
                  ? "bg-blue-100"
                  : message.role === "user"
                  ? "bg-gray-100"
                  : "bg-green-100"
              }`}
            >
              <div className="font-bold">
                {message.role.charAt(0).toUpperCase() + message.role.slice(1)}
              </div>
              <div>{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          <SendIcon className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
