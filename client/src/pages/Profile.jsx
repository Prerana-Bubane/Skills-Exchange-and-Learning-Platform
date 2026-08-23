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

  // Pre-fill the form with the user's existing skills once loaded
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
      // Convert comma-separated text back into a clean array,
      // trimming whitespace and dropping empty entries
      const teachArray = skillsToTeach
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const learnArray = skillsToLearn
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await userService.updateProfile({
        skillsToTeach: teachArray,
        skillsToLearn: learnArray,
      });

      await loadUser(); // refresh the store with the latest saved data
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Skills you can teach (comma-separated)</label>
          <br />
          <input
            type="text"
            value={skillsToTeach}
            onChange={(e) => setSkillsToTeach(e.target.value)}
            placeholder="e.g. React, Node.js, Guitar"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label>Skills you want to learn (comma-separated)</label>
          <br />
          <input
            type="text"
            value={skillsToLearn}
            onChange={(e) => setSkillsToLearn(e.target.value)}
            placeholder="e.g. Spanish, Cooking"
            style={{ width: '100%' }}
          />
        </div>

        {message && <p>{message}</p>}

        <button type="submit" disabled={isSaving} style={{ marginTop: '1rem' }}>
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;