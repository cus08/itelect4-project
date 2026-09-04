import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const LoginPage = () => {
  const [email, setEmail] = useState('marcus@dlsl.edu.ph');
  const [password, setPassword] = useState('password123');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const generatedToken = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    login(generatedToken);
    
    navigate('/sessions');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-white">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Peer Tutoring Portal</h2>
          <p className="text-xs text-slate-400">Sign in to access peer tutoring sessions & bookings</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-foreground">Email Address</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@dlsl.edu.ph"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={!email || !password}
            className="w-full"
          >
            <span>Sign In to Dashboard</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </form>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">Demo Mode Active</p>
          <p>Submitting this form authenticates via <code className="text-sky-400 font-mono">useAuthStore</code> Zustand store.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
