import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center relative z-10">
      <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="p-8 sm:p-12 rounded-3xl glass-premium border border-white/10 max-w-md w-full flex flex-col items-center">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6 animate-bounce">
          <Compass className="w-10 h-10" />
        </div>

        <h1 className="font-space font-extrabold text-5xl text-white mb-2">404</h1>
        <h2 className="font-space font-bold text-lg text-white mb-4">Signal Lost in Space</h2>
        
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-8">
          The node or page you are requesting could not be retrieved. It may have been disconnected, renamed, or offline.
        </p>

        <Link
          to="/"
          className="px-6 py-3 font-bold text-xs sm:text-sm text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Mission Control
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
