import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // The "Magic" bit: save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role); // Useful for admin routing later

      navigate('/dashboard');
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
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Sign In</h2>
        
        {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}

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
          className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  );
};

export default Login;
