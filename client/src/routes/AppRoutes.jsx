import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Temporary placeholder components — replace these as we build real pages
const Home = () => <h1>Home Page (placeholder)</h1>;
const Login = () => <h1>Login Page (placeholder)</h1>;
const Signup = () => <h1>Signup Page (placeholder)</h1>;
const Dashboard = () => <h1>Dashboard (placeholder, protected)</h1>;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;