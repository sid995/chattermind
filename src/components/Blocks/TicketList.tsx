import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Ticket {
  _id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
}

interface TicketListProps {
  onSelectTicket: (ticket: Ticket) => void;
}

export default function TicketList({ onSelectTicket }: TicketListProps) {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (session) {
      fetchTickets();
    }
  }, [session]);

  const fetchTickets = async () => {
    const response = await fetch('/api/tickets');
    if (response.ok) {
      const data = await response.json();
      setTickets(data);
    }
  };

  return (
    <div className="w-1/3 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Your Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li
            key={ticket._id}
            className="mb-2 p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectTicket(ticket)}
          >
            <h3 className="font-semibold">{ticket.subject}</h3>
            <p className="text-sm text-gray-500">Status: {ticket.status}</p>
            <p className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}