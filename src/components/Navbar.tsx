import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoDark from '../for dark theme.png';
import logoLight from '../for light theme.png';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll handler for background shift
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme configuration
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      document.body.classList.add('light');
    } else {
      root.classList.remove('light');
      document.body.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Domains', path: '/domains' },
    { name: 'Events', path: '/events' },
    { name: 'Projects', path: '/projects' },
    { name: 'Research', path: '/research' },
    { name: 'Members', path: '/members' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Resources', path: '/resources' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Recruitment', path: '/requirements' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-spaceBlack/60 dark:bg-spaceBlack/60 backdrop-blur-md border-b border-white/10' 
        : 'py-5 bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src={theme === 'light' ? logoLight : logoDark} 
            alt="IoT Club Logo" 
            className="w-9 h-9 object-contain rounded-lg group-hover:scale-110 transition-transform duration-300"
          />
          <span className="font-space font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:text-cyan-400 transition-colors">
            IoT CLUB
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center gap-2.5 2xl:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-xs xl:text-sm font-medium transition-colors hover:text-cyan-400 ${
                isActive(link.path) 
                  ? 'text-cyan-400' 
                  : 'text-gray-300 dark:text-gray-400'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="hidden xl:flex items-center gap-4">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/5 text-gray-400 hover:text-cyan-400 transition-all duration-300"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={user.role === 'admin' ? '/admin/analytics' : '/student/profile'}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl glass border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Portal Login
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex xl:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-white/10 text-gray-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden w-full bg-spaceBlack/95 dark:bg-spaceBlack/95 border-b border-white/10 max-h-[80vh] overflow-y-auto"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-semibold py-2 transition-colors ${
                    isActive(link.path) ? 'text-cyan-400' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to={user.role === 'admin' ? '/admin/analytics' : '/student/profile'}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 py-3 font-bold rounded-xl glass border border-cyan-500/30 text-cyan-400"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 py-3 font-bold rounded-xl border border-red-500/20 text-red-400 bg-red-500/5 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-3 font-bold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                  >
                    Portal Login
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
