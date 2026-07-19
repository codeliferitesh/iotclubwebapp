import React, { useState, useEffect } from 'react';
import { Award, Calendar, Tag, Cpu } from 'lucide-react';
import { dbService } from '../services/db';
import { AchievementItem } from '../types';

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const list = await dbService.getAchievements();
        setAchievements(list);
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">HONORS & MILESTONES</span>
        <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2 mb-6">Club Achievements</h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed">
          Celebrating outstanding achievements, innovation prizes, and technical milestones accomplished by our student engineers.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Synchronizing records...</span>
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5 text-gray-400">
          No records registered in database yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              className="rounded-2xl glass-premium border border-white/10 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <div className="h-56 w-full overflow-hidden relative bg-black/40">
                <img 
                  src={ach.image} 
                  alt={ach.title} 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[10px] text-cyan-400 font-mono mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {ach.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      {ach.category}
                    </span>
                  </div>

                  <h3 className="font-space font-bold text-xl text-white mb-2 flex items-start gap-2">
                    <Award className="w-5 h-5 text-yellow-500 shrink-0 mt-1" />
                    {ach.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Achievements;
