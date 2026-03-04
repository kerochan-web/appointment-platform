import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  // Live Sync: Admin sees new bookings without refreshing
  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000); 
    return () => clearInterval(interval);
  }, [apiUrl, token]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${apiUrl}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    try {
      const res = await fetch(`${apiUrl}/slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ start_time: startTime, end_time: endTime }),
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: 'Slot created successfully!' });
        setStartTime('');
        setEndTime('');
      } else {
        const data = await res.json();
        setStatus({ type: 'error', msg: data.message || 'Failed to create slot.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Server error.' });
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    
    try {
      await fetch(`${apiUrl}/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Column 1: Create Slot */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-800">Create Availability</h2>
        <form onSubmit={handleCreateSlot} className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-600">Start Time</label>
            <input 
              type="datetime-local" 
              className="w-full p-2 border rounded mt-1"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">End Time</label>
            <input 
              type="datetime-local" 
              className="w-full p-2 border rounded mt-1"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800">
            Add Time Slot
          </button>
          {status.msg && (
            <p className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {status.msg}
            </p>
          )}
        </form>
      </section>

      {/* Column 2: Manage Bookings */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-slate-800">Current Bookings</h2>
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <p className="text-slate-500 italic">No active bookings.</p>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm">
                <div>
                  <p className="text-sm font-bold text-slate-700">{b.user_email || `User #${b.user_id}`}</p>
                  <p className="text-xs text-slate-500">Start time: {new Date(b.start_time).toLocaleString()}</p>
                  <p className="text-xs text-slate-500">End time: {new Date(b.end_time).toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Booking ID: {b.id}</p>
                </div>
                <button 
                  onClick={() => cancelBooking(b.id)}
                  className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded border border-red-100 hover:bg-red-100"
                >
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
