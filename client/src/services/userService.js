import api from './api';

const updateProfile = async (profileData) => {
  const response = await api.put('/users/me', profileData);
  return response.data;
};

const searchBySkill = async (skill) => {
  const response = await api.get(`/users/search?skill=${skill}`);
  return response.data;
};

const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export default { updateProfile, searchBySkill, getUserById };