import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { API_BASE_URL } from '../config';

type AuthStep = 'login' | 'signup' | 'verify';

export default function Login() {
  const [step, setStep] = useState<AuthStep>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request code');
      
      if (data.demo_code) setDemoCode(data.demo_code);
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let endpoint = '';
      let body: any = {};
      
      if (step === 'login') {
        endpoint = '/api/auth/login';
        body = { email, password };
      } else if (step === 'verify') {
        endpoint = '/api/auth/signup';
        body = { name, email, password, code };
      }

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

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
          <h2 className="text-2xl font-bold text-navy mb-2">
            {step === 'login' ? 'Welcome Back' : step === 'signup' ? 'Join FBLA Hub' : 'Verify Your Email'}
          </h2>
          <p className="text-black/60">
            {step === 'login' ? 'Sign in to your membership portal' : 
             step === 'signup' ? 'Create a new member account' : 
             `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {step === 'verify' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-1 text-center">Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue transition-shadow font-mono"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
              />
            </div>
            {demoCode && (
              <p className="text-xs text-center text-blue bg-blue/10 py-2 rounded-lg">
                Demo mode: Use code <strong>{demoCode}</strong>
              </p>
            )}
            {error && <p className="text-sm text-[#dc2626] text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue text-white font-medium py-3 rounded-lg hover:bg-cobalt transition-colors duration-200"
            >
              Complete Sign Up
            </button>
            <button
              type="button"
              onClick={() => setStep('signup')}
              className="w-full text-sm text-black/60 hover:text-navy transition-colors mt-2"
            >
              Back to Sign Up
            </button>
          </form>
        ) : (
          <form onSubmit={step === 'login' ? handleSubmit : handleRequestCode} className="space-y-6">
            {step === 'signup' && (
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
              {step === 'login' ? 'Sign In' : 'Continue'}
            </button>
          </form>
        )}
        
        {step !== 'verify' && (
          <div className="mt-6 text-center text-sm text-black/60">
            {step === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setStep(step === 'login' ? 'signup' : 'login'); setError(''); }} 
              className="text-blue font-medium hover:underline"
            >
              {step === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
