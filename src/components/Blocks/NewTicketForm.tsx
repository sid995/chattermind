import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface NewTicketFormProps {
  onSubmit: () => void;
}

export default function NewTicketForm({ onSubmit }: NewTicketFormProps) {
  const { data: session } = useSession();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !category || !description) return;

    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, category, description }),
    });

    if (response.ok) {
      setSubject('');
      setCategory('');
      setDescription('');
      onSubmit();
    }
  };

  return (
    <div className="w-2/3 p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Support Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className="block mb-2">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing</option>
            <option value="general">General Inquiry</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Ticket</button>
      </form>
    </div>
  );
}