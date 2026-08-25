import { useState, useEffect } from 'react';
import matchService from '../services/matchService';
import sessionService from '../services/sessionService';
import MatchCard from '../components/cards/MatchCard';

const Matches = () => {
  const [matches, setMatches] = useState({ directMatches: [], chainMatches: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const data = await matchService.getMyMatches();
      setMatches(data);
    } catch (err) {
      setError('Failed to load matches. Make sure you have added skills in your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleBookSession = async (sessionData) => {
    try {
      await sessionService.createSession(sessionData);
      setBookingMessage('Session requested successfully! Check your Sessions page.');
    } catch (err) {
      setBookingMessage(err.response?.data?.message || 'Failed to book session.');
    }
  };

  if (isLoading) return <p>Loading matches...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Your Matches</h1>

      {bookingMessage && <p style={{ color: 'green' }}>{bookingMessage}</p>}

      <h2>Direct Matches ({matches.directMatches.length})</h2>
      {matches.directMatches.length === 0 ? (
        <p>No direct matches yet. Try adding more skills to your profile.</p>
      ) : (
        matches.directMatches.map((match) => (
          <MatchCard key={match.user._id} match={match} onBookSession={handleBookSession} />
        ))
      )}

      <h2>Trade Chains ({matches.chainMatches.length})</h2>
      {matches.chainMatches.length === 0 ? (
        <p>No trade chains found yet.</p>
      ) : (
        matches.chainMatches.map((match, index) => (
          <MatchCard key={index} match={match} onBookSession={handleBookSession} />
        ))
      )}
    </div>
  );
};

export default Matches;