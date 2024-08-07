import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Ticket {
  _id: string;
  subject: string;
  category: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  messages: Message[];
}

interface TicketDetailsProps {
  ticket: Ticket;
}

export default function TicketDetails({ ticket }: TicketDetailsProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>(ticket.messages || []);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: ticket._id, message: newMessage }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessages([...messages, { role: 'user', content: newMessage }, { role: 'assistant', content: data.response }]);
      setNewMessage('');
    }
  };

  return (
    <div className="w-2/3 p-4">
      <h2 className="text-2xl font-bold mb-4">{ticket.subject}</h2>
      <p className="mb-2"><strong>Category:</strong> {ticket.category}</p>
      <p className="mb-2"><strong>Status:</strong> {ticket.status}</p>
      <p className="mb-4"><strong>Description:</strong> {ticket.description}</p>

      <div className="mb-4 h-64 overflow-y-auto bg-gray-100 p-4 rounded">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
              {message.content}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow mr-2 p-2 border rounded"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
}