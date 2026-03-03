import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // 1. Not logged in? Go to login.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Trying to access admin page without being an admin? Go to home.
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. All good? Render the requested page.
  return children;
};

export default ProtectedRoute;
