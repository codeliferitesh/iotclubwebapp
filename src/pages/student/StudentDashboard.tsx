import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, FileText, Bell, LogOut, Cpu, 
  Plus, X, QrCode, CheckCircle, ShieldAlert, BookOpen 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/db';
import { IoTEvent, EventRegistration, ResourceItem, Announcement } from '../../types';

export const StudentDashboard: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'events' | 'resources' | 'notifications'>('profile');
  
  // States
  const [allEvents, setAllEvents] = useState<IoTEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [notifications, setNotifications] = useState<Announcement[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);

  // QR Modal
  const [showQR, setShowQR] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const evList = await dbService.getEvents();
        setAllEvents(evList);

        const regList = await dbService.getRegistrations();
        setRegistrations(regList.filter(r => r.userId === user.uid));

        const resList = await dbService.getResources();
        setResources(resList);

        const notifList = await dbService.getNotifications();
        setNotifications(notifList);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !user) return;
    
    const skills = [...(user.skills || [])];
    if (!skills.includes(newSkill.trim())) {
      skills.push(newSkill.trim());
      await updateProfile({ skills });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = async (skill: string) => {
    if (!user) return;
    const skills = user.skills.filter(s => s !== skill);
    await updateProfile({ skills });
  };

  const getEventName = (id: string) => {
    const ev = allEvents.find(e => e.id === id);
    return ev ? ev.title : 'Club Session';
  };

  const getEventDate = (id: string) => {
    const ev = allEvents.find(e => e.id === id);
    return ev ? ev.date : '';
  };

  if (!user) return null;

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto relative z-10 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ==========================================
            SIDEBAR NAVIGATION
            ========================================== */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-premium border border-white/10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-cyan-400 bg-white/5 flex items-center justify-center">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-cyan-400" />
              )}
            </div>
            
            <h3 className="font-space font-bold text-lg text-white mb-1">{user.name}</h3>
            <span className="text-[10px] font-mono text-gray-500 block mb-3">{user.regNo}</span>

            {/* Verification Status */}
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
              user.membershipStatus === 'approved' || user.membershipStatus === 'active'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 animate-pulse'
            }`}>
              {user.membershipStatus === 'approved' || user.membershipStatus === 'active' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified Member
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Verification Pending
                </>
              )}
            </div>
          </div>

          {/* Menu Options */}
          <div className="p-3 rounded-2xl glass-premium border border-white/5 flex flex-col gap-1 text-xs sm:text-sm">
            {[
              { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
              { id: 'events', label: 'Registered Events', icon: <Calendar className="w-4 h-4" /> },
              { id: 'resources', label: 'Resources Library', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> }
            ].map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id as any)}
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

            <button
              onClick={handleLogout}
              className="w-full p-3 rounded-xl flex items-center gap-3.5 font-bold text-red-500 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-4"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* ==========================================
            CONTENT PANEL
            ========================================== */}
        <div className="lg:col-span-3">
          <div className="p-6 sm:p-8 rounded-2xl glass-premium border border-white/10 min-h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
                <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
                <span>Loading your records...</span>
              </div>
            ) : (
              <>
                {/* 1. Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="font-space font-bold text-2xl text-white mb-2">Student Information</h2>
                      <p className="text-xs text-gray-500">Academic parameters pulled from registration portal.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">BRANCH</span>
                        <span className="text-white font-semibold">{user.branch}</span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">ACADEMIC YEAR</span>
                        <span className="text-white font-semibold">{user.year}</span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">UNIVERSITY EMAIL</span>
                        <span className="text-white font-semibold">{user.email}</span>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">MEMBERSHIP SINCE</span>
                        <span className="text-white font-semibold">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Skill Tags Manager */}
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="font-space font-bold text-lg text-white mb-4">My Prototyping Skills</h3>
                      
                      <div className="flex flex-wrap gap-2.5 mb-4">
                        {(!user.skills || user.skills.length === 0) ? (
                          <span className="text-xs text-gray-500">No skills added yet. Let other builders know your focus area!</span>
                        ) : (
                          user.skills.map((skill) => (
                            <span 
                              key={skill} 
                              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center gap-1.5"
                            >
                              {skill}
                              <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>

                      <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm">
                        <input
                          type="text"
                          placeholder="e.g. Arduino, KiCad, ROS, MQTT"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-white hover:bg-cyan-600 flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 2. Registered Events Tab */}
                {activeTab === 'events' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-space font-bold text-2xl text-white mb-2">My Registered Sessions</h2>
                      <p className="text-xs text-gray-500">Present this QR code at the physical venue for attendance check-in.</p>
                    </div>

                    {registrations.length === 0 ? (
                      <div className="text-center py-16 border border-white/5 rounded-2xl bg-white/5 text-gray-500">
                        You have not registered for any upcoming events yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {registrations.map((reg) => (
                          <div 
                            key={reg.id} 
                            className="p-5 rounded-xl border border-white/5 bg-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left"
                          >
                            <div>
                              <h4 className="font-space font-bold text-base text-white">{getEventName(reg.eventId)}</h4>
                              <span className="text-[10px] font-mono text-cyan-400 block mt-1">{getEventDate(reg.eventId)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* QR Code trigger */}
                              <button
                                onClick={() => setShowQR(reg.id)}
                                className="px-4.5 py-2 rounded-xl text-xs font-bold glass border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-1.5"
                              >
                                <QrCode className="w-4 h-4" /> View Ticket QR
                              </button>

                              {/* Certificate download */}
                              {reg.attended ? (
                                <a
                                  href={`/assets/certificate_mock.pdf`}
                                  download
                                  className="px-4.5 py-2 rounded-xl text-xs font-bold bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-1"
                                >
                                  Download Certificate
                                </a>
                              ) : (
                                <span className="text-[10px] text-gray-500 font-mono px-3 py-2 bg-white/5 border border-white/5 rounded-xl select-none">
                                  Check-in pending
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Resources Library Tab */}
                {activeTab === 'resources' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-space font-bold text-2xl text-white mb-2">Member Resources</h2>
                      <p className="text-xs text-gray-500">Exclusive PDF guides and cheatsheets prepared for you.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {resources.map((res) => (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-5 rounded-xl border border-white/5 bg-white/5 hover:border-cyan-500/30 transition-all flex flex-col text-left"
                        >
                          <span className="text-[10px] font-mono text-cyan-400 block mb-1">{res.category}</span>
                          <h4 className="font-space font-bold text-sm text-white mb-1.5">{res.title}</h4>
                          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{res.description}</p>
                          <span className="text-xs text-white underline font-bold mt-auto">Download Guide</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-space font-bold text-2xl text-white mb-2">Broadcast Notices</h2>
                      <p className="text-xs text-gray-500">Announcements broadcasted by Executive Leads.</p>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="text-center py-16 border border-white/5 rounded-2xl bg-white/5 text-gray-500">
                        No announcements log found.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className="p-5 rounded-xl border border-white/5 bg-white/5 text-left"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 capitalize">
                                {notif.type}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="font-space font-bold text-base text-white mb-1.5">{notif.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">{notif.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      {/* QR Lightbox overlay */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-premium border border-white/10 rounded-2xl p-6 relative flex flex-col items-center">
            <button 
              onClick={() => setShowQR(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-space font-bold text-lg text-white mb-2 mt-4 text-center">Check-In Ticket</h3>
            <p className="text-xs text-gray-400 text-center mb-6">Scan this QR code at the registration desk.</p>

            {/* Generated Mock QR using raw styling */}
            <div className="p-4 rounded-xl bg-white border border-white/10 w-44 h-44 flex items-center justify-center relative shadow-lg shadow-cyan-500/10">
              <QrCode className="w-full h-full text-spaceBlack" />
            </div>

            <span className="font-mono text-xs text-gray-500 mt-4 select-all block text-center">
              TICKET ID: {showQR}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentDashboard;
