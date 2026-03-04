import useTitle from '../hooks/useTitle';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useTitle('My Bookings');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${apiUrl}/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data);
      } else {
        setError(data.message || 'Failed to load bookings.');
      }
    } catch (err) {
      setError('Connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch(`${apiUrl}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        // Filter out the cancelled booking from UI
        setBookings(bookings.filter((b) => b.id !== bookingId));
      } else {
        alert('Could not cancel booking.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 font-mono">Loading your schedule...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">My Bookings</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-slate-500 italic">No active bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="p-4 border border-slate-200 rounded-lg bg-white shadow-sm flex justify-between items-center">
              <div>
                {/* Formatting date for readability */}
                <p className="font-semibold text-slate-700">
                  Start time: {new Date(b.start_time).toLocaleString()}
                </p>
                <p className="font-semibold text-slate-700">
                  End time: {new Date(b.end_time).toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">Booking ID: {b.id}</p>
              </div>
              <button
                onClick={() => handleCancel(b.id)}
                className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded border border-red-100 hover:bg-red-100"
              >
                Cancel
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
