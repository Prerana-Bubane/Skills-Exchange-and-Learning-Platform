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

  if (isLoading) return <p className="text-gray-500">Loading profile...</p>;
  if (!profile) return <p className="text-gray-500">User not found.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <span className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
            {profile.reputationScore || 'No ratings yet'}{profile.reputationScore ? ' / 5' : ''}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Teaches</p>
            <div className="flex flex-wrap gap-2">
              {profile.skillsToTeach?.length ? (
                profile.skillsToTeach.map((skill) => (
                  <span key={skill} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">None listed</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">Wants to learn</p>
            <div className="flex flex-wrap gap-2">
              {profile.skillsToLearn?.length ? (
                profile.skillsToLearn.map((skill) => (
                  <span key={skill} className="bg-amber-50 text-amber-700 text-sm px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 text-sm">None listed</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Reviews ({reviews.length})
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900 text-sm">{review.reviewer.name}</p>
                <p className="text-amber-500 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
              </div>
              {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProfile;