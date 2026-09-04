import { useState } from 'react';
import ReviewForm from '../forms/ReviewForm';

const SessionCard = ({ session, currentUserId, onUpdateStatus }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isTeacher = session.teacher._id === currentUserId;
  const otherPerson = isTeacher ? session.learner : session.teacher;
  const myRole = isTeacher ? 'Teaching' : 'Learning';

  const statusStyles = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-sky-50 text-sky-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{session.skill}</h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[session.status]}`}>
          {session.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <p><span className="text-gray-400">{myRole} with:</span> <span className="font-medium">{otherPerson.name}</span></p>
        <p><span className="text-gray-400">Scheduled:</span> {new Date(session.scheduledAt).toLocaleString()}</p>
        <p><span className="text-gray-400">Duration:</span> {session.durationMinutes} minutes</p>
        {session.notes && <p><span className="text-gray-400">Notes:</span> {session.notes}</p>}
      </div>

      <div className="flex flex-wrap gap-2">
        {session.status === 'pending' && isTeacher && (
          <>
            <button
              onClick={() => onUpdateStatus(session._id, 'confirmed')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Confirm
            </button>
            <button
              onClick={() => onUpdateStatus(session._id, 'cancelled')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Decline
            </button>
          </>
        )}

        {session.status === 'confirmed' && (
          <>
            <button
              onClick={() => onUpdateStatus(session._id, 'completed')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Mark Completed
            </button>
            <button
              onClick={() => onUpdateStatus(session._id, 'cancelled')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </>
        )}

        {session.status === 'completed' && !reviewSubmitted && (
          <div className="w-full">
            {!showReviewForm ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                Leave a Review
              </button>
            ) : (
              <ReviewForm
                sessionId={session._id}
                onReviewSubmitted={() => {
                  setReviewSubmitted(true);
                  setShowReviewForm(false);
                }}
              />
            )}
          </div>
        )}

        {reviewSubmitted && <p className="text-emerald-600 text-sm">Thanks for your review!</p>}
      </div>
    </div>
  );
};

export default SessionCard;
