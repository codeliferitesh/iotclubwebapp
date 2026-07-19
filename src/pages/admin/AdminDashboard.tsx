import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Users, Calendar, Image, BookOpen, FileText, Mail, 
  Bell, QrCode, Plus, Trash2, Edit3, Check, RefreshCw, Cpu 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/db';
import { 
  TeamMember, IoTEvent, EventRegistration, GalleryItem, 
  ProjectItem, BlogItem, ResourceItem, Announcement 
} from '../../types';


export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'events' | 'team' | 'broadcast' | 'checkin'>('analytics');
  

  
  // DB Lists
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<IoTEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms states
  const [eventForm, setEventForm] = useState<Partial<IoTEvent>>({
    title: '', description: '', type: 'workshop', date: '', location: '', slots: 50, status: 'upcoming', certificateEnabled: true
  });
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({
    name: '', position: 'Lead', teamName: 'Technical', bio: '', email: '', linkedin: '', github: ''
  });
  
  // Broadcast states
  const [emailForm, setEmailForm] = useState({ target: 'all', subject: '', body: '' });
  const [notifForm, setNotifForm] = useState({ title: '', body: '', type: 'announcement' as any });
  
  // QR Check-in state
  const [ticketId, setTicketId] = useState('');
  const [checkinMsg, setCheckinMsg] = useState({ success: false, text: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const tList = await dbService.getTeam();
        setTeam(tList);
        const eList = await dbService.getEvents();
        setEvents(eList);
        const rList = await dbService.getRegistrations();
        setRegistrations(rList);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  // CRUD Actions
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return;
    const newEvent: IoTEvent = {
      id: `e-${Date.now()}`,
      title: eventForm.title,
      description: eventForm.description || '',
      type: eventForm.type as any,
      date: eventForm.date,
      location: eventForm.location || 'VIT Bhopal',
      countdownTarget: new Date(eventForm.date).toISOString(),
      registrationDeadline: new Date(eventForm.date).toISOString(),
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
      status: eventForm.status as any,
      slots: Number(eventForm.slots || 50),
      registeredCount: 0,
      certificateEnabled: !!eventForm.certificateEnabled
    };
    await dbService.saveEvent(newEvent);
    const updated = await dbService.getEvents();
    setEvents(updated);
    setEventForm({ title: '', description: '', type: 'workshop', date: '', location: '', slots: 50, status: 'upcoming', certificateEnabled: true });
  };

  const handleDeleteEvent = async (id: string) => {
    await dbService.deleteEvent(id);
    setEvents(events.filter(e => e.id !== id));
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.email) return;
    const newMember: TeamMember = {
      id: `t-${Date.now()}`,
      name: teamForm.name,
      position: teamForm.position || 'Lead',
      teamName: teamForm.teamName as any,
      bio: teamForm.bio || '',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      email: teamForm.email,
      linkedin: teamForm.linkedin || 'https://linkedin.com',
      github: teamForm.github || undefined,
      order: team.length + 1
    };
    await dbService.saveTeamMember(newMember);
    const updated = await dbService.getTeam();
    setTeam(updated);
    setTeamForm({ name: '', position: 'Lead', teamName: 'Technical', bio: '', email: '', linkedin: '', github: '' });
  };

  const handleDeleteTeam = async (id: string) => {
    await dbService.deleteTeamMember(id);
    setTeam(team.filter(m => m.id !== id));
  };

  // Broadcast handlers
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.subject || !emailForm.body) return;
    // Simulate API request to SendGrid/Resend
    alert(`E-mail broadcast sent to: ${emailForm.target.toUpperCase()}\nSubject: ${emailForm.subject}`);
    setEmailForm({ target: 'all', subject: '', body: '' });
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifForm.title || !notifForm.body) return;
    
    await dbService.sendNotification({
      id: `n-${Date.now()}`,
      title: notifForm.title,
      body: notifForm.body,
      type: notifForm.type,
      target: 'all',
      createdAt: new Date().toISOString()
    });
    
    alert('Browser Push notification broadcast dispatched successfully!');
    setNotifForm({ title: '', body: '', type: 'announcement' });
  };

  // QR Verify
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId) return;

    const reg = registrations.find(r => r.id === ticketId);
    if (!reg) {
      setCheckinMsg({ success: false, text: 'Ticket ID not found in registrations database.' });
      return;
    }

    if (reg.attended) {
      setCheckinMsg({ success: true, text: `Student ${reg.name} is already checked in.` });
      return;
    }

    const updatedReg = { ...reg, attended: true };
    await dbService.updateRegistration(updatedReg);
    
    // Refresh registration list
    const rList = await dbService.getRegistrations();
    setRegistrations(rList);

    setCheckinMsg({ success: true, text: `Successfully checked in ${reg.name} (${reg.regNo})! Certificates are now unlocked.` });
    setTicketId('');
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto relative z-10 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-premium border border-white/10">
            <h3 className="font-space font-bold text-lg text-white mb-1">Admin Centre</h3>
            <span className="text-[10px] font-mono text-cyan-400">Executive Console</span>
          </div>

          <div className="p-3 rounded-2xl glass-premium border border-white/5 flex flex-col gap-1 text-xs sm:text-sm">
            {[
              { id: 'analytics', label: 'Analytics Panel', icon: <BarChart className="w-4.5 h-4.5" /> },
              { id: 'events', label: 'Manage Events', icon: <Calendar className="w-4.5 h-4.5" /> },
              { id: 'team', label: 'Manage Team', icon: <Users className="w-4.5 h-4.5" /> },
              { id: 'broadcast', label: 'Broadcast Panel', icon: <Mail className="w-4.5 h-4.5" /> },
              { id: 'checkin', label: 'Check-In Desk', icon: <QrCode className="w-4.5 h-4.5" /> }
            ].map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => {
                  setActiveTab(tabItem.id as any);
                  setCheckinMsg({ success: false, text: '' });
                }}
                className={`w-full p-3 rounded-xl flex items-center gap-3.5 font-bold transition-all ${
                  activeTab === tabItem.id 
                    ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tabItem.icon}
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-3">
          <div className="p-6 sm:p-8 rounded-2xl glass-premium border border-white/10 min-h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
                <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
                <span>Loading Administrative records...</span>
              </div>
            ) : (
              <>
                {/* 1. Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="font-space font-bold text-2xl text-white mb-2">Club Statistics Overview</h2>
                      <p className="text-xs text-gray-500">Live operational data aggregated from student portals.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                      <div className="p-5 rounded-xl border border-white/5 bg-white/5 flex items-center gap-4">
                        <div className="p-3.5 rounded-lg bg-blue-500/15 text-cyan-400">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">MEMBERS ACTIVE</span>
                          <span className="text-white text-xl font-bold font-space">450 Students</span>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-white/5 bg-white/5 flex items-center gap-4">
                        <div className="p-3.5 rounded-lg bg-purple-500/15 text-purple-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">HACKATHONS & EVENTS</span>
                          <span className="text-white text-xl font-bold font-space">{events.length} Completed</span>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-white/5 bg-white/5 flex items-center gap-4">
                        <div className="p-3.5 rounded-lg bg-cyan-500/15 text-cyan-400">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">EVENT REGISTRATIONS</span>
                          <span className="text-white text-xl font-bold font-space">{registrations.length} Registrations</span>
                        </div>
                      </div>
                    </div>



                    {/* Registrations List */}
                    <div className="border-t border-white/10 pt-6 text-left">
                      <h3 className="font-space font-bold text-lg text-white mb-4">Recent registrations logs</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left text-gray-400">
                          <thead className="bg-white/5 text-gray-300 font-bold uppercase font-mono border-b border-white/10">
                            <tr>
                              <th className="px-4 py-3">Student Name</th>
                              <th className="px-4 py-3">Reg No</th>
                              <th className="px-4 py-3">Mail</th>
                              <th className="px-4 py-3">Attendance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {registrations.slice(-4).map((reg) => (
                              <tr key={reg.id}>
                                <td className="px-4 py-3 font-semibold text-white">{reg.name}</td>
                                <td className="px-4 py-3 font-mono">{reg.regNo}</td>
                                <td className="px-4 py-3">{reg.email}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    reg.attended ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                  }`}>
                                    {reg.attended ? 'Checked In' : 'Absent'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Events CRUD Tab */}
                {activeTab === 'events' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="font-space font-bold text-2xl text-white mb-2">Create IoT Event</h2>
                      <p className="text-xs text-gray-500">Publish new workshops, countdown deadlines, and issue check-in tickets.</p>
                    </div>

                    {/* Creation Form */}
                    <form onSubmit={handleSaveEvent} className="p-5 border border-white/5 bg-white/5 rounded-xl space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Event Title"
                          value={eventForm.title}
                          onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />
                        <input
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <select
                          value={eventForm.type}
                          onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        >
                          <option value="workshop" className="bg-spaceBlack">Workshop</option>
                          <option value="hackathon" className="bg-spaceBlack">Hackathon</option>
                          <option value="bootcamp" className="bg-spaceBlack">Bootcamp</option>
                          <option value="seminar" className="bg-spaceBlack">Seminar</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Location (Lab 305/Virtual)"
                          value={eventForm.location}
                          onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />

                        <input
                          type="number"
                          placeholder="Slots Count"
                          value={eventForm.slots}
                          onChange={(e) => setEventForm(prev => ({ ...prev, slots: Number(e.target.value) }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <textarea
                        placeholder="Detailed event summary..."
                        rows={3}
                        value={eventForm.description}
                        onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                      />

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> Create Event
                      </button>
                    </form>

                    {/* Listing */}
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="font-space font-bold text-lg text-white mb-4">Event Directory</h3>
                      <div className="space-y-3">
                        {events.map((evt) => (
                          <div key={evt.id} className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between gap-4">
                            <div>
                              <h4 className="font-space font-semibold text-white">{evt.title}</h4>
                              <span className="text-[10px] font-mono text-cyan-400 capitalize">{evt.type} • {evt.date}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Team CRUD Tab */}
                {activeTab === 'team' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="font-space font-bold text-2xl text-white mb-2">Manage Panel & Team Members</h2>
                      <p className="text-xs text-gray-500">Insert new Panel officers or Team Leads/Co-Leads.</p>
                    </div>

                    <form onSubmit={handleSaveTeam} className="p-5 border border-white/5 bg-white/5 rounded-xl space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Member Name"
                          value={teamForm.name}
                          onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />
                        <input
                          type="email"
                          placeholder="VIT Email Address"
                          value={teamForm.email}
                          onChange={(e) => setTeamForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Position (e.g. Lead, Co-Lead, President)"
                          value={teamForm.position}
                          onChange={(e) => setTeamForm(prev => ({ ...prev, position: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />
                        <select
                          value={teamForm.teamName}
                          onChange={(e) => setTeamForm(prev => ({ ...prev, teamName: e.target.value as any }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        >
                          <option value="Panel" className="bg-spaceBlack">Executive Panel</option>
                          <option value="Technical" className="bg-spaceBlack">Technical</option>
                          <option value="Design" className="bg-spaceBlack">Design</option>
                          <option value="Content" className="bg-spaceBlack">Content</option>
                          <option value="Media & Photography" className="bg-spaceBlack">Media & Photography</option>
                          <option value="Event Management" className="bg-spaceBlack">Event Management</option>
                          <option value="Social Media" className="bg-spaceBlack">Social Media</option>
                          <option value="PR & Outreach" className="bg-spaceBlack">PR & Outreach</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="LinkedIn URL"
                          value={teamForm.linkedin}
                          onChange={(e) => setTeamForm(prev => ({ ...prev, linkedin: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="GitHub URL (Optional)"
                          value={teamForm.github}
                          onChange={(e) => setTeamForm(prev => ({ ...prev, github: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <textarea
                        placeholder="Short bio description..."
                        rows={2.5}
                        value={teamForm.bio}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                      />

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> Save Member
                      </button>
                    </form>

                    {/* Listing */}
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="font-space font-bold text-lg text-white mb-4">Current Team Directory</h3>
                      <div className="space-y-3">
                        {team.map((m) => (
                          <div key={m.id} className="p-4 rounded-xl border border-white/5 bg-white/5 flex items-center justify-between gap-4">
                            <div>
                              <h4 className="font-space font-semibold text-white">{m.name}</h4>
                              <span className="text-[10px] font-mono text-cyan-400 capitalize">{m.position} • {m.teamName} Team</span>
                            </div>
                            <button
                              onClick={() => handleDeleteTeam(m.id)}
                              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Broadcast Tab */}
                {activeTab === 'broadcast' && (
                  <div className="space-y-10">
                    {/* E-mail broadcasting */}
                    <div>
                      <div className="mb-4">
                        <h2 className="font-space font-bold text-2xl text-white mb-1">Bulk Mail Sender</h2>
                        <p className="text-xs text-gray-500">Dispatch customized messages via SendGrid / Resend client integration.</p>
                      </div>

                      <form onSubmit={handleSendEmail} className="p-5 border border-white/5 bg-white/5 rounded-xl space-y-4 text-xs sm:text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <select
                            value={emailForm.target}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, target: e.target.value }))}
                            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                          >
                            <option value="all" className="bg-spaceBlack">All Verified Members</option>
                            <option value="subscribers" className="bg-spaceBlack">Newsletter Subscribers</option>
                            <option value="cse" className="bg-spaceBlack">Branch: CSE</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Email Subject"
                            value={emailForm.subject}
                            onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                            required
                            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                          />
                        </div>
                        <textarea
                          placeholder="Email body text here..."
                          rows={4}
                          value={emailForm.body}
                          onChange={(e) => setEmailForm(prev => ({ ...prev, body: e.target.value }))}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold flex items-center gap-1.5"
                        >
                          <Mail className="w-4 h-4" /> Send Email Campaign
                        </button>
                      </form>
                    </div>

                    {/* Notification broadcasting */}
                    <div className="border-t border-white/10 pt-6">
                      <div className="mb-4">
                        <h2 className="font-space font-bold text-xl text-white mb-1">Portal Push Announcement</h2>
                        <p className="text-xs text-gray-500">Post notifications visible directly on the Student Dashboard.</p>
                      </div>

                      <form onSubmit={handleSendNotification} className="p-5 border border-white/5 bg-white/5 rounded-xl space-y-4 text-xs sm:text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Announcement Title"
                            value={notifForm.title}
                            onChange={(e) => setNotifForm(prev => ({ ...prev, title: e.target.value }))}
                            required
                            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                          />
                          <select
                            value={notifForm.type}
                            onChange={(e) => setNotifForm(prev => ({ ...prev, type: e.target.value as any }))}
                            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                          >
                            <option value="announcement" className="bg-spaceBlack">General Announcement</option>
                            <option value="event" className="bg-spaceBlack">Event Update</option>
                            <option value="certificate" className="bg-spaceBlack">Certificate Released</option>
                          </select>
                        </div>
                        <textarea
                          placeholder="Notification body summary..."
                          rows={3}
                          value={notifForm.body}
                          onChange={(e) => setNotifForm(prev => ({ ...prev, body: e.target.value }))}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold flex items-center gap-1.5"
                        >
                          <Bell className="w-4 h-4" /> Dispatch Push Alert
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 5. Checkin Desk Tab */}
                {activeTab === 'checkin' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-space font-bold text-2xl text-white mb-2">Event Registration QR Check-in</h2>
                      <p className="text-xs text-gray-500">Scan or input the ticket token identifier to register student attendance.</p>
                    </div>

                    <form onSubmit={handleCheckIn} className="p-5 border border-white/5 bg-white/5 rounded-xl flex gap-3 text-xs sm:text-sm max-w-md">
                      <input
                        type="text"
                        placeholder="Paste Ticket ID (e.g. r-e1-mock-student-uid)"
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                        required
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold shrink-0 flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Verify Ticket
                      </button>
                    </form>

                    {checkinMsg.text && (
                      <div className={`p-4 rounded-xl border text-xs text-left ${
                        checkinMsg.success 
                          ? 'border-green-500/20 bg-green-500/5 text-green-400' 
                          : 'border-red-500/20 bg-red-500/5 text-red-400'
                      }`}>
                        {checkinMsg.text}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default AdminDashboard;
