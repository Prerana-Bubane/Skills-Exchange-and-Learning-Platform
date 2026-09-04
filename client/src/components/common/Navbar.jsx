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
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        SkillBridge
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 transition">
              Dashboard
            </Link>
            <Link to="/matches" className="text-gray-600 hover:text-indigo-600 transition">
              Matches
            </Link>
            <Link to="/sessions" className="text-gray-600 hover:text-indigo-600 transition">
              Sessions
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-indigo-600 transition">
              Profile
            </Link>
            <span className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
              {user.credits} credits
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;