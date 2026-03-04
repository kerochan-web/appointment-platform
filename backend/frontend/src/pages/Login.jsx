import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = ({ setToken, setUserEmail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Get query parameters (e.g., ?redirectTo=/dashboard&slotId=123)
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get('redirectTo');
  const slotId = queryParams.get('slotId');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // 1. Save credentials
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userEmail', data.user.email);
      setToken(data.token);
      setUserEmail(data.user.email);

      // --- INTERRUPTED BOOKING LOGIC ---
      if (slotId) {
        try {
          const bookRes = await fetch(`${apiUrl}/bookings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({ time_slot_id: slotId }),
          });

          if (!bookRes.ok) {
            // If the slot was taken while they were logging in, 
            // send them back to slots with an error query param
            navigate('/bookings?error=already_booked');
            return;
          }
        } catch (err) {
          console.error("Auto-booking failed", err);
        }
      }
      
      // --- REDIRECTION LOGIC ---
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (redirectTo) {
        // Send them to /dashboard (as defined in Slots.jsx)
        navigate(redirectTo);
      } else {
        // Default fallback: Check for any existing bookings
        const bookingsRes = await fetch(`${apiUrl}/my-bookings`, {
          headers: { 'Authorization': `Bearer ${data.token}` }
        });
        const bookings = await bookingsRes.json();
        navigate(bookings.length > 0 ? '/dashboard' : '/bookings');
      }

      } catch (err) {
        setError(err.message);
      }
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2 text-slate-800">Sign In</h2>
        {redirectTo && (
          <p className="mb-6 text-sm text-blue-600 bg-blue-50 p-2 rounded">
            Login to finish booking your appointment.
          </p>
        )}
        
        {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Login;
