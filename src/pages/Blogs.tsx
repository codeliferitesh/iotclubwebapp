import React, { useState, useEffect } from 'react';
import { BookOpen, User, Calendar, Clock, Search, AlertCircle, X, Cpu } from 'lucide-react';
import { dbService } from '../services/db';
import { BlogItem } from '../types';

export const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeBlog, setActiveBlog] = useState<BlogItem | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const list = await dbService.getBlogs();
        setBlogs(list.filter(b => b.status === 'published'));
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filtered = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">TECHNICAL TUTORIALS & INSIGHTS</span>
        <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2 mb-6">IoT Club Blog</h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed">
          Deep-dives on microcontroller architectures, sensor protocols, RTOS, and TinyML written by club leaders and research enthusiasts.
        </p>
      </div>

      {/* Search */}
      <div className="mb-10 max-w-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Blog Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
          <Cpu className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Synchronizing library...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5">
          <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 font-medium">No articles found matching search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((blog) => (
            <div 
              key={blog.id} 
              onClick={() => setActiveBlog(blog)}
              className="rounded-2xl glass-premium border border-white/10 overflow-hidden flex flex-col group hover:-translate-y-1 cursor-pointer transition-all duration-300 text-left"
            >
              <div className="h-52 w-full overflow-hidden relative bg-black/40">
                <img 
                  src={blog.coverImage} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3.5 text-[10px] text-cyan-400 font-mono mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {blog.publishedAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {blog.readTime}
                  </div>
                </div>

                <h3 className="font-space font-bold text-xl text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
                  {blog.summary}
                </p>

                {/* Author Block */}
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-7 h-7 rounded-full bg-white/10 overflow-hidden border border-white/5">
                    {blog.authorImage ? (
                      <img src={blog.authorImage} alt={blog.author} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-gray-400 m-1.5" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-300">{blog.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reader Modal Overlay */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 bg-spaceBlack/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl glass-premium border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto relative flex flex-col text-left">
            <button 
              onClick={() => setActiveBlog(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Banner */}
            <div className="h-60 sm:h-72 w-full overflow-hidden">
              <img src={activeBlog.coverImage} alt={activeBlog.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 sm:p-10 flex-1">
              <div className="flex items-center gap-4 text-xs text-cyan-400 font-mono mb-4">
                <span>{activeBlog.publishedAt}</span>
                <span>•</span>
                <span>{activeBlog.readTime}</span>
              </div>

              <h2 className="font-space font-bold text-2xl sm:text-3xl text-white mb-6 leading-tight">
                {activeBlog.title}
              </h2>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-white/10 overflow-hidden border border-white/5">
                  {activeBlog.authorImage ? (
                    <img src={activeBlog.authorImage} alt={activeBlog.author} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400 m-2" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-300 block">{activeBlog.author}</span>
                  <span className="text-[10px] text-gray-500 font-mono uppercase">Author / Technical Lead</span>
                </div>
              </div>

              {/* Body */}
              <div className="text-sm sm:text-base text-gray-300 leading-relaxed space-y-6">
                <p className="font-medium text-white">{activeBlog.summary}</p>
                <div className="whitespace-pre-line text-gray-400">
                  {activeBlog.content}
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2.5 mt-8 border-t border-white/10 pt-6">
                {activeBlog.tags.map(t => (
                  <span key={t} className="text-xs font-mono px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-cyan-400">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Blogs;
