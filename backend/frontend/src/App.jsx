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
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
        Book Your Appointment <span className="text-blue-600">in Seconds</span>
      </h1>
      <p className="mt-4 text-xl text-slate-600 max-w-2xl">
        A minimalist, high-performance booking system. Choose a time slot and manage your schedule with zero friction.
      </p>
      <div className="mt-10">
        <Link to="/bookings" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-md">
          View Available Slots
        </Link>
      </div>
      
      {/* Backend Status Indicator */}
      <div className="mt-12 text-xs font-mono text-slate-400 uppercase tracking-widest">
        System Status: <span className={health.status === 'ok' ? 'text-green-500' : 'text-red-500'}>{health.status}</span>
      </div>
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUserEmail(null);
    window.location.href = '/'; 
  };

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-slate-900 w-full">
        {/* Sticky Navbar */}
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link to="/" className="text-xl font-bold tracking-tighter text-blue-600">
                  BOOKIT_
                </Link>
                <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                  <Link to="/bookings" className="hover:text-blue-600">Slots</Link>
                  {token && <Link to="/dashboard" className="hover:text-blue-600">My Bookings</Link>}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {token ? (
                  <>
                    <span className="hidden sm:inline text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {userEmail}
                    </span>
                    {localStorage.getItem('userRole') === 'admin' && (
                      <Link to="/admin" className="text-sm font-bold text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50">Admin</Link>
                    )}
                    <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-slate-900">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
                      Login
                    </Link>
                    <Link to="/register" className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login setToken={setToken} setUserEmail={setUserEmail} />} />
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
        </main>
      </div>
    </Router>
  );
}

export default App;
