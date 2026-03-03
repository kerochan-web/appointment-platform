import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

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
                  {new Date(b.start_time).toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">Booking ID: {b.id}</p>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {b.status}
                </span>
              </div>
              <button
                onClick={() => handleCancel(b.id)}
                className="text-sm text-red-600 hover:underline font-medium"
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
