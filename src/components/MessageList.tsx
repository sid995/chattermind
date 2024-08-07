interface Message {
  _id: string;
  content: string;
  role: "user" | "assistant";
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="h-[500px] overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
            }`}
        >
          <div
            className={`${message.role === "user"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-800"
              } rounded-lg p-2 max-w-xs`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
}