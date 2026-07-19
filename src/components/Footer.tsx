import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Instagram, Linkedin, Github, Youtube, MessageSquare, PhoneCall } from 'lucide-react';
import { dbService } from '../services/db';
import logoDark from '../for dark theme.png';
import logoLight from '../for light theme.png';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [isLightTheme, setIsLightTheme] = useState(document.documentElement.classList.contains('light'));

  useEffect(() => {
    setIsLightTheme(document.documentElement.classList.contains('light'));
    const observer = new MutationObserver(() => {
      setIsLightTheme(document.documentElement.classList.contains('light'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await dbService.subscribeNewsletter(email);
      setStatus('success');
      setEmail('');
      setMsg('Thank you for subscribing to our IoT Newsletter!');
    } catch (err: any) {
      setStatus('error');
      setMsg(err.message || 'Something went wrong. Try again.');
    }
  };

  const socials = [
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: 'https://www.instagram.com/iotclub_vitbhopal?igsh=MTF4cHUwem00bDNzaQ==', color: 'hover:text-pink-500 hover:border-pink-500/50 hover:shadow-pink-500/10' },
    { name: 'WhatsApp', icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.416 9.864-9.863.002-2.638-1.023-5.117-2.884-6.98-1.862-1.864-4.343-2.89-6.984-2.892-5.445 0-9.877 4.417-9.88 9.865-.001 1.748.459 3.4 1.331 4.793l-.973 3.55 3.63-.952zm10.29-6.495c-.292-.146-1.727-.853-1.993-.95-.266-.097-.46-.146-.653.146-.193.291-.748.95-.917 1.144-.169.194-.338.219-.63.072-1.295-.648-2.133-1.156-2.986-2.62-.22-.377.22-.349.63-1.173.069-.146.035-.272-.017-.379-.052-.107-.46-1.11-.63-1.524-.166-.399-.334-.345-.46-.352-.12-.006-.256-.008-.393-.008-.137 0-.36.051-.55.257-.19.206-.723.707-.723 1.724 0 1.017.739 2.002.84 2.141.101.14 1.455 2.222 3.524 3.116.492.213.876.34 1.176.435.495.158.946.135 1.302.083.397-.058 1.728-.707 1.974-1.39.246-.684.246-1.272.172-1.392-.072-.12-.266-.194-.558-.34z" />
      </svg>
    ), href: 'https://whatsapp.com/channel/0029Vb8lbZ05PO1AAvthYj3P', color: 'hover:text-green-500 hover:border-green-500/50 hover:shadow-green-500/10' },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, href: 'https://www.linkedin.com/company/iot-club-vitb/posts/?feedView=all', color: 'hover:text-blue-500 hover:border-blue-500/50 hover:shadow-blue-500/10' }
  ];

  return (
    <footer className="relative bg-spaceBlack/90 dark:bg-spaceBlack/90 border-t border-white/10 pt-16 pb-8 overflow-hidden z-10">
      {/* Background Aurora */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5 group self-start">
            <img 
              src={isLightTheme ? logoLight : logoDark} 
              alt="IoT Club Logo" 
              className="w-9 h-9 object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-space font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              IoT CLUB
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
            Official IoT Club of VIT Bhopal University. Inspiring and enabling student innovators to build the connected, automated, and intelligent systems of tomorrow.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3 mt-2">
            {socials.map((soc) => (
              <a
                key={soc.name}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-xl border border-white/10 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:bg-white/5 ${soc.color}`}
                title={soc.name}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-space font-bold text-base text-white tracking-wide">
            Explore
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
            <Link to="/about" className="hover:text-cyan-400 transition-colors">About Club</Link>
            <Link to="/domains" className="hover:text-cyan-400 transition-colors">Domains</Link>
            <Link to="/events" className="hover:text-cyan-400 transition-colors">Events</Link>
            <Link to="/projects" className="hover:text-cyan-400 transition-colors">Projects</Link>
            <Link to="/gallery" className="hover:text-cyan-400 transition-colors">Gallery</Link>
            <Link to="/blogs" className="hover:text-cyan-400 transition-colors">Blogs</Link>
            <Link to="/resources" className="hover:text-cyan-400 transition-colors">Resources</Link>
            <Link to="/achievements" className="hover:text-cyan-400 transition-colors">Achievements</Link>
          </div>
        </div>

        {/* Useful Pages Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-space font-bold text-base text-white tracking-wide">
            Resources & Policies
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-gray-400">
            <Link to="/login" className="hover:text-cyan-400 transition-colors">Student Login</Link>
            <Link to="/signup" className="hover:text-cyan-400 transition-colors">Register Portal</Link>
            <Link to="/contact" className="hover:text-cyan-400 transition-colors">Reach Out</Link>
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="flex flex-col gap-4">
          <h4 className="font-space font-bold text-base text-white tracking-wide">
            Stay Connected
          </h4>
          <p className="text-sm text-gray-400 leading-normal">
            Subscribe to receive event updates, hackathon announcements, and monthly hardware newsletters.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center mt-1">
            <input
              type="email"
              placeholder="name@vitbhopal.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="absolute right-1.5 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {msg && (
            <p className={`text-xs mt-1 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {msg}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} IoT Club, VIT Bhopal University. All Rights Reserved.</p>
        <p>Designed and Built by IoT Club Technical Team © <a href="https://www.linkedin.com/in/riteshvermadev/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">@rkv</a>.</p>
      </div>
    </footer>
  );
};
export default Footer;
