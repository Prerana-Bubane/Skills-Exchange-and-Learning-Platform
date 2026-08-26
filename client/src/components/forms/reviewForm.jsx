import { useState } from 'react';
import reviewService from '../../services/reviewService';

const ReviewForm = ({ sessionId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await reviewService.createReview({ sessionId, rating, comment });
      onReviewSubmitted(); // tell the parent to refresh/hide this form
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f9f9f9' }}>
      <label>Rating: </label>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
        ))}
      </select>

      <br />

      <textarea
        placeholder="Leave a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        style={{ width: '100%', marginTop: '0.5rem' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;