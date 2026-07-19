import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, Tag, Users, AlertCircle, ArrowUpRight, Cpu } from 'lucide-react';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { IoTEvent } from '../types';

export const Events: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<IoTEvent[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);
  const [regStatus, setRegStatus] = useState<{ [key: string]: 'idle' | 'registering' | 'success' | 'error' }>({});
  const [errMsg, setErrMsg] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const list = await dbService.getEvents();
        setEvents(list);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setRegStatus(prev => ({ ...prev, [eventId]: 'registering' }));
    try {
      await dbService.registerForEvent(eventId, user);
      setRegStatus(prev => ({ ...prev, [eventId]: 'success' }));
      // Reload events to update count
      const updated = await dbService.getEvents();
      setEvents(updated);
    } catch (err: any) {
      setRegStatus(prev => ({ ...prev, [eventId]: 'error' }));
      setErrMsg(prev => ({ ...prev, [eventId]: err.message || 'Already registered!' }));
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                          e.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'all' || e.type === filterType;
    const matchesTab = e.status === tab;
    return matchesSearch && matchesFilter && matchesTab;
  });

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Header */}
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">ACTIVITIES & SESSIONS</span>
          <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2">IoT Club Events</h1>
        </div>
        
        {/* Toggle tab */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl self-center md:self-end">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
              tab === 'upcoming' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
              tab === 'past' ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Past Events
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex gap-2 self-start sm:self-center">
          {['all', 'workshop', 'hackathon', 'bootcamp', 'seminar'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                filterType === t 
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' 
                  : 'border-white/5 bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Events Listing */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Syncing events directory...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5">
          <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 font-medium">No events found matching current criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((evt) => (
            <div 
              key={evt.id} 
              className="rounded-2xl glass-premium border border-white/10 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-48 w-full overflow-hidden relative bg-black/40">
                <img 
                  src={evt.image} 
                  alt={evt.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-semibold bg-spaceBlack/80 text-cyan-400 border border-white/10 capitalize">
                  {evt.type}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col text-left">
                <h3 className="font-space font-bold text-lg text-white mb-2 line-clamp-1">{evt.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-5 line-clamp-3">{evt.description}</p>
                
                {/* Meta details */}
                <div className="space-y-2 mb-6 text-xs text-gray-300 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    {evt.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    {evt.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    {evt.registeredCount || 0} Registered / {evt.slots} Slots
                  </div>
                </div>

                {/* Actions */}
                {tab === 'upcoming' ? (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRegister(evt.id)}
                      disabled={regStatus[evt.id] === 'registering' || regStatus[evt.id] === 'success' || evt.registeredCount >= evt.slots}
                      className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                        regStatus[evt.id] === 'success'
                          ? 'bg-green-600/20 border border-green-500/40 text-green-400 cursor-default'
                          : evt.registeredCount >= evt.slots
                          ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95'
                      }`}
                    >
                      {regStatus[evt.id] === 'registering' ? 'Registering...' :
                       regStatus[evt.id] === 'success' ? 'Registered Successfully!' :
                       evt.registeredCount >= evt.slots ? 'House Full' : 'Register Now'}
                    </button>
                    {regStatus[evt.id] === 'error' && (
                      <p className="text-[10px] text-red-400 mt-1 text-center font-medium">
                        {errMsg[evt.id] || 'Could not complete registration'}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {evt.certificateEnabled && user && (
                      <button 
                        onClick={() => navigate('/student/profile')}
                        className="w-full py-2 text-xs font-bold text-center rounded-xl glass border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors flex items-center justify-center gap-1"
                      >
                        Get Certificate
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Events;
