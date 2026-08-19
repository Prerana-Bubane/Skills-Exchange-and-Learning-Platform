import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;