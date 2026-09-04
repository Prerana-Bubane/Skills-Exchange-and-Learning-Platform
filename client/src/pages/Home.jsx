import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Home = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-3xl mx-auto text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Trade skills, not money.
      </h1>
      <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
        SkillBridge connects people who want to teach with people who want to
        learn — matched automatically, including multi-person trade chains.
      </p>

      {user ? (
        <Link
          to="/matches"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          Find Your Matches
        </Link>
      ) : (
        <div className="flex justify-center gap-3">
          <Link
            to="/signup"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg border border-gray-200 transition"
          >
            Login
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold mb-3">
            1
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">List your skills</h3>
          <p className="text-sm text-gray-500">
            Add what you can teach and what you want to learn.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold mb-3">
            2
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Get matched</h3>
          <p className="text-sm text-gray-500">
            Our algorithm finds direct swaps and multi-person trade chains.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold mb-3">
            3
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Book & learn</h3>
          <p className="text-sm text-gray-500">
            Schedule sessions, pay with credits instead of cash.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;