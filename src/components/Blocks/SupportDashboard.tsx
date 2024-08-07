'use client'

import { useState } from 'react';
import TicketList from './TicketList';
import TicketDetails from './TicketDetails';
import NewTicketForm from './NewTicketForm';

export default function SupportDashboard() {
  const [selectedTicket, setSelectedTicket] = useState<null>(null);
  const [isNewTicketFormOpen, setIsNewTicketFormOpen] = useState(false);

  return (
    <div className="flex w-full">
      <TicketList onSelectTicket={setSelectedTicket} />
      <div className="flex-grow">
        {selectedTicket ? (
          <TicketDetails ticket={selectedTicket} />
        ) : isNewTicketFormOpen ? (
          <NewTicketForm onSubmit={() => setIsNewTicketFormOpen(false)} />
        ) : (
          <button onClick={() => setIsNewTicketFormOpen(true)}>New Support Ticket</button>
        )}
      </div>
    </div>
  );
}