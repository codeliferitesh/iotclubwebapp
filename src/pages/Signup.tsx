import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoDark from '../for dark theme.png';
import logoLight from '../for light theme.png';

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', regNo: '', branch: 'CSE', year: '3rd', password: '' });
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
    if (!form.name || !form.email || !form.regNo || !form.password) return;
    
    setLoading(true);
    setError('');
    try {
      await signup(form.email, form.password, form.name, form.regNo, form.branch, form.year);
      navigate('/student/profile');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Make sure to use a valid @vitbhopal.ac.in email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 flex items-center justify-center relative">
      <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl glass-premium border border-white/10 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        
        {/* Title */}
        <div className="flex flex-col items-center gap-2.5 mb-6">
          <img 
            src={isLightTheme ? logoLight : logoDark} 
            alt="IoT Club Logo" 
            className="w-14 h-14 object-contain rounded-xl shadow-lg shadow-cyan-500/10 mb-1"
          />
          <h2 className="font-space font-bold text-2xl text-white">Create Portal Account</h2>
          <p className="text-xs text-gray-500">Only @vitbhopal.ac.in addresses permitted</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-left mb-5 text-xs text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Registration Number</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="22BCE10001"
                  value={form.regNo}
                  onChange={(e) => setForm(prev => ({ ...prev, regNo: e.target.value.toUpperCase() }))}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Branch</label>
              <select
                value={form.branch}
                onChange={(e) => setForm(prev => ({ ...prev, branch: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="CSE" className="bg-spaceBlack">CSE (Core)</option>
                <option value="CSE (IoT)" className="bg-spaceBlack">CSE (IoT)</option>
                <option value="CSE (AIML)" className="bg-spaceBlack">CSE (AIML)</option>
                <option value="CSE (Cyber Security)" className="bg-spaceBlack">CSE (Cyber Security)</option>
                <option value="CSE (Cloud Computing)" className="bg-spaceBlack">CSE (Cloud Computing)</option>
                <option value="CSE (Gaming Technology)" className="bg-spaceBlack">CSE (Gaming Technology)</option>
                <option value="CSE (Health Informatics)" className="bg-spaceBlack">CSE (Health Informatics)</option>
                <option value="CSE (E-Commerce Technology)" className="bg-spaceBlack">CSE (E-Commerce Technology)</option>
                <option value="ECE" className="bg-spaceBlack">ECE (Core)</option>
                <option value="ECE (AI & Cyber-Physical Systems)" className="bg-spaceBlack">ECE (AI & Cyber-Physical Systems)</option>
                <option value="Integrated M.Tech (CSE)" className="bg-spaceBlack">Integrated M.Tech (CSE)</option>
                <option value="Mechanical Engineering (Robotics)" className="bg-spaceBlack">Mechanical (Robotics)</option>
                <option value="Bio-Engineering" className="bg-spaceBlack">Bio-Engineering</option>
                <option value="BBA" className="bg-spaceBlack">BBA</option>
                <option value="B.Sc. (Multimedia & Animation)" className="bg-spaceBlack">B.Sc. (Multimedia & Animation)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Academic Year</label>
              <select
                value={form.year}
                onChange={(e) => setForm(prev => ({ ...prev, year: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="1st" className="bg-spaceBlack">1st Year</option>
                <option value="2nd" className="bg-spaceBlack">2nd Year</option>
                <option value="3rd" className="bg-spaceBlack">3rd Year</option>
                <option value="4th" className="bg-spaceBlack">4th Year</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">VIT Bhopal Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="name.surname2022@vitbhopal.ac.in"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                required
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
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
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                required
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-sm text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Register Profile'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Portal Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Signup;
