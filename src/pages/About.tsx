import React from 'react';
import { ShieldCheck, Target, Award, Milestone, Calendar, Cpu } from 'lucide-react';

export const About: React.FC = () => {
  const roadmap = [
    { year: '2023', title: 'Club Inauguration', desc: 'IoT Club VIT Bhopal was officially approved with 50 founding members. Conducted first hardware soldering bootcamp.' },
    { year: '2024', title: 'LoRaWAN Campus Grid', desc: 'Designed and deployed custom telemetry nodes tracking air quality across main blocks. Membership grew to 200+ students.' },
    { year: '2025', title: 'National Hackathon Success', desc: 'Hosted our first inter-university hardware-software hackathon. Club teams won multiple regional awards.' },
    { year: '2026', title: 'Enterprise Portal Launch', desc: 'Developed custom student/admin dashboard tracking event attendance, certificates, and component distribution.' }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Page Header */}
      <div className="mb-16 text-center md:text-left">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">WHO WE ARE</span>
        <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2 mb-6">About IoT Club</h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed">
          The IoT Club at VIT Bhopal University is a student-run technical organization dedicated to cultivating expertise in hardware prototyping, embedded computing, sensor networking, and cyber-physical security.
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-2xl glass-premium border border-white/10 flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 w-12 h-12 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="font-space font-bold text-2xl text-white">Our Vision</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            To build a vibrant ecosystem of hardware engineers and software developers who collaborate to build smart systems that solve environmental, operational, and commercial challenges.
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-premium border border-white/10 flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-12 h-12 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-space font-bold text-2xl text-white">Our Mission</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            To supply students with microcontrollers, tools, and testing benches; hold training bootcamps; support prototyping; and link members to leading experts in IoT and Edge AI.
          </p>
        </div>
      </div>

      {/* Faculty Message */}
      <div className="rounded-2xl glass-premium border border-white/10 p-8 md:p-12 mb-20 flex flex-col md:flex-row items-center gap-8">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
          alt="Faculty Coordinator"
          className="w-24 h-24 rounded-full object-cover border border-white/10"
        />
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">FACULTY COORDINATOR MESSAGE</span>
          <h3 className="font-space font-bold text-2xl text-white mb-2">Prof. M. K. Nair</h3>
          <p className="text-sm text-gray-400 leading-relaxed italic mb-4">
            "The rapid convergence of embedded hardware and cloud compute calls for engineers who are comfortable building in both domains. The IoT Club offers students the exact sandbox needed to bridge these worlds and innovate."
          </p>
          <span className="text-xs font-semibold text-gray-500">School of Computing Science and Engineering, VIT Bhopal</span>
        </div>
      </div>

      {/* Core Objectives */}
      <div className="mb-20">
        <h2 className="font-space font-bold text-3xl text-white mb-8 text-center md:text-left">Club Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Practical Learning', desc: 'Move beyond slide decks. We configure nodes, wire shields, solder circuits, and write firmware.' },
            { title: 'Collaboration', desc: 'Pair hardware designers with web builders and cloud architects to form cross-functional groups.' },
            { title: 'Industry Linkage', desc: 'Secure industry sponsorships, organize technical lectures, and prepare students for core IoT roles.' }
          ].map((obj, i) => (
            <div key={i} className="p-6 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-3">
              <span className="text-cyan-400 font-space font-bold text-lg">0{i+1}.</span>
              <h4 className="font-space font-bold text-lg text-white">{obj.title}</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline / Roadmap */}
      <div>
        <h2 className="font-space font-bold text-3xl text-white mb-12 text-center">Our Timeline</h2>
        <div className="relative pl-6 sm:pl-8 border-l border-white/10 max-w-4xl mx-auto flex flex-col gap-10">
          {roadmap.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-cyan-400 border-4 border-spaceBlack" />
              
              <div className="p-6 rounded-xl glass border border-white/5">
                <span className="text-xs font-mono text-cyan-400 block mb-1">{item.year}</span>
                <h4 className="font-space font-bold text-lg text-white mb-2">{item.title}</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default About;
