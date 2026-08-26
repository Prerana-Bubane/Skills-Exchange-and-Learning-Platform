import api from './api';

const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

const getReviewsForUser = async (userId) => {
  const response = await api.get(`/reviews/user/${userId}`);
  return response.data;
};

export default { createReview, getReviewsForUser };