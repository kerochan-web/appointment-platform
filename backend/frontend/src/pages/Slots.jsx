import { useState, useEffect } from 'react';

const Slots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${apiUrl}/slots`)
      .then((res) => res.json())
      .then((data) => {
        setSlots(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, [apiUrl]);

  const handleBook = async (slotId) => {
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
        // Remove the booked slot from the UI or refresh list
        setSlots(slots.filter(slot => slot.id !== slotId));
      } else {
        setMessage(data.message || 'Booking failed.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
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
            <div key={slot.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
              <div>
                <p className="font-medium text-slate-700">
                  {new Date(slot.start_time).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">Duration: 1 hour</p>
              </div>
              <button
                onClick={() => handleBook(slot.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
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
