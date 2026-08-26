import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Matches from '../pages/Matches';
import Sessions from '../pages/Sessions';
import PublicProfile from '../pages/PublicProfile';

const Home = () => <h1>Home Page (placeholder)</h1>;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
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
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
          }
         />

          <Route
            path="/sessions"
            element={
               <ProtectedRoute>
                  <Sessions />
               </ProtectedRoute>
          }
         />

         <Route
            path="/users/:userId"
            element={
              <ProtectedRoute>
                  <PublicProfile />
              </ProtectedRoute>
          }
         />


        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;