import useTitle from '../hooks/useTitle';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useTitle('Register');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      // Wait 2 seconds so they can see the success message, then redirect
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <form 
        onSubmit={handleRegister} 
        className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Create Account</h2>
        
        {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}
        {success && <p className="mb-4 text-sm text-green-600 font-medium">Account created! Redirecting to login...</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            className="mt-1 block w-full border border-slate-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
