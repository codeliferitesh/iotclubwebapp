import React, { useState } from 'react';
import { Mail, MessageSquare, Send, User, BookOpen, Sparkles, CheckCircle } from 'lucide-react';
import { dbService } from '../services/db';

export const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    setStatus('sending');
    try {
      await dbService.submitContactMessage({
        id: `m-${Date.now()}`,
        name: form.name,
        email: form.email,
        subject: form.subject || 'General Inquiry',
        message: form.message,
        status: 'unread',
        createdAt: new Date().toISOString()
      });
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">GET IN TOUCH</span>
        <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2 mb-6">Contact Us</h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed">
          Have a question about upcoming hackathons, equipment distributions, or joining a technical team? Send us a message and we'll get back to you shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Contact Info Block */}
        <div className="lg:col-span-2 flex flex-col gap-6 text-left">
          <div className="p-6 rounded-2xl glass-premium border border-white/5 flex flex-col gap-4">
            <h3 className="font-space font-bold text-xl text-white mb-2">Club Coordinates</h3>
            
            <div className="space-y-4 text-xs sm:text-sm text-gray-400">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1">COLLEGE ADDRESS</span>
                <span className="text-white font-semibold block">VIT Bhopal University</span>
                <span>Kotri Kalan, Sehore, Madhya Pradesh - 466114, India</span>
              </div>
              
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1">EMAIL INQUIRIES</span>
                <a href="mailto:iotclub@vitbhopal.ac.in" className="text-white font-semibold hover:underline block">
                  iotclub@vitbhopal.ac.in
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-premium border border-white/5 flex flex-col justify-center gap-4 relative overflow-hidden h-40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
            <Sparkles className="w-8 h-8 text-cyan-400 mb-2" />
            <h4 className="font-space font-bold text-base text-white">Sponsorship Details</h4>
            <p className="text-xs text-gray-400">
              For corporate alignments, hardware sponsorships, or tech talks, reach out directly to the PR team at <a href="mailto:iotclub@vitbhopal.ac.in" className="text-cyan-400 underline">iotclub@vitbhopal.ac.in</a>.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="p-6 sm:p-8 rounded-2xl glass-premium border border-white/10">
            {status === 'success' ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                <CheckCircle className="w-16 h-16 text-green-400 animate-pulse" />
                <h3 className="font-space font-bold text-2xl text-white">Message Transmitted!</h3>
                <p className="text-sm text-gray-400 max-w-sm">
                  Your query has been logged in our databases. The administrative leads will review and respond shortly.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">VIT Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        placeholder="john.doe2022@vitbhopal.ac.in"
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Subject</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Topic of Inquiry"
                      value={form.subject}
                      onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Message Details</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-gray-500" />
                    <textarea
                      placeholder="Type details of your query here..."
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3 font-bold text-sm text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? 'Transmitting Message...' : 'Transmit Query'}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
