import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../services/userService';
import reviewService from '../services/reviewService';

const PublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, reviewData] = await Promise.all([
          userService.getUserById(userId),
          reviewService.getReviewsForUser(userId),
        ]);
        setProfile(userData);
        setReviews(reviewData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (isLoading) return <p>Loading profile...</p>;
  if (!profile) return <p>User not found.</p>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p><strong>Reputation:</strong> {profile.reputationScore || 'No ratings yet'} / 5</p>
      <p><strong>Teaches:</strong> {profile.skillsToTeach?.join(', ') || 'None listed'}</p>
      <p><strong>Wants to learn:</strong> {profile.skillsToLearn?.join(', ') || 'None listed'}</p>

      <h2>Reviews ({reviews.length})</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
            <p><strong>{review.reviewer.name}</strong> — {review.rating} stars</p>
            {review.comment && <p>{review.comment}</p>}
          </div>
        ))
      )}
    </div>
  );
};

export default PublicProfile;