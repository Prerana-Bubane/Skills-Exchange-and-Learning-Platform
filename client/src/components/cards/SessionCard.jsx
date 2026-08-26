import { useState } from 'react';
import ReviewForm from '../forms/reviewForm';

const SessionCard = ({ session, currentUserId, onUpdateStatus }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isTeacher = session.teacher._id === currentUserId;
  const otherPerson = isTeacher ? session.learner : session.teacher;
  const myRole = isTeacher ? 'Teaching' : 'Learning';

  const statusColors = {
    pending: '#f0ad4e',
    confirmed: '#5bc0de',
    completed: '#5cb85c',
    cancelled: '#d9534f',
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>{session.skill}</h3>
        <span style={{ color: statusColors[session.status], fontWeight: 'bold' }}>
          {session.status.toUpperCase()}
        </span>
      </div>

      <p><strong>{myRole} with:</strong> {otherPerson.name}</p>
      <p><strong>Scheduled:</strong> {new Date(session.scheduledAt).toLocaleString()}</p>
      <p><strong>Duration:</strong> {session.durationMinutes} minutes</p>
      {session.notes && <p><strong>Notes:</strong> {session.notes}</p>}

      <div style={{ marginTop: '0.5rem' }}>
        {session.status === 'pending' && isTeacher && (
          <>
            <button onClick={() => onUpdateStatus(session._id, 'confirmed')}>Confirm</button>
            <button onClick={() => onUpdateStatus(session._id, 'cancelled')} style={{ marginLeft: '0.5rem' }}>
              Decline
            </button>
          </>
        )}

        {session.status === 'confirmed' && (
          <>
            <button onClick={() => onUpdateStatus(session._id, 'completed')}>Mark Completed</button>
            <button onClick={() => onUpdateStatus(session._id, 'cancelled')} style={{ marginLeft: '0.5rem' }}>
              Cancel
            </button>
          </>
        )}

        {session.status === 'completed' && !reviewSubmitted && (
          <>
            {!showReviewForm ? (
              <button onClick={() => setShowReviewForm(true)}>Leave a Review</button>
            ) : (
              <ReviewForm
                sessionId={session._id}
                onReviewSubmitted={() => {
                  setReviewSubmitted(true);
                  setShowReviewForm(false);
                }}
              />
            )}
          </>
        )}

        {reviewSubmitted && <p style={{ color: 'green' }}>Thanks for your review!</p>}
      </div>
    </div>
  );
};

export default SessionCard;