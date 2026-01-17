'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function GalleryGrid() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function fetchMemories() {
      try {
        const res = await fetch('/api/memories');
        const data = await res.json();
        setMemories(data);
      } catch (error) {
        console.error('Failed to fetch memories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMemories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-rose-400" />
      </div>
    );
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 px-2">
      {memories.map((memory, index) => (
        <motion.div
          key={memory.id}
          layoutId={memory.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
          className="break-inside-avoid mb-6 relative group rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
          onClick={() => setSelectedId(memory.id)}
        >
          <div className="relative">
             {memory.imageUrl ? (
                <div className="relative w-full h-auto">
                   <img 
                    src={memory.imageUrl} 
                    alt={memory.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                </div>
             ) : (
                <div className="aspect-[4/3] bg-rose-50 flex items-center justify-center p-8 text-center">
                    <span className="text-rose-300 italic">No Image</span>
                </div>
             )}
             
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                 <span className="text-xs font-semibold tracking-wider text-white/80 uppercase mb-1">{memory.type}</span>
                 <h3 className="text-xl font-serif text-white">{memory.title}</h3>
             </div>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedId(null)}
          >
            {(() => {
              const mem = memories.find(m => m.id === selectedId);
              if (!mem) return null;
              
              return (
                <motion.div 
                    layoutId={selectedId}
                    className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedId(null)} 
                        className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="md:w-2/3 bg-black flex items-center justify-center overflow-auto max-h-[50vh] md:max-h-full">
                         {mem.imageUrl && (
                            <img 
                                src={mem.imageUrl} 
                                alt={mem.title} 
                                className="w-full h-full object-contain"
                            />
                         )}
                    </div>

                    <div className="md:w-1/3 p-8 md:p-10 flex flex-col justify-center bg-white overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-xs font-bold uppercase tracking-wider mb-4">
                                {mem.type}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 leading-tight">
                                {mem.title}
                            </h2>
                            <div className="w-12 h-1 bg-rose-200 mb-6" />
                            <p className="text-gray-600 leading-relaxed text-lg font-light">
                                {mem.description}
                            </p>
                            <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-400 font-mono">
                                {new Date(mem.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
