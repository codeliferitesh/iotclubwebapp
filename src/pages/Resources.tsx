import React, { useState, useEffect } from 'react';
import { Download, Link2, Youtube, Search, Cpu, FileText } from 'lucide-react';
import { dbService } from '../services/db';
import { ResourceItem } from '../types';

export const Resources: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const list = await dbService.getResources();
        setResources(list);
      } catch (err) {
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filtered = resources.filter(res => 
    res.title.toLowerCase().includes(search.toLowerCase()) || 
    res.description.toLowerCase().includes(search.toLowerCase()) ||
    res.category.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (type: 'pdf' | 'link' | 'video') => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-400" />;
      case 'video': return <Youtube className="w-5 h-5 text-red-500" />;
      default: return <Link2 className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">KNOWLEDGE ARCHIVE</span>
        <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2 mb-6">Learning Resources</h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed">
          Pinout diagrams, component reference guides, workshop tutorials, and recommended links compiled by the Technical and content domains.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Filter by title, tag, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Resources Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Syncing reference database...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5 text-gray-400">
          No resources matches search keywords.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((res) => (
            <div 
              key={res.id} 
              className="p-6 rounded-2xl glass-premium border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-start gap-4 text-left"
            >
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {getIcon(res.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full capitalize">
                    {res.category}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 capitalize">
                    {res.type}
                  </span>
                </div>
                <h3 className="font-space font-bold text-base text-white mb-1 truncate">{res.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">{res.description}</p>
                
                <a 
                  href={res.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download/View file
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Resources;
