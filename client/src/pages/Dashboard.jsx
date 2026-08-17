import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Credits: {user?.credits}</p>
      <p>Skills to teach: {user?.skillsToTeach?.join(', ') || 'None yet'}</p>
      <p>Skills to learn: {user?.skillsToLearn?.join(', ') || 'None yet'}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;