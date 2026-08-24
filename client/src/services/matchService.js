import api from './api';

const getMyMatches = async () => {
  const response = await api.get('/matches');
  return response.data;
};

export default { getMyMatches };