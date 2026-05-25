import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { API_BASE_URL } from '../config';

type AuthStep = 'login' | 'signup' | 'verify' | 'forgot' | 'reset';

export default function Login() {
  const [step, setStep] = useState<AuthStep>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setError('');
    setSuccessMsg('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset email');

      setSuccessMsg(data.message);
      setStep('reset');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      resetForm();
      setStep('login');
      setSuccessMsg('Password reset successfully! You can now sign in.');
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

  const getTitle = () => {
    switch (step) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Join FBLA Hub';
      case 'verify': return 'Verify Your Email';
      case 'forgot': return 'Forgot Password';
      case 'reset': return 'Reset Your Password';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'login': return 'Sign in to your membership portal';
      case 'signup': return 'Create a new member account';
      case 'verify': return `We sent a 6-digit code to ${email}`;
      case 'forgot': return "Enter your email and we'll send you a reset code";
      case 'reset': return `Enter the code we sent to ${email} and your new password`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-pattern">
      <div className="w-full max-w-md bg-white rounded-xl shadow-card p-8 animate-fade-up">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img src="/fbla-logo.png" alt="FBLA Hub Logo" className="h-14 w-auto" />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">{getTitle()}</h2>
          <p className="text-black/60">{getSubtitle()}</p>
        </div>

        {/* Success message (e.g. after login-page reset) */}
        {successMsg && step === 'login' && (
          <p className="text-sm text-green-600 bg-green-50 border border-green-200 text-center rounded-lg py-2 px-3 mb-4">
            {successMsg}
          </p>
        )}

        {/* ── VERIFY (email signup code) ── */}
        {step === 'verify' && (
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
            <button type="submit" className="w-full bg-blue text-white font-medium py-3 rounded-lg hover:bg-cobalt transition-colors duration-200">
              Complete Sign Up
            </button>
            <button type="button" onClick={() => setStep('signup')} className="w-full text-sm text-black/60 hover:text-navy transition-colors mt-2">
              Back to Sign Up
            </button>
          </form>
        )}

        {/* ── FORGOT PASSWORD (enter email) ── */}
        {step === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue transition-shadow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
              />
            </div>
            {error && <p className="text-sm text-[#dc2626]">{error}</p>}
            <button type="submit" className="w-full bg-blue text-white font-medium py-2.5 rounded-lg hover:bg-cobalt transition-colors duration-200">
              Send Reset Code
            </button>
            <button type="button" onClick={() => { setStep('login'); resetForm(); }} className="w-full text-sm text-black/60 hover:text-navy transition-colors mt-2">
              Back to Sign In
            </button>
          </form>
        )}

        {/* ── RESET PASSWORD (enter code + new password) ── */}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {successMsg && (
              <p className="text-xs text-center text-blue bg-blue/10 py-2 rounded-lg">{successMsg}</p>
            )}
            <div>
              <label className="block text-sm font-medium text-navy mb-1 text-center">Reset Code</label>
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
            <div>
              <label className="block text-sm font-medium text-navy mb-1">New Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue transition-shadow"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue transition-shadow"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-[#dc2626]">{error}</p>}
            <button type="submit" className="w-full bg-blue text-white font-medium py-2.5 rounded-lg hover:bg-cobalt transition-colors duration-200">
              Reset Password
            </button>
            <button type="button" onClick={() => { setStep('forgot'); resetForm(); }} className="w-full text-sm text-black/60 hover:text-navy transition-colors mt-2">
              Resend Code
            </button>
          </form>
        )}

        {/* ── LOGIN / SIGNUP ── */}
        {(step === 'login' || step === 'signup') && (
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-navy">Password</label>
                {step === 'login' && (
                  <button
                    type="button"
                    onClick={() => { resetForm(); setStep('forgot'); }}
                    className="text-xs text-blue hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
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
            <button type="submit" className="w-full bg-blue text-white font-medium py-2.5 rounded-lg hover:bg-cobalt transition-colors duration-200">
              {step === 'login' ? 'Sign In' : 'Continue'}
            </button>
          </form>
        )}

        {/* Toggle between login / signup */}
        {(step === 'login' || step === 'signup') && (
          <div className="mt-6 text-center text-sm text-black/60">
            {step === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setStep(step === 'login' ? 'signup' : 'login'); setError(''); setSuccessMsg(''); }}
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
