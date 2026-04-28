import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setUser(data);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-pattern">
      <div className="w-full max-w-md bg-white rounded-xl shadow-card p-8 animate-fade-up">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img src="/fbla-logo.png" alt="FBLA Hub Logo" className="h-14 w-auto" />
          </div>
          <p className="text-black/60">
            {isLogin ? 'Sign in to your membership portal' : 'Create a new member account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue transition-shadow"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue transition-shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue transition-shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-[#dc2626]">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue text-white font-medium py-2.5 rounded-lg hover:bg-cobalt transition-colors duration-200"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-black/60">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="text-blue font-medium hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
