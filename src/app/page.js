import GallerySection from '@/components/GallerySection';
import Hero from '@/components/Hero';
import TimelineSection from '@/components/TimelineSection';
import { Camera, Palette } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF8]">
      <Hero />
      
      {/* Highlights / Intro Section - Redesigned */}
      <section className="py-32 px-4 relative overflow-hidden">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
                 <div className="absolute inset-0 bg-yellow-200 rounded-[3rem] rotate-3 transform translate-x-4 translate-y-4" />
                 <div className="relative bg-white border-4 border-slate-900 rounded-[3rem] p-12 shadow-2xl">
                    <Palette className="w-16 h-16 text-slate-900 mb-6" />
                    <h3 className="font-serif text-4xl font-black text-slate-900 mb-4">Colors of Life</h3>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Every day adds a new splash of color to her story. From the blue beach days to the green park adventures.
                    </p>
                 </div>
            </div>
            
            <div className="space-y-8">
                 <h2 className="font-serif text-5xl md:text-7xl font-black text-slate-900 leading-none">
                    Collecting <br/>
                    <span className="text-yellow-500">Moments</span>,<br/>
                    Not Things.
                 </h2>
                 <p className="text-xl text-slate-500 max-w-md">
                    We believe in capturing the raw, unposed, and beautiful chaos of childhood.
                 </p>
            </div>
         </div>
      </section>

      <GallerySection />
      
      <TimelineSection />

      {/* Secret Admin Footer */}
      <footer className="py-32 bg-slate-900 text-white text-center relative overflow-hidden clip-path-slant">
        <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h2 className="font-serif text-5xl md:text-7xl font-black mb-8 text-yellow-300">
                To Be Continued...
            </h2>
            <p className="text-slate-400 mb-12 text-2xl font-light">
                Aniya's story is just beginning.
            </p>
            
            <Link 
                href="/admin" 
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full font-bold text-white transition-all"
            >
                <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Parents Area</span>
            </Link>
            
            <div className="mt-24 text-slate-700 text-sm font-mono uppercase tracking-widest opacity-30">
                Made with Love • 2026
            </div>
        </div>
      </footer>
    </div>
  );
}
