import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import AppRoutes from './routes/AppRoutes';

function App() {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return <AppRoutes />;
}

export default App;