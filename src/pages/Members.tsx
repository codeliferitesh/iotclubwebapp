import React, { useState, useEffect } from 'react';
import { Cpu, AlertCircle, Search, Layers, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService } from '../services/db';
import { TeamMember } from '../types';

export const Members: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  // Group all members for Directory view (includes all roles, no sensitive info)
  const allTeamsGrouped: { [key: string]: TeamMember[] } = {};
  const sortedTeamNames = [
    'Panel', 
    'Technical', 
    'Design', 
    'Event Management', 
    'Content', 
    'Media & Photography', 
    'Social Media', 
    'PR & Outreach'
  ];
  
  sortedTeamNames.forEach(name => {
    allTeamsGrouped[name] = [];
  });

  team.forEach(m => {
    if (allTeamsGrouped[m.teamName]) {
      allTeamsGrouped[m.teamName].push(m);
    } else {
      allTeamsGrouped[m.teamName] = [m];
    }
  });

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring' as const, 
        stiffness: 120, 
        damping: 15 
      } 
    }
  } as const;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Header */}
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">CLUB DIRECTORY</span>
          <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2 mb-4">Our Members</h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl leading-relaxed">
            The full student roster and department listings of the IoT Club. Click to copy coordinate details.
          </p>
        </div>

        {/* Search filter */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search member name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Synchronizing member roster...</span>
        </div>
      ) : team.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5">
          <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 font-medium">No members found.</p>
        </div>
      ) : (
        /* Full Club Directory Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedTeamNames.map((teamName) => {
            let members = allTeamsGrouped[teamName] || [];
            
            // Apply search filter
            if (search) {
              members = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
            }

            if (members.length === 0) return null;
            
            const displayTeamName = teamName === 'Panel' ? 'Executive Panel' : `${teamName} Team`;

            return (
              <motion.div 
                key={teamName}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="p-6 rounded-2xl glass-premium border border-white/5 bg-white/[0.01] hover:border-cyan-500/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-space font-bold text-lg text-cyan-400 border-b border-white/10 pb-2.5 mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" /> {displayTeamName}
                  </h3>
                  
                  <motion.ul 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    {members
                      .sort((a, b) => a.order - b.order)
                      .map((member) => (
                        <motion.li 
                          key={member.id}
                          variants={itemVariants}
                          className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] px-2 rounded-lg transition-colors gap-2"
                        >
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-semibold text-white">{member.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1 mt-0.5 select-all">
                              <Mail className="w-3 h-3 text-cyan-500/60" /> {member.email}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded-md self-start sm:self-auto">
                            {member.position}
                          </span>
                        </motion.li>
                      ))}
                  </motion.ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Members;
