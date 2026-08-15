import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.signup(userData);
      set({ user: data, isLoading: false });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(credentials);
      set({ user: data, isLoading: false });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Called on app load to check if a saved token is still valid
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const data = await authService.getMe();
      set({ user: data, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, isLoading: false });
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null });
  },
}));

export default useAuthStore;