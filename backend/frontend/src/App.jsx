import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Slots from './pages/Slots';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const Landing = () => {
  const [health, setHealth] = useState({ status: 'loading', message: 'Connecting to backend...' });

  useEffect(() => {
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
      <h1 className="text-4xl font-bold text-slate-800">Book Your Appointment in Seconds</h1>
      <h2 className="text-3xl text-slate-800"> Choose a time slot and manage your bookings easily.</h2>
      <Link to="/bookings" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded">
        View Available Slots
      </Link>
    </div>
  );
};

function App() {
  // Lift auth status into state so React tracks it
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null); // Triggers re-render
    window.location.href = '/'; 
  };

  return (
    <Router>
      <nav className="p-4 bg-slate-100 flex gap-6 border-b items-center">
        <Link to="/" className="font-bold">Home</Link>
        <Link to="/bookings">Slots</Link>
        
        {/* Only show "My Bookings" if logged in */}
        {token && <Link to="/dashboard">My Bookings</Link>}
        
        <div className="ml-auto flex gap-4 items-center">
          {token ? (
            <>
              {/* Only show Admin link if role matches */}
              {localStorage.getItem('userRole') === 'admin' && (
                <Link to="/admin" className="text-red-600 font-medium">Admin</Link>
              )}
              <button onClick={handleLogout} className="text-sm text-slate-600 hover:text-slate-900">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-blue-600 font-medium">Login</Link>
              <Link to="/register" className="text-sm text-slate-600 font-medium border border-slate-300 px-3 py-1 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Pass setToken to Login so it can update the App state */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookings" element={<Slots />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
