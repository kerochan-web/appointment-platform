import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Landing = () => (
  <div className="p-8">
    <h1 className="text-4xl font-bold text-slate-800">Welcome to the App</h1>
    <p className="mt-4 text-slate-600">A clean, simple booking system.</p>
    <Link to="/bookings" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded">View Slots</Link>
  </div>
);

const UserDashboard = () => <div className="p-8"><h2>Your Bookings</h2></div>;
const AdminPanel = () => <div className="p-8 font-mono"><h2>Admin Terminal</h2></div>;

function App() {
  return (
    <Router>
      <nav className="p-4 bg-slate-100 flex gap-4 border-b">
        <Link tag="Home" to="/">Home</Link>
        <Link to="/dashboard">My Bookings</Link>
        <Link to="/admin" className="ml-auto text-red-600">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
