interface Chat {
  _id: string;
  title: string;
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

export default function ChatList({ chats, selectedChatId, onChatSelect }: ChatListProps) {
  return (
    <div className="w-1/4 pr-4">
      <h2 className="text-2xl font-bold mb-4">Chats</h2>
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li
            key={chat._id}
            className={`cursor-pointer p-2 rounded ${selectedChatId === chat._id ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
            onClick={() => onChatSelect(chat._id)}
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
}