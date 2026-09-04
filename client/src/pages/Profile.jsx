import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import userService from '../services/userService';

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const loadUser = useAuthStore((state) => state.loadUser);

  const [skillsToTeach, setSkillsToTeach] = useState('');
  const [skillsToLearn, setSkillsToLearn] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setSkillsToTeach(user.skillsToTeach?.join(', ') || '');
      setSkillsToLearn(user.skillsToLearn?.join(', ') || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const teachArray = skillsToTeach.split(',').map((s) => s.trim()).filter(Boolean);
      const learnArray = skillsToLearn.split(',').map((s) => s.trim()).filter(Boolean);

      await userService.updateProfile({ skillsToTeach: teachArray, skillsToLearn: learnArray });
      await loadUser();
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills you can teach
            </label>
            <input
              type="text"
              value={skillsToTeach}
              onChange={(e) => setSkillsToTeach(e.target.value)}
              placeholder="e.g. React, Node.js, Guitar"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills you want to learn
            </label>
            <input
              type="text"
              value={skillsToLearn}
              onChange={(e) => setSkillsToLearn(e.target.value)}
              placeholder="e.g. Spanish, Cooking"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
          </div>

          {message && (
            <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-2 rounded-lg transition"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;