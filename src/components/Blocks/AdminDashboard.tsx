import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

type ExtendedSession = Session & {
  user: {
    role: string;
  };
};

interface Metrics {
  totalTickets: number;
  openTickets: number;
  avgResponseTime: number;
}

export const useExtendedSession = () => {
  const { data: session } = useSession<ExtendedSession>();

  return session;
};

export default function AdminDashboard() {
  const { data: session } = useExtendedSession();
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchMetrics();
    }
  }, [session]);

  const fetchMetrics = async () => {
    const response = await fetch('/api/admin/metrics');
    const data = await response.json();
    setMetrics(data);
  };

  if (session?.user?.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {metrics && (
        <div>
          <p>Total Tickets: {metrics.totalTickets}</p>
          <p>Open Tickets: {metrics.openTickets}</p>
          <p>Average Response Time: {metrics.avgResponseTime} hours</p>
        </div>
      )}
    </div>
  );
}