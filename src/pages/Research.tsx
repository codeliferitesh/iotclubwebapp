import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Layers, FileText, Send, 
  CheckCircle, AlertCircle, ArrowRight, Sparkles 
} from 'lucide-react';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { sendNotificationEmail } from '../services/email';

export const Research: React.FC = () => {
  const { user } = useAuth();
  const [researchForm, setResearchForm] = useState({
    name: '',
    email: '',
    regNo: '',
    phone: '',
    researchArea: 'Embedded Systems',
    proposalTitle: '',
    abstract: ''
  });
  const [researchStatus, setResearchStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [researchEmailStatus, setResearchEmailStatus] = useState<'not_sent' | 'sent' | 'failed'>('not_sent');

  // Autofill user details
  useEffect(() => {
    if (user) {
      setResearchForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        regNo: user.regNo || prev.regNo
      }));
    }
  }, [user]);

  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchForm.name || !researchForm.email || !researchForm.regNo || !researchForm.phone || !researchForm.proposalTitle || !researchForm.abstract) return;

    setResearchStatus('submitting');
    const submissionId = `res-${Date.now()}`;
    const applicationData = {
      id: submissionId,
      name: researchForm.name,
      email: researchForm.email,
      regNo: researchForm.regNo,
      phone: researchForm.phone,
      researchArea: researchForm.researchArea,
      proposalTitle: researchForm.proposalTitle,
      abstract: researchForm.abstract,
      createdAt: new Date().toISOString(),
      status: 'pending' as const
    };

    try {
      await dbService.submitResearchApplication(applicationData);

      const emailSent = await sendNotificationEmail(
        `[Research Proposal] ${researchForm.researchArea}: ${researchForm.proposalTitle} by ${researchForm.name}`,
        {
          name: researchForm.name,
          email: researchForm.email,
          registrationNumber: researchForm.regNo,
          phoneNumber: researchForm.phone,
          researchDomain: researchForm.researchArea,
          proposalTitle: researchForm.proposalTitle,
          abstractDetails: researchForm.abstract
        }
      );

      setResearchEmailStatus(emailSent ? 'sent' : 'failed');
      setResearchStatus('success');
      
      setResearchForm(prev => ({
        ...prev,
        phone: '',
        proposalTitle: '',
        abstract: ''
      }));
    } catch (err) {
      console.error(err);
      setResearchStatus('error');
    }
  };

  const getMailtoLink = () => {
    const subject = encodeURIComponent(`Research Paper proposal: ${researchForm.researchArea} - ${researchForm.proposalTitle}`);
    const body = encodeURIComponent(
      `Dear IoT Club Team,\n\nI have submitted my research proposal on the portal. Here is my info:\n\n` +
      `Name: ${researchForm.name}\n` +
      `Registration No: ${researchForm.regNo}\n` +
      `Email: ${researchForm.email}\n` +
      `Phone: ${researchForm.phone}\n` +
      `Domain: ${researchForm.researchArea}\n` +
      `Proposal Title: ${researchForm.proposalTitle}\n\n` +
      `Abstract Details:\n${researchForm.abstract}\n\n` +
      `Thank you!`
    );
    return `mailto:iotclub@vitbhopal.ac.in?subject=${subject}&body=${body}`;
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-left relative z-10">
      {/* Header Banner */}
      <div className="mb-12 text-center md:text-left relative overflow-hidden p-8 sm:p-10 rounded-3xl glass-premium border border-white/5 bg-gradient-to-r from-blue-900/10 via-cyan-900/10 to-spaceBlack">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-1.5 justify-center md:justify-start">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> RESEARCH WING
        </span>
        <h1 className="font-space font-bold text-3xl sm:text-5xl text-white mt-3 mb-4">
          Research with Us
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
          The IoT Club fosters a collaborative workspace for paper publishing, patent drafting, and hardware-software system integration. Submit your research ideas below.
        </p>
      </div>

      {researchStatus === 'success' ? (
        <div className="rounded-3xl glass-premium border border-white/10 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-6 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-space font-bold text-2xl text-white mb-2">Proposal Transmitted!</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              Your research proposal has been successfully logged in the club registry. The technical panel will verify and reach out for layout blueprints and hardware requisitions.
            </p>
          </div>

          {researchEmailStatus === 'failed' && (
            <div className="w-full max-w-md p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 text-left flex flex-col gap-3.5">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400">Email Notification Required</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-1">
                    Your proposal is stored in our database, but we need you to draft the alert email to complete your application.
                  </p>
                </div>
              </div>
              <a 
                href={getMailtoLink()}
                className="w-full py-2.5 text-center text-xs font-bold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/25 transition-all rounded-xl flex items-center justify-center gap-1.5"
              >
                Draft Alert Email <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {researchEmailStatus === 'sent' && (
            <span className="text-xs text-green-400 bg-green-500/5 border border-green-500/20 px-3.5 py-1.5 rounded-full font-mono">
              Email details dispatched to iotclub@vitbhopal.ac.in.
            </span>
          )}

          <button 
            onClick={() => setResearchStatus('idle')}
            className="mt-4 px-6 py-3 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            Submit Another Proposal
          </button>
        </div>
      ) : (
        <div className="rounded-3xl glass-premium border border-white/10 overflow-hidden shadow-2xl">
          <form onSubmit={handleResearchSubmit} className="p-6 sm:p-8 space-y-6">
            {researchStatus === 'error' && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Error saving proposal to database. Please review your network or credentials.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={researchForm.name}
                    onChange={(e) => setResearchForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">VIT Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder="username202X@vitbhopal.ac.in"
                    value={researchForm.email}
                    onChange={(e) => setResearchForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reg No */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Registration Number</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 23BSA10001"
                    value={researchForm.regNo}
                    onChange={(e) => setResearchForm(prev => ({ ...prev, regNo: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile number"
                    value={researchForm.phone}
                    onChange={(e) => setResearchForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Research Area */}
              <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Research Domain</label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={researchForm.researchArea}
                    onChange={(e) => setResearchForm(prev => ({ ...prev, researchArea: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-spaceBlack border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none"
                  >
                    <option value="Embedded Systems">Embedded Systems</option>
                    <option value="Edge AI">Edge AI</option>
                    <option value="Robotics & Automation">Robotics & Automation</option>
                    <option value="Smart Grids / LoRaWAN">Smart Grids / LoRaWAN</option>
                    <option value="Biomedical Wearables">Biomedical Wearables</option>
                  </select>
                </div>
              </div>

              {/* Proposal Title */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Research Paper / Proposal Title</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Designing LoRaWAN Gateway arrays for environmental mapping"
                    value={researchForm.proposalTitle}
                    onChange={(e) => setResearchForm(prev => ({ ...prev, proposalTitle: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Proposal Abstract */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block font-space">Abstract / Proposal Overview</label>
              <textarea
                required
                placeholder="Outline the core thesis, hardware components needed, methodologies, and expected deliverables..."
                rows={5}
                value={researchForm.abstract}
                onChange={(e) => setResearchForm(prev => ({ ...prev, abstract: e.target.value }))}
                className="w-full p-4 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={researchStatus === 'submitting'}
              className="w-full py-3.5 font-bold text-sm text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {researchStatus === 'submitting' ? 'Transmitting Proposal...' : 'Transmit Proposal'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Research;
