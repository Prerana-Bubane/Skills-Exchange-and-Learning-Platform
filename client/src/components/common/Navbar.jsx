import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none' }}>
        SkillBridge
      </Link>

      <div style={{ display: 'flex', gap: '1rem' }}>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/matches">Matches</Link>
            <Link to="/sessions">Sessions</Link>
            <Link to="/profile">Profile</Link>
            <span>Credits: {user.credits}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;