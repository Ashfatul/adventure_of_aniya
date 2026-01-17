'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#FDFCF8]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
         <motion.div style={{ y: y1 }} className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-yellow-200/30 rounded-full blur-[100px]" />
         <motion.div style={{ y: y2 }} className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] bg-sky-200/30 rounded-full blur-[100px]" />
         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDFCF8] to-transparent z-10" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 50, rotate: -5 }}
           animate={{ opacity: 1, y: 0, rotate: 0 }}
           transition={{ duration: 1, type: "spring" }}
           className="inline-block mb-6"
        >
             <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] px-6 py-2 rounded-full transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
                <span className="font-bold text-slate-900 tracking-widest uppercase text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Aniya's World
                </span>
             </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-7xl md:text-9xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]"
        >
          Growing Up <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-rose-400">
             Is An Adventure
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium"
        >
          A digital diary capturing every giggle, every step, and every messy moment.
        </motion.p>
      </div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-300"
      >
        <span className="text-xs font-bold tracking-widest uppercase">Scroll to Explore</span>
        <ArrowDown className="animate-bounce w-6 h-6" />
      </motion.div>
    </section>
  );
}
