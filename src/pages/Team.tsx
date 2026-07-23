import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, Cpu, AlertCircle } from 'lucide-react';
import { dbService } from '../services/db';
import { TeamMember } from '../types';

export const Team: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const list = await dbService.getTeam();
        setTeam(list);
      } catch (err) {
        console.error('Error fetching team directory:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Filter for Leads view (only positions of leadership)
  const leads = team.filter(m => 
    ['President', 'Vice-President', 'Chairperson', 'Joint Secretary', 'Lead', 'Co-Lead'].includes(m.position)
  );
  
  const panelLeads = leads.filter(m => m.teamName === 'Panel');
  
  // Group leads by their team name
  const teamLeadsGrouped: { [key: string]: TeamMember[] } = {};
  leads.forEach(m => {
    if (m.teamName === 'Panel') return;
    if (!teamLeadsGrouped[m.teamName]) {
      teamLeadsGrouped[m.teamName] = [];
    }
    teamLeadsGrouped[m.teamName].push(m);
  });

  const renderCard = (member: TeamMember) => (
    <div 
      key={member.id} 
      className="p-6 rounded-2xl glass-premium border border-white/5 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 flex flex-col items-center text-center group"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-cyan-400/50 transition-colors">
        <img 
          src={member.photoUrl} 
          alt={member.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-space font-bold text-lg text-white mb-1">{member.name}</h3>
      <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full mb-3">
        {member.position}
      </span>
      <p className="text-xs text-gray-400 leading-relaxed mb-5 min-h-[40px]">
        {member.bio}
      </p>
      
      {/* Social links */}
      <div className="flex items-center gap-3.5 mt-auto">
        <a 
          href={`mailto:${member.email}`} 
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          title="Send Email"
        >
          <Mail className="w-4 h-4" />
        </a>
        <a 
          href={member.linkedin} 
          target="_blank" 
          rel="noreferrer" 
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          title="LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </a>
        {member.github && (
          <a 
            href={member.github} 
            target="_blank" 
            rel="noreferrer" 
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Header */}
      <div className="mb-16 text-center md:text-left">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">THE DIRECTORY</span>
        <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2 mb-6">Meet the Team</h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed">
          The builders, leaders, and coordinators driving technical excellence and organizing campus initiatives at VIT Bhopal.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Synchronizing team directory...</span>
        </div>
      ) : team.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5">
          <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 font-medium">No team members configured in database.</p>
        </div>
      ) : (
        <div className="space-y-20">
          {/* Executive Panel Leads */}
          {panelLeads.length > 0 && (
            <div>
              <h2 className="font-space font-bold text-2xl sm:text-3xl text-white mb-8 border-b border-white/10 pb-3">
                Executive Panel
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {panelLeads.map((m) => renderCard(m))}
              </div>
            </div>
          )}

          {/* Grouped Sub-Team Leads */}
          {Object.keys(teamLeadsGrouped).map((teamName) => {
            const leadsList = teamLeadsGrouped[teamName];
            if (leadsList.length === 0) return null;
            return (
              <div key={teamName}>
                <h2 className="font-space font-bold text-2xl text-white mb-8 border-b border-white/10 pb-3">
                  {teamName} Leads
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {leadsList.map((m) => renderCard(m))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default Team;
