import api from './api';

const createSession = async (sessionData) => {
  const response = await api.post('/sessions', sessionData);
  return response.data;
};

const getMySessions = async () => {
  const response = await api.get('/sessions');
  return response.data;
};

const updateSessionStatus = async (sessionId, status) => {
  const response = await api.patch(`/sessions/${sessionId}/status`, { status });
  return response.data;
};

export default { createSession, getMySessions, updateSessionStatus };
