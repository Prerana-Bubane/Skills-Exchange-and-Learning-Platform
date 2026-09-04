import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.name}</h1>
      <p className="text-gray-500 mb-8">{user?.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Credits</p>
          <p className="text-2xl font-bold text-indigo-600">{user?.credits}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Reputation</p>
          <p className="text-2xl font-bold text-indigo-600">
            {user?.reputationScore || '—'} <span className="text-sm text-gray-400">/ 5</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Skills Listed</p>
          <p className="text-2xl font-bold text-indigo-600">
            {(user?.skillsToTeach?.length || 0) + (user?.skillsToLearn?.length || 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Skills you teach</h2>
        <div className="flex flex-wrap gap-2">
          {user?.skillsToTeach?.length ? (
            user.skillsToTeach.map((skill) => (
              <span key={skill} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-400 text-sm">None added yet</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Skills you want to learn</h2>
        <div className="flex flex-wrap gap-2">
          {user?.skillsToLearn?.length ? (
            user.skillsToLearn.map((skill) => (
              <span key={skill} className="bg-amber-50 text-amber-700 text-sm px-3 py-1 rounded-full">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-400 text-sm">None added yet</p>
          )}
        </div>
      </div>

      {(!user?.skillsToTeach?.length || !user?.skillsToLearn?.length) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <p className="text-amber-800 text-sm">Complete your profile to start finding matches.</p>
          <Link
            to="/profile"
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition whitespace-nowrap ml-4"
          >
            Edit Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;