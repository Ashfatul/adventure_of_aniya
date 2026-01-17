'use client';
import { motion } from 'framer-motion';
import { Calendar, Flag, Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const iconMap = {
  'Flag': Flag,
  'Calendar': Calendar,
  'Star': Star,
  'Heart': Heart,
};

export default function TimelineSection() {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTimeline() {
            try {
                const res = await fetch('/api/timeline');
                const data = await res.json();
                setMilestones(data);
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchTimeline();
    }, []);

  if (loading) return null; // Or simple loader

  return (
    <section id="timeline" className="py-32 bg-indigo-50 relative overflow-hidden">
      {/* Playful Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-60 -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold uppercase tracking-widest text-sm mb-4">Growing Up</span>
          <h2 className="font-serif text-6xl md:text-8xl font-black text-slate-800 tracking-tighter">
            Timeline of <span className="text-indigo-600">Joy</span>
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-indigo-200 via-purple-200 to-indigo-200 rounded-full md:-translate-x-1/2" />

          <div className="space-y-20">
            {milestones.map((item, index) => {
               const isEven = index % 2 === 0;
               const Icon = iconMap[item.icon] || Flag;
               
               return (
                <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className={`relative flex items-start md:justify-between ${!isEven ? 'md:flex-row-reverse' : ''}`}
                >
                    {/* Icon Node */}
                    <motion.div 
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="absolute left-8 md:left-1/2 -translate-x-5 md:-translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-indigo-100 shadow-xl z-20 flex items-center justify-center text-indigo-500"
                    >
                        <Icon size={20} fill="currentColor" className="text-indigo-500/20" />
                    </motion.div>

                    {/* Content Card */}
                    <div className={`ml-24 md:ml-0 md:w-[45%] p-8 bg-white rounded-3xl shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300 border border-indigo-50 group hover:-translate-y-2 ${!isEven ? 'text-left md:text-right' : 'text-left'}`}>
                        <span className="text-indigo-400 font-black text-2xl mb-2 block">{item.year}</span>
                        <h3 className="font-serif text-3xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                        <p className="text-slate-500 text-lg leading-relaxed">{item.desc}</p>
                    </div>
                    
                    {/* Spacer for the other side */}
                    <div className="hidden md:block md:w-[45%]" />
                </motion.div>
               );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
