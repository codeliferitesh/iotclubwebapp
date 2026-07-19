import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Cpu, Search, AlertCircle } from 'lucide-react';
import { dbService } from '../services/db';
import { ProjectItem } from '../types';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const list = await dbService.getProjects();
        setProjects(list);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Accumulate all tags
  const allTags = ['all'];
  projects.forEach(p => {
    p.tags.forEach(t => {
      if (!allTags.includes(t)) allTags.push(t);
    });
  });

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = filterTag === 'all' || p.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">HARDWARE & SOFTWARE PORTFOLIO</span>
        <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2 mb-6">Club Projects</h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed">
          Explore complete, functional prototypes engineered by club members. Includes circuit wiring files, telemetry backends, and firmware code.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex flex-wrap gap-2 max-w-xl justify-start sm:justify-end">
          {allTags.slice(0, 6).map((t) => (
            <button
              key={t}
              onClick={() => setFilterTag(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                filterTag === t 
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' 
                  : 'border-white/5 bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Retrieving blueprints...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5">
          <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 font-medium">No projects found matching filter tags.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((proj) => (
            <div 
              key={proj.id} 
              className="rounded-2xl glass-premium border border-white/10 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className="h-56 w-full overflow-hidden relative bg-black/40">
                <img 
                  src={proj.image} 
                  alt={proj.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-semibold bg-spaceBlack/80 text-cyan-400 border border-white/10">
                  {proj.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-space font-bold text-xl text-white mb-2">{proj.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 flex-1">{proj.description}</p>
                
                {/* Contributors */}
                <div className="mb-4">
                  <span className="text-[10px] text-gray-500 block uppercase font-mono mb-1.5">CONTRIBUTORS</span>
                  <div className="text-xs text-gray-300 font-semibold">
                    {proj.teamMembers.join(', ')}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {proj.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400">{t}</span>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-4 mt-auto">
                  <a 
                    href={proj.githubUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs font-bold text-white hover:text-cyan-400 flex items-center gap-1.5"
                  >
                    <Github className="w-4 h-4" /> Source Code
                  </a>
                  {proj.liveUrl && (
                    <a 
                      href={proj.liveUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1.5"
                    >
                      Live Demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Projects;
