import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  Cpu, Zap, Award, Globe, Rocket, ShieldCheck, ArrowUpRight, 
  ChevronRight, Calendar, Users, Briefcase, Sparkles, MapPin, 
  Layers, Instagram, Linkedin, Github, Youtube, MessageSquare, PhoneCall
} from 'lucide-react';
import { dbService } from '../services/db';
import { IoTEvent, ProjectItem, TeamMember } from '../types';

export const Home: React.FC = () => {
  const [events, setEvents] = useState<IoTEvent[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [panel, setPanel] = useState<TeamMember[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const evList = await dbService.getEvents();
        setEvents(evList.filter(e => e.status === 'upcoming'));
        
        const projList = await dbService.getProjects();
        setProjects(projList.slice(0, 2));

        const teamList = await dbService.getTeam();
        setPanel(teamList.filter(m => m.teamName === 'Panel'));
      } catch (err) {
        console.error('Error fetching landing data:', err);
      }
    };
    fetchData();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (events.length === 0) return;
    
    // Find closest upcoming event
    const closestEvent = events[0];
    const targetDate = new Date(closestEvent.countdownTarget).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub) return;
    try {
      await dbService.subscribeNewsletter(emailSub);
      setSubscribed(true);
      setEmailSub('');
    } catch (err) {
      alert('Already subscribed or invalid email');
    }
  };

  const domains = [
    { name: 'Internet of Things (IoT)', desc: 'Sensor networks, smart nodes, gateway configurations, and telemetry architectures.', icon: <Cpu className="w-6 h-6 text-blue-400" /> },
    { name: 'Embedded Systems & Electronics', desc: 'ESP32, Arduino, Raspberry Pi, circuit routing, and high-quality PCB fabrication.', icon: <Layers className="w-6 h-6 text-cyan-400" /> },
    { name: 'Robotics & Automation', desc: 'Lidar mapping, sensor fusion, servo actuators, and automated smart rovers.', icon: <Zap className="w-6 h-6 text-purple-400" /> },
    { name: 'Edge AI & Cloud IoT', desc: 'TinyML on microcontrollers, sensor anomaly detection, MQTT data streams, and Grafana grids.', icon: <Sparkles className="w-6 h-6 text-indigo-400" /> }
  ];

  const stats = [
    { label: 'Verified Members', value: 50, suffix: '+' },
    { label: 'Conducted Events', value: 5, suffix: '+' },
    { label: 'Completed Projects', value: 5, suffix: '' },
    { label: 'Technical Blogs', value: 10, suffix: '' },
    { label: 'Learning Resources', value: 100, suffix: '+' }
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Dynamic Animated Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000 pointer-events-none" />

      {/* ==========================================
          HERO SECTION
          ========================================== */}
      <section className="relative min-height-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center z-10">
        <div className="aurora-bg" />
        


        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-space font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.1] mb-6 max-w-4xl text-white tracking-tight"
        >
          Connecting Hardware <br className="hidden sm:inline" />
          With <span className="title-gradient">Infinite Intelligence</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-gray-400 leading-relaxed max-w-2xl mb-10"
        >
          The official tech-hub for IoT, hardware prototyping, robotics, and smart edge engineering at VIT Bhopal University.
        </motion.p>

        {/* Call to Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 items-center mb-16"
        >
          <Link
            to="/projects"
            className="w-full sm:w-auto px-8 py-4 font-bold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Explore Projects
            <Briefcase className="w-4 h-4" />
          </Link>
          <Link
            to="/domains"
            className="w-full sm:w-auto px-8 py-4 font-bold rounded-xl glass border border-white/10 text-white hover:bg-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Focus Domains
            <Cpu className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Visual Showcase (3D-like Glowing IoT Board mockup) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl rounded-2xl glass-premium border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
            <div>
              <h3 className="font-space font-bold text-2xl text-white mb-4 flex items-center gap-2">
                <Cpu className="text-cyan-400 animate-pulse" />
                IoT Lab Prototyping
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                From microcontrollers reading raw environmental sensors to edge inference models executing routing logic locally. We host code tutorials, solder custom nodes, and wire gateways.
              </p>
              <ul className="text-xs space-y-2.5 text-gray-300">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  VIT Bhopal University Accredited
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Weekly hands-on labs and hardware distribution
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  National-level hackathons and expert sessions
                </li>
              </ul>
            </div>
            {/* Visual simulation of ESP32 chip */}
            <div className="h-64 rounded-xl border border-white/5 bg-black/40 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <div className="w-48 h-48 rounded-full bg-cyan-500/10 blur-2xl animate-pulse" />
              
              <div className="relative glass border border-white/10 p-6 rounded-2xl w-56 flex flex-col items-center">
                <Cpu className="w-10 h-10 text-cyan-400 mb-4 animate-bounce" />
                <span className="text-xs font-mono text-cyan-400 mb-1">ESP32-WROOM-32E</span>
                <span className="text-[10px] font-mono text-gray-500">Wi-Fi + BLE MCU</span>
                
                {/* Circuit paths lines in SVG */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-400/20" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-blue-500/20" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          STATISTICS COUNTER SECTION
          ========================================== */}
      <section className="relative py-16 border-y border-white/10 bg-black/20 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <h2 className="font-space font-extrabold text-3xl sm:text-5xl text-white mb-2">
                <CountUp end={stat.value} duration={3.5} />
                <span className="text-cyan-400">{stat.suffix}</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          UPCOMING EVENTS / COUNTDOWN
          ========================================== */}
      {events.length > 0 && (
        <section className="relative py-20 px-6 max-w-7xl mx-auto z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">COUNTDOWN</span>
              <h2 className="font-space font-bold text-3xl sm:text-4xl text-white mt-1">Upcoming Event</h2>
            </div>
            <Link to="/events" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View All Events <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-2xl glass-premium border border-white/10 p-6 md:p-10 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
            {/* Event Details */}
            <div className="flex-1 text-left">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 border border-blue-500/20 text-cyan-400 mb-4 capitalize">
                {events[0].type}
              </span>
              <h3 className="font-space font-bold text-2xl sm:text-3xl text-white mb-4">
                {events[0].title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                {events[0].description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs text-gray-300 mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  {events[0].date}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {events[0].location}
                </div>
              </div>

              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                Register & Secure Slot
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Countdown widget */}
            <div className="w-full lg:w-96 p-6 rounded-xl border border-white/10 bg-black/40 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Registration Closes In</span>
              
              <div className="grid grid-cols-4 gap-3 text-center mb-6">
                <div className="bg-white/5 border border-white/5 rounded-xl px-2 py-3 w-16 sm:w-20">
                  <span className="font-space font-bold text-2xl sm:text-3xl text-cyan-400 block">{timeLeft.days}</span>
                  <span className="text-[10px] text-gray-500 block uppercase font-mono">Days</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl px-2 py-3 w-16 sm:w-20">
                  <span className="font-space font-bold text-2xl sm:text-3xl text-cyan-400 block">{timeLeft.hours}</span>
                  <span className="text-[10px] text-gray-500 block uppercase font-mono">Hours</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl px-2 py-3 w-16 sm:w-20">
                  <span className="font-space font-bold text-2xl sm:text-3xl text-cyan-400 block">{timeLeft.minutes}</span>
                  <span className="text-[10px] text-gray-500 block uppercase font-mono">Mins</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl px-2 py-3 w-16 sm:w-20">
                  <span className="font-space font-bold text-2xl sm:text-3xl text-cyan-400 block">{timeLeft.seconds}</span>
                  <span className="text-[10px] text-gray-500 block uppercase font-mono">Secs</span>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 font-mono">
                {events[0].slots - events[0].registeredCount} slots remaining of {events[0].slots} slots.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==========================================
          DOMAINS SECTION
          ========================================== */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto z-10 text-center">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">TECHNICAL PATHS</span>
        <h2 className="font-space font-bold text-3xl sm:text-5xl text-white mt-2 mb-4">Core Focus Domains</h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto mb-16">
          We operate across diverse verticals, helping students build multi-disciplinary technical portfolios.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {domains.map((dom) => (
            <div key={dom.name} className="p-6 rounded-2xl glass-premium border border-white/10 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {dom.icon}
              </div>
              <div>
                <h3 className="font-space font-bold text-lg text-white mb-2">{dom.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{dom.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10">
          <Link
            to="/domains"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Explore Detailed Roadmaps & Learning Tools
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ==========================================
          FEATURED PROJECTS SECTION
          ========================================== */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">INNOVATIONS</span>
            <h2 className="font-space font-bold text-3xl sm:text-4xl text-white mt-1">Featured Club Projects</h2>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            Browse Portfolios <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => (
            <div key={proj.title} className="rounded-2xl glass-premium border border-white/10 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300">
              <div className="h-56 w-full overflow-hidden relative">
                <img 
                  src={proj.image} 
                  alt={proj.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-semibold bg-spaceBlack/80 text-cyan-400 border border-white/10">
                  {proj.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col text-left">
                <h3 className="font-space font-bold text-xl text-white mb-2">{proj.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 flex-1">{proj.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {proj.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400">{t}</span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4">
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-white hover:text-cyan-400 flex items-center gap-1.5">
                    <Github className="w-4 h-4" /> Source
                  </a>
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1.5">
                      Live Dashboard <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          CONNECT WITH US (SOCIAL MEDIA SECTION)
          ========================================== */}
      <section className="relative py-20 px-6 max-w-7xl mx-auto z-10 text-center border-t border-white/10">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">COMMUNITY NETWORK</span>
        <h2 className="font-space font-bold text-3xl sm:text-5xl text-white mt-2 mb-4">Stay Connected With IoT Club</h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto mb-16">
          Join our growing community and follow our journey on multiple channels.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Instagram */}
          <a
            href="https://www.instagram.com/iotclub_vitbhopal?igsh=MTF4cHUwem00bDNzaQ=="
            target="_blank"
            rel="noreferrer"
            className="p-8 rounded-3xl glass-premium border border-pink-500/10 flex flex-col items-center justify-between gap-6 group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-pink-500/10 hover:border-pink-500/40 transition-all duration-500 relative overflow-hidden block"
          >
            {/* Ambient behind-glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500 text-white shadow-xl shadow-pink-500/20 group-hover:scale-110 transition-transform duration-500">
                <Instagram className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="font-space font-bold text-xl text-white">Instagram</h3>
                  {/* Verified Blue Badge */}
                  <svg className="w-4 h-4 text-blue-400 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-xs font-mono text-pink-400">@iotclub_vitbhopal</span>
              </div>
              
              <p className="text-xs text-gray-400 leading-relaxed mt-2">
                Check out our hardware prototypes, workshop memories, and campus build showcases.
              </p>
            </div>

            <span className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 group-hover:shadow-lg group-hover:shadow-pink-500/20 transition-all flex items-center justify-center gap-1.5">
              Follow Us
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </a>

          {/* Card 2: WhatsApp Channel */}
          <a
            href="https://whatsapp.com/channel/0029Vb8lbZ05PO1AAvthYj3P"
            target="_blank"
            rel="noreferrer"
            className="p-8 rounded-3xl glass-premium border border-green-500/10 flex flex-col items-center justify-between gap-6 group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-500/40 transition-all duration-500 relative overflow-hidden block"
          >
            {/* Ambient behind-glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-2xl bg-green-600 text-white shadow-xl shadow-green-500/20 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.437.002 9.861-4.416 9.864-9.863.002-2.638-1.023-5.117-2.884-6.98-1.862-1.864-4.343-2.89-6.984-2.892-5.445 0-9.877 4.417-9.88 9.865-.001 1.748.459 3.4 1.331 4.793l-.973 3.55 3.63-.952zm10.29-6.495c-.292-.146-1.727-.853-1.993-.95-.266-.097-.46-.146-.653.146-.193.291-.748.95-.917 1.144-.169.194-.338.219-.63.072-1.295-.648-2.133-1.156-2.986-2.62-.22-.377.22-.349.63-1.173.069-.146.035-.272-.017-.379-.052-.107-.46-1.11-.63-1.524-.166-.399-.334-.345-.46-.352-.12-.006-.256-.008-.393-.008-.137 0-.36.051-.55.257-.19.206-.723.707-.723 1.724 0 1.017.739 2.002.84 2.141.101.14 1.455 2.222 3.524 3.116.492.213.876.34 1.176.435.495.158.946.135 1.302.083.397-.058 1.728-.707 1.974-1.39.246-.684.246-1.272.172-1.392-.072-.12-.266-.194-.558-.34z" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="font-space font-bold text-xl text-white">WhatsApp</h3>
                  {/* Verified Blue Badge */}
                  <svg className="w-4 h-4 text-blue-400 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-xs font-mono text-green-400">VIT BHOPAL UNIVERSITY</span>
              </div>
              
              <p className="text-xs text-gray-400 leading-relaxed mt-2">
                Get instant workshop announcements, registration alerts, and official club circulars on your phone.
              </p>
            </div>

            <span className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 group-hover:shadow-lg group-hover:shadow-green-500/20 transition-all flex items-center justify-center gap-1.5">
              Join Channel
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </a>

          {/* Card 3: LinkedIn */}
          <a
            href="https://www.linkedin.com/company/iot-club-vitb/posts/?feedView=all"
            target="_blank"
            rel="noreferrer"
            className="p-8 rounded-3xl glass-premium border border-blue-500/10 flex flex-col items-center justify-between gap-6 group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/40 transition-all duration-500 relative overflow-hidden block"
          >
            {/* Ambient behind-glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <Linkedin className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="font-space font-bold text-xl text-white">LinkedIn</h3>
                  {/* Verified Blue Badge */}
                  <svg className="w-4 h-4 text-blue-400 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-xs font-mono text-cyan-400">IoT Club, VIT Bhopal</span>
              </div>
              
              <p className="text-xs text-gray-400 leading-relaxed mt-2">
                Follow our official corporate alignments, guest lectures, recruitment posts, and achievements.
              </p>
            </div>

            <span className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5">
              Connect With Us
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </a>
        </div>
      </section>

      {/* ==========================================
          NEWSLETTER & CTA
          ========================================== */}
      <section className="relative py-24 px-6 max-w-5xl mx-auto z-10 text-center">
        <div className="rounded-3xl glass-premium border border-white/10 p-8 md:p-16 shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-purple-500/5" />
          
          <h2 className="font-space font-bold text-3xl sm:text-4xl text-white mb-4 relative z-10">
            See What We Are Building
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mb-10 relative z-10 leading-relaxed">
            Follow our hardware developments and subscribe to receive notifications, telemetry dashboard metrics, and release alerts for layout schematics.
          </p>

          <form onSubmit={handleSubscribe} className="relative z-10 w-full max-w-md flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter VIT Bhopal Email"
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              required
              className="flex-1 px-5 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="submit"
              className="px-6 py-3 font-bold text-sm text-white rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 whitespace-nowrap active:scale-95 transition-all"
            >
              Get Updates
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-green-400 mt-3 relative z-10">Subscribed successfully! Welcome onboard.</p>
          )}
        </div>
      </section>
    </div>
  );
};
export default Home;
