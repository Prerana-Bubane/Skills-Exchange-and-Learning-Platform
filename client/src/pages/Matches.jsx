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

  if (isLoading) return <p className="text-gray-500">Loading matches...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Matches</h1>

      {bookingMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg mb-6">
          {bookingMessage}
        </div>
      )}

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Direct Matches ({matches.directMatches.length})
      </h2>
      {matches.directMatches.length === 0 ? (
        <p className="text-gray-400 text-sm mb-8">No direct matches yet. Try adding more skills to your profile.</p>
      ) : (
        <div className="mb-8">
          {matches.directMatches.map((match) => (
            <MatchCard key={match.user._id} match={match} onBookSession={handleBookSession} />
          ))}
        </div>
      )}

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Trade Chains ({matches.chainMatches.length})
      </h2>
      {matches.chainMatches.length === 0 ? (
        <p className="text-gray-400 text-sm">No trade chains found yet.</p>
      ) : (
        matches.chainMatches.map((match, index) => (
          <MatchCard key={index} match={match} onBookSession={handleBookSession} />
        ))
      )}
    </div>
  );
};

export default Matches;