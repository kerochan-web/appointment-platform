import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Slots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  // Handle URL errors (e.g., if auto-booking failed during login)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'already_booked') {
      setMessage('Sorry! That slot was taken while you were logging in.');
    }
  }, [location]);

  // 1. Fetching logic encapsulated for reuse
  const fetchSlots = async () => {
    try {
      const res = await fetch(`${apiUrl}/slots`);
      const data = await res.json();
      setSlots(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  // 2. "Optimistic" Sync: Poll every 5 seconds to catch bookings from other users
  useEffect(() => {
    fetchSlots(); // Initial fetch
    const interval = setInterval(fetchSlots, 5000); 
    return () => clearInterval(interval); // Cleanup on unmount
  }, [apiUrl]);

  const handleBook = async (slotId) => {
    // 3. Auth Check & Redirect Logic
    if (!token) {
      navigate(`/login?redirectTo=/dashboard&slotId=${slotId}`);
      return;
    }

    setMessage('');
    try {
      const response = await fetch(`${apiUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ time_slot_id: slotId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Booking successful!');
        // Optimistic UI: Remove it immediately before the next poll
        setSlots(prev => prev.filter(slot => slot.id !== slotId));
      } else {
        setMessage(data.message || 'Booking failed.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
  };

  // 4. Dynamic Duration Helper
  const getDuration = (start, end) => {
    const diffInMs = new Date(end) - new Date(start);
    const diffInMins = Math.round(diffInMs / 60000);
    if (diffInMins >= 60) {
      const hours = Math.floor(diffInMins / 60);
      const mins = diffInMins % 60;
      return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
    }
    return `${diffInMins} mins`;
  };

  if (loading) return <div className="p-8">Loading available time slots...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Available Appointments</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="grid gap-4">
        {slots.length === 0 ? (
          <p className="text-slate-500">No slots available right now. Check back later.</p>
        ) : (
          slots.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white shadow-sm hover:border-blue-300 transition-all">
              <div>
                <p className="font-medium text-slate-700">
                  {new Date(slot.start_time).toLocaleDateString()} at {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-slate-500">
                  Duration: {getDuration(slot.start_time, slot.end_time)}
                </p>
              </div>
              <button
                onClick={() => handleBook(slot.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                Book Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Slots;
