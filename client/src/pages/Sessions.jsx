import { useState, useEffect } from 'react';
import sessionService from '../services/sessionService';
import useAuthStore from '../store/authStore';
import SessionCard from '../components/cards/SessionCard';

const Sessions = () => {
  const user = useAuthStore((state) => state.user);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const data = await sessionService.getMySessions();
      setSessions(data);
    } catch (err) {
      setError('Failed to load sessions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUpdateStatus = async (sessionId, status) => {
    setActionMessage('');
    try {
      await sessionService.updateSessionStatus(sessionId, status);
      setActionMessage(`Session marked as ${status}.`);
      fetchSessions(); // refresh the list to show the new status
    } catch (err) {
      setActionMessage(err.response?.data?.message || 'Failed to update session.');
    }
  };

  if (isLoading) return <p>Loading sessions...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Split sessions into upcoming (not completed/cancelled) and past, for clearer organization
  const upcoming = sessions.filter((s) => ['pending', 'confirmed'].includes(s.status));
  const past = sessions.filter((s) => ['completed', 'cancelled'].includes(s.status));

  return (
    <div>
      <h1>Your Sessions</h1>

      {actionMessage && <p style={{ color: 'green' }}>{actionMessage}</p>}

      <h2>Upcoming ({upcoming.length})</h2>
      {upcoming.length === 0 ? (
        <p>No upcoming sessions. Go book one from your Matches page!</p>
      ) : (
        upcoming.map((session) => (
          <SessionCard
            key={session._id}
            session={session}
            currentUserId={user._id}
            onUpdateStatus={handleUpdateStatus}
          />
        ))
      )}

      <h2>Past ({past.length})</h2>
      {past.length === 0 ? (
        <p>No past sessions yet.</p>
      ) : (
        past.map((session) => (
          <SessionCard
            key={session._id}
            session={session}
            currentUserId={user._id}
            onUpdateStatus={handleUpdateStatus}
          />
        ))
      )}
    </div>
  );
};

export default Sessions;