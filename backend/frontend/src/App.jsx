import useTitle from './hooks/useTitle';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Slots from './pages/Slots';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
        Book Your Appointment <span className="text-blue-600">in Seconds</span>
      </h1>
      <p className="mt-4 text-xl text-slate-600 max-w-2xl">
        A minimalist, high-performance booking system.
      </p>
      <Link to="/bookings" className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-md">
        View Available Slots
      </Link>
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state

  useTitle('Home');

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserEmail(null);
    window.location.href = '/'; 
  };

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              
              {/* Logo */}
              <div className="flex items-center gap-8">
                <Link to="/" className="text-xl font-bold tracking-tighter text-blue-600">
                  BOOKIT_
                </Link>
                {/* Desktop Links */}
                <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                  <Link to="/bookings" className="hover:text-blue-600">Slots</Link>
                  {token && <Link to="/dashboard" className="hover:text-blue-600">My Bookings</Link>}
                </div>
              </div>

              {/* Desktop Auth Section */}
              <div className="hidden md:flex items-center gap-4">
                {token ? (
                  <>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{userEmail}</span>
                    {localStorage.getItem('userRole') === 'admin' && (
                      <Link to="/admin" className="text-sm font-bold text-red-600 border border-red-200 px-2 py-1 rounded">Admin</Link>
                    )}
                    <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-slate-900">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">Login</Link>
                    <Link to="/register" className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-md">Get Started</Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button (Hamburger) */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-slate-600 hover:text-slate-900 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
              <Link to="/bookings" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-600 hover:text-blue-600">Slots</Link>
              {token && (
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-600 hover:text-blue-600">My Bookings</Link>
              )}
              <hr className="border-slate-100" />
              {token ? (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono text-slate-500 mb-2">{userEmail}</div>
                  {localStorage.getItem('userRole') === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-red-600 font-bold">Admin Dashboard</Link>
                  )}
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left text-sm text-slate-500">Logout</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-slate-600 font-medium">Login</Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="bg-slate-900 text-white text-center px-4 py-2 rounded-md">Get Started</Link>
                </div>
              )}
            </div>
          )}
        </nav>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login setToken={setToken} setUserEmail={setUserEmail} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/bookings" element={<Slots />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
