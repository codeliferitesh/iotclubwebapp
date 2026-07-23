import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Briefcase, Layers, Link2, FileText, 
  Sparkles, Send, CheckCircle, AlertCircle, ArrowRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/db';
import { sendNotificationEmail } from '../services/email';

export const Requirements: React.FC = () => {
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    regNo: '',
    phone: '',
    teamName: 'Technical',
    position: 'Member',
    portfolioUrl: '',
    sop: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [emailStatus, setEmailStatus] = useState<'not_sent' | 'sent' | 'failed'>('not_sent');

  // Autofill if logged in
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        regNo: user.regNo || prev.regNo
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.regNo || !form.phone || !form.sop) return;

    setStatus('submitting');
    const submissionId = `req-${Date.now()}`;
    const applicationData = {
      id: submissionId,
      name: form.name,
      email: form.email,
      regNo: form.regNo,
      phone: form.phone,
      teamName: form.teamName,
      position: form.position,
      portfolioUrl: form.portfolioUrl || undefined,
      sop: form.sop,
      createdAt: new Date().toISOString(),
      status: 'pending' as const
    };

    try {
      // 1. Save in Firestore/LocalStorage
      await dbService.submitRecruitmentApplication(applicationData);

      // 2. Dispatch Email alert to iotclub@vitbhopal.ac.in
      const emailSent = await sendNotificationEmail(
        `[Recruitment] Application for ${form.teamName} - ${form.position} by ${form.name}`,
        {
          name: form.name,
          email: form.email,
          registrationNumber: form.regNo,
          phoneNumber: form.phone,
          appliedTeam: form.teamName,
          appliedPosition: form.position,
          portfolioOrResume: form.portfolioUrl || "Not Provided",
          statementOfPurpose: form.sop
        }
      );

      setEmailStatus(emailSent ? 'sent' : 'failed');
      setStatus('success');
      
      // Reset form fields that aren't profile-based
      setForm(prev => ({
        ...prev,
        phone: '',
        portfolioUrl: '',
        sop: ''
      }));
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const getMailtoLink = () => {
    const subject = encodeURIComponent(`Recruitment Application: ${form.teamName} - ${form.position}`);
    const body = encodeURIComponent(
      `Dear IoT Club Team,\n\nI have submitted my recruitment form on the portal. Here is my application info:\n\n` +
      `Name: ${form.name}\n` +
      `Registration No: ${form.regNo}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      `Position Applied: ${form.position} in ${form.teamName} Team\n` +
      `Portfolio/Resume: ${form.portfolioUrl || 'None'}\n\n` +
      `Statement of Purpose:\n${form.sop}\n\n` +
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
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> RECRUITMENT CELL
        </span>
        <h1 className="font-space font-bold text-3xl sm:text-5xl text-white mt-3 mb-4">
          Join the Builders
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
          We look for curious, passionate, and driven students who want to build the future of IoT, Robotics, and Edge AI. Fill out the application form below for your desired team and position.
        </p>
      </div>

      {status === 'success' ? (
        <div className="rounded-3xl glass-premium border border-white/10 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-6 shadow-2xl relative">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-space font-bold text-2xl sm:text-3xl text-white mb-2">Application Logged!</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              Your details have been successfully written to the IoT Club recruitment registry. The leads will verify and review your qualifications shortly.
            </p>
          </div>

          {emailStatus === 'failed' && (
            <div className="w-full max-w-md p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 text-left flex flex-col gap-3.5 mt-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400">Email Notification Pending</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mt-1">
                    Your database record is secure, but the automatic email notification to the panel was skipped (Access Key unconfigured).
                  </p>
                </div>
              </div>
              <a 
                href={getMailtoLink()}
                className="w-full py-2.5 text-center text-xs font-bold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/25 transition-all rounded-xl flex items-center justify-center gap-1.5"
              >
                Send Manual Alert Email <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {emailStatus === 'sent' && (
            <span className="text-xs text-green-400 bg-green-500/5 border border-green-500/20 px-3.5 py-1.5 rounded-full font-mono">
              Email alert successfully delivered to admin panel.
            </span>
          )}

          <button 
            onClick={() => setStatus('idle')}
            className="mt-4 px-6 py-3 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all"
          >
            Submit Another Application
          </button>
        </div>
      ) : (
        <div className="rounded-3xl glass-premium border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-6 sm:p-8 bg-white/[0.02] border-b border-white/5">
            <h3 className="font-space font-bold text-lg text-white">Recruitment Registry Form</h3>
            <p className="text-xs text-gray-400 mt-1">Please provide accurate contact details and experience records.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {status === 'error' && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>An error occurred while saving your application. Please try again.</span>
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
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
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
                    placeholder="your.email202X@vitbhopal.ac.in"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Registration Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Registration Number</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 23BCE10001"
                    value={form.regNo}
                    onChange={(e) => setForm(prev => ({ ...prev, regNo: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Domain Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Target Team/Domain</label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={form.teamName}
                    onChange={(e) => setForm(prev => ({ ...prev, teamName: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-spaceBlack border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none"
                  >
                    <option value="Technical">Technical Team</option>
                    <option value="Design">Design Team</option>
                    <option value="Media & Photography">Media & Photography Team</option>
                    <option value="Content">Content Team</option>
                    <option value="Event Management">Event Management Team</option>
                    <option value="Social Media">Social Media Team</option>
                    <option value="PR & Outreach">PR & Outreach Team</option>
                  </select>
                </div>
              </div>

              {/* Target Position Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Desired Position</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={form.position}
                    onChange={(e) => setForm(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-spaceBlack border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Co-Lead">Co-Lead</option>
                    <option value="Core Member">Core Member</option>
                    <option value="Member">Member</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Portfolio URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Portfolio / Resume Link (Optional)</label>
              <div className="relative">
                <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="url"
                  placeholder="https://github.com/username or Drive link"
                  value={form.portfolioUrl}
                  onChange={(e) => setForm(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>

            {/* SOP */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block font-space">
                Statement of Purpose / Why do you want to join?
              </label>
              <div className="relative">
                <textarea
                  required
                  placeholder="Detail your relevant skills, past projects, or why you'd like to collaborate with the IoT Club..."
                  rows={6}
                  value={form.sop}
                  onChange={(e) => setForm(prev => ({ ...prev, sop: e.target.value }))}
                  className="w-full p-4 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3.5 font-bold text-sm text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {status === 'submitting' ? 'Logging Application...' : 'Submit Application'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Requirements;
