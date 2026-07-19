import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertTriangle, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoDark from '../for dark theme.png';
import logoLight from '../for light theme.png';

export const Login: React.FC = () => {
  const { login, loginWithGoogle, isDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLightTheme, setIsLightTheme] = useState(document.documentElement.classList.contains('light'));

  useEffect(() => {
    setIsLightTheme(document.documentElement.classList.contains('light'));
    const observer = new MutationObserver(() => {
      setIsLightTheme(document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // Admin vs Student routing
      if (email === 'admin@vitbhopal.ac.in') {
        navigate('/admin/analytics');
      } else {
        navigate('/student/profile');
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/student/profile');
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center relative">
      {/* Background glowing rings */}
      <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl glass-premium border border-white/10 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        
        {/* Brand Icon */}
        <div className="flex flex-col items-center gap-2.5 mb-8">
          <img 
            src={isLightTheme ? logoLight : logoDark} 
            alt="IoT Club Logo" 
            className="w-14 h-14 object-contain rounded-xl shadow-lg shadow-cyan-500/10 mb-1"
          />
          <h2 className="font-space font-bold text-2xl text-white">Portal Sign In</h2>
          <p className="text-xs text-gray-500">Official Student & Executive Gateway</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-left mb-6 text-xs text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Authentication (Direct Google Access) */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 rounded-xl border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] text-sm font-bold text-white flex items-center justify-center gap-3 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all duration-300 disabled:opacity-50"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.118 4.114a5.99 5.99 0 0 1-6-6c0-3.31 2.69-6 6-6c1.496 0 2.862.548 3.92 1.453l3.053-3.053A9.971 9.971 0 0 0 12.24 2c-5.522 0-10 4.478-10 10s4.478 10 10 10c5.782 0 9.877-4.062 9.877-9.877c0-.665-.054-1.32-.162-1.956L12.24 10.286z"
            />
          </svg>
          Continue with VIT Google Workspace
        </button>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute w-full h-[1px] bg-white/10" />
          <span className="relative px-3 text-xs bg-spaceBlack text-gray-400">or sign in with password</span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">University Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="name.2022@vitbhopal.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-sm text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {isDemo && (
          <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-left mt-6 text-xs text-yellow-300 flex items-start gap-2.5">
            <Key className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1 font-space">Demo Mode Credentials (Mock):</p>
              <p>• Admin: <span className="font-mono text-white">stacksolveofficial@gmail.com</span> / <span className="font-mono text-white">stack_99</span></p>
              <p>• Student: use any <span className="font-mono text-white">@vitbhopal.ac.in</span> address / <span className="font-mono text-white">password123</span></p>
            </div>
          </div>
        )}

        {/* Footnote */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Not registered yet?{' '}
          <Link to="/signup" className="text-cyan-400 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
