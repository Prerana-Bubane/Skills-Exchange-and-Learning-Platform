import { useState } from 'react';

const MatchCard = ({ match, onBookSession }) => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  const isDirect = match.type === 'direct';

  const handleBook = () => {
    if (!selectedSkill || !scheduledAt) return;

    // For direct matches, the "teacher" is the other user teaching us a skill
    onBookSession({
      teacherId: match.user._id,
      skill: selectedSkill,
      scheduledAt: new Date(scheduledAt).toISOString(),
    });

    setShowBookingForm(false);
  };

  if (isDirect) {
    return (
      <div style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
        <h3>{match.user.name}</h3>
        <p><strong>They teach you:</strong> {match.theyTeach.join(', ')}</p>
        <p><strong>You teach them:</strong> {match.youTeach.join(', ')}</p>

        {!showBookingForm ? (
          <button onClick={() => setShowBookingForm(true)}>Book a Session</button>
        ) : (
          <div style={{ marginTop: '0.5rem' }}>
            <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
              <option value="">Select skill to learn</option>
              {match.theyTeach.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            <br />
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              style={{ marginTop: '0.5rem' }}
            />
            <br />
            <button onClick={handleBook} style={{ marginTop: '0.5rem' }}>Confirm Booking</button>
            <button onClick={() => setShowBookingForm(false)} style={{ marginTop: '0.5rem', marginLeft: '0.5rem' }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  // Chain match rendering
  return (
    <div style={{ border: '1px solid #f0ad4e', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      <h3>3-Way Trade Chain</h3>
      {match.path.map((step, index) => (
        <p key={index}>
          <strong>{step.user.name}</strong> teaches: {step.teachesNext.join(', ')}
        </p>
      ))}
      <p style={{ fontSize: '0.85rem', color: '#888' }}>
        Note: chain trades require coordinating with multiple people — booking support for this coming soon.
      </p>
    </div>
  );
};

export default MatchCard;