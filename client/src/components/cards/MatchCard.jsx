import { useState } from 'react';

const MatchCard = ({ match, onBookSession }) => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  const isDirect = match.type === 'direct';

  const handleBook = () => {
    if (!selectedSkill || !scheduledAt) return;
    onBookSession({
      teacherId: match.user._id,
      skill: selectedSkill,
      scheduledAt: new Date(scheduledAt).toISOString(),
    });
    setShowBookingForm(false);
  };

  if (isDirect) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">{match.user.name}</h3>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
            Direct Match
          </span>
        </div>

        <div className="space-y-1.5 mb-4">
          <p className="text-sm text-gray-600">
            <span className="text-gray-400">They teach you:</span>{' '}
            <span className="font-medium">{match.theyTeach.join(', ')}</span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="text-gray-400">You teach them:</span>{' '}
            <span className="font-medium">{match.youTeach.join(', ')}</span>
          </p>
        </div>

        {!showBookingForm ? (
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Book a Session
          </button>
        ) : (
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select skill to learn</option>
              {match.theyTeach.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex gap-2">
              <button
                onClick={handleBook}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setShowBookingForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Chain match rendering
  return (
    <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">3-Way Trade Chain</h3>
        <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
          Chain Match
        </span>
      </div>

      <div className="space-y-1.5">
        {match.path.map((step, index) => (
          <p key={index} className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{step.user.name}</span>{' '}
            teaches: <span className="font-medium">{step.teachesNext.join(', ')}</span>
          </p>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
        Chain trades require coordinating with multiple people — booking support coming soon.
      </p>
    </div>
  );
};

export default MatchCard;