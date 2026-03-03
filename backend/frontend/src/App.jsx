import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Slots from './pages/Slots';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const Landing = () => {
  const [health, setHealth] = useState({ status: 'loading', message: 'Connecting to backend...' });

  useEffect(() => {
    // Accessing the env variable via import.meta.env
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/health`)
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => {
        console.error(err);
        setHealth({ status: 'error', message: 'Backend is unreachable.' });
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-slate-800">Welcome to the App</h1>
      
      {/* Health Check Display */}
      <div className={`mt-4 p-4 rounded border ${health.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <p className="text-sm font-mono">
          <strong>System Status:</strong> {health.message}
        </p>
        {health.time && <p className="text-xs text-slate-500 mt-1">Server Time: {health.time}</p>}
      </div>

      <Link to="/bookings" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded">
        View Slots
      </Link>
    </div>
  );
};

const AdminPanel = () => <div className="p-8 font-mono"><h2>Admin Terminal</h2></div>;

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/'; // Hard redirect to reset state
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <nav className="p-4 bg-slate-100 flex gap-4 border-b">
        <Link tag="Home" to="/">Home</Link>
        <Link to="/dashboard">My Bookings</Link>
        <Link to="/admin" className="ml-auto text-red-600">Admin</Link>
        <div className="ml-auto flex gap-4 items-center">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-sm text-slate-600">Logout</button>
          ) : (
            <Link to="/login" className="text-sm text-blue-600 font-medium">Login</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bookings" element={<Slots />} />
        {/* Protected User Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
