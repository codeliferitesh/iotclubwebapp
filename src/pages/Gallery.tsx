import React, { useState, useEffect } from 'react';
import { Search, Tag, X, ChevronLeft, ChevronRight, Play, Cpu, AlertCircle } from 'lucide-react';
import { dbService } from '../services/db';
import { GalleryItem } from '../types';

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'all' | 'photos' | 'videos'>('all');
  const [search, setSearch] = useState('');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const list = await dbService.getGallery();
        setItems(list);
      } catch (err) {
        console.error('Error fetching gallery photos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'all' || item.category === category;
    return matchesSearch && matchesCat;
  });

  const openLightbox = (id: string) => {
    const idx = filtered.findIndex(i => i.id === id);
    if (idx !== -1) setSelectedIdx(idx);
  };

  const closeLightbox = () => setSelectedIdx(null);

  const prevSlide = () => {
    if (selectedIdx === null) return;
    setSelectedIdx(prev => (prev === 0 ? filtered.length - 1 : prev! - 1));
  };

  const nextSlide = () => {
    if (selectedIdx === null) return;
    setSelectedIdx(prev => (prev === filtered.length - 1 ? 0 : prev! + 1));
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Header */}
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">SNAPSHOTS & FOOTAGES</span>
          <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2">Club Gallery</h1>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl self-center md:self-end">
          {['all', 'photos', 'videos'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                category === cat ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-10 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search gallery files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Masonry Layout */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Syncing snapshots archive...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5">
          <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 font-medium">No media items found matching query.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item.id)}
              className="break-inside-avoid rounded-2xl glass-premium border border-white/5 overflow-hidden group cursor-pointer relative"
            >
              <img 
                src={item.mediaUrl} 
                alt={item.title} 
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
              
              {/* Blur Hover Overlay */}
              <div className="absolute inset-0 bg-spaceBlack/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h4 className="font-space font-bold text-sm sm:text-base text-white line-clamp-2">
                  {item.title}
                </h4>
                {item.category === 'videos' && (
                  <div className="absolute top-4 right-4 p-2 rounded-full bg-cyan-500 text-white">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <button 
            onClick={prevSlide}
            className="absolute left-4 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4">
            <img 
              src={filtered[selectedIdx].mediaUrl} 
              alt={filtered[selectedIdx].title} 
              className="max-w-full max-h-[70vh] object-contain rounded-lg border border-white/10"
            />
            <h4 className="font-space text-sm sm:text-base text-gray-300 text-center font-medium px-6">
              {filtered[selectedIdx].title}
            </h4>
          </div>

          <button 
            onClick={nextSlide}
            className="absolute right-4 p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
export default Gallery;
