'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Smile, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const links = [
    { href: '#home', label: 'Home', id: 'home' },
    { href: '#adventures', label: 'Adventures', id: 'adventures' },
    { href: '#timeline', label: 'Timeline', id: 'timeline' },
    { href: '#diary', label: 'Diary', id: 'diary' },
  ];

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setIsOpen(false);
    }
  };
  
  // Highlight active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });
    
    links.forEach(link => {
       const section = document.getElementById(link.id);
       if(section) observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);


  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="#home" onClick={(e) => handleScroll(e, 'home')} className="group flex items-center gap-2 font-serif text-2xl font-black tracking-tighter text-slate-800 cursor-pointer">
            <div className="bg-yellow-300 p-1.5 rounded-lg rotate-3 group-hover:rotate-6 transition-transform">
               <Smile className="w-6 h-6 text-yellow-900" strokeWidth={2.5} />
            </div>
            <span>Aniya<span className="text-yellow-500">.</span></span>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex gap-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleScroll(e, link.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer",
                  activeSection === link.id 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {link.label}
              </a>
            ))}
            <Link 
                href="/admin" 
                className="ml-4 px-5 py-2 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
            >
                My Diary
            </Link>
          </div>

          {/* Mobile Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-600">
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.id)}
                  className="px-4 py-3 rounded-xl text-lg font-bold text-slate-600 hover:bg-yellow-50 hover:text-yellow-700 transition-colors block"
                >
                  {link.label}
                </a>
              ))}
               <Link
                  onClick={() => setIsOpen(false)}
                  href="/admin"
                  className="px-4 py-3 rounded-xl text-lg font-bold text-white bg-slate-900 mt-2 text-center block"
                >
                  My Diary Login
                </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
