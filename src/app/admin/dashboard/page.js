'use client';
import FileUploader from '@/components/FileUploader';
import { CheckCircle, Flag, Loader2, Image as LucideImage, Save, Smile } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('adventure'); // 'adventure' or 'timeline'
  const [loading, setLoading] = useState(false);
  
  // Adventure Form State
  const [adventureData, setAdventureData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'daily',
    imageUrl: '' // Fallback if needed, but we use files mostly
  });
  const [adventureFiles, setAdventureFiles] = useState([]);

  // Timeline Form State
  const [timelineData, setTimelineData] = useState({
    year: new Date().getFullYear().toString(),
    title: '',
    desc: '',
    icon: 'Flag'
  });

  const handleAdventureSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = adventureData.imageUrl; // Keep existing if set manually

      // Upload Files first if any
      if (adventureFiles.length > 0) {
        const formData = new FormData();
        adventureFiles.forEach(file => formData.append('files', file));
        
        const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (uploadRes.ok) {
            const result = await uploadRes.json();
            // For now, just take the first one as "imageUrl" to stay compatible 
            // OR ideally we save all of them. Let's start with primary image
            // and assume we update the backend to store an array later? 
            // Plan said we update json to store `images: []`.
            // Let's store the first one as imageUrl for compatibility
            // and maybe specific field for list.
            if (result.urls.length > 0) {
                imageUrl = result.urls[0];
            }
        }
      }

      const payload = { ...adventureData, imageUrl };

      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('Woohoo! Adventure saved!');
        setAdventureData({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            type: 'daily',
            imageUrl: ''
        });
        setAdventureFiles([]);
      } else {
        alert('Oops! Could not save.');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving memory.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimelineSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch('/api/timeline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(timelineData)
        });
        if (res.ok) {
            alert('Milestone Added!');
            setTimelineData({ year: new Date().getFullYear().toString(), title: '', desc: '', icon: 'Flag' });
        } else {
            alert('Error adding milestone');
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 border-t-8 border-yellow-300">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header & Logout */}
        <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-serif font-black text-slate-800 tracking-tight flex items-center gap-3">
               <span className="bg-white p-2 rounded-xl shadow-sm -rotate-3"><Smile className="w-8 h-8 text-yellow-500" /></span>
               Secret Diary
            </h1>
            <button onClick={() => {
                document.cookie = "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                router.push('/');
            }} className="px-5 py-2.5 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-full text-base font-bold text-slate-500 shadow-sm transition-all">Close Diary</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
            <button 
                onClick={() => setActiveTab('adventure')}
                className={`flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'adventure' ? 'bg-slate-800 text-white shadow-xl scale-[1.02]' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
            >
                <LucideImage size={20} /> New Adventure
            </button>
            <button 
                 onClick={() => setActiveTab('timeline')}
                 className={`flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'timeline' ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
             >
                <Flag size={20} /> New Milestone
            </button>
        </div>

        {/* Adventure Form */}
        {activeTab === 'adventure' && (
             <form onSubmit={handleAdventureSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Title</label>
                    <input
                    required
                    type="text"
                    value={adventureData.title}
                    onChange={(e) => setAdventureData({...adventureData, title: e.target.value})}
                    placeholder="The Great Spaghetti Disaster!"
                    className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-yellow-300 focus:outline-none transition-all font-bold text-xl text-slate-800 placeholder:text-slate-300"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Date</label>
                        <input
                        required
                        type="date"
                        value={adventureData.date}
                        onChange={(e) => setAdventureData({...adventureData, date: e.target.value})}
                        className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-yellow-300 focus:outline-none transition-all font-medium text-slate-700"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Type</label>
                        <select
                            value={adventureData.type}
                            onChange={(e) => setAdventureData({...adventureData, type: e.target.value})}
                            className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-yellow-300 focus:outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                        >
                            <option value="daily">Fun Day</option>
                            <option value="milestone">Milestone 🏆</option>
                            <option value="event">Event 🎉</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Who is Adding This?</label>
                    <select
                        value={adventureData.author || 'Mom'}
                        onChange={(e) => setAdventureData({...adventureData, author: e.target.value})}
                        className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-yellow-300 focus:outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                    >
                        <option value="Mom">Mom</option>
                        <option value="Dad">Dad</option>
                        <option value="Grandparents">Grandparents</option>
                        <option value="Aniya">Aniya herself 👧</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Story</label>
                    <textarea
                    required
                    rows={4}
                    value={adventureData.description}
                    onChange={(e) => setAdventureData({...adventureData, description: e.target.value})}
                    placeholder="What happened today?"
                    className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-yellow-300 focus:outline-none transition-all resize-none font-medium text-slate-700 placeholder:text-slate-300 leading-relaxed"
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Photos</label>
                    <FileUploader onFilesSelected={setAdventureFiles} maxFiles={5} />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-2xl font-bold text-xl tracking-wide transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Save /> Save Adventure</>}
                </button>
             </form>
        )}

        {/* Timeline Form */}
        {activeTab === 'timeline' && (
            <form onSubmit={handleTimelineSubmit} className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border-2 border-indigo-50">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                     <label className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Year</label>
                     <input
                     required
                     type="text"
                     value={timelineData.year}
                     onChange={(e) => setTimelineData({...timelineData, year: e.target.value})}
                     className="w-full px-6 py-5 rounded-2xl bg-indigo-50/50 border-2 border-transparent focus:bg-white focus:border-indigo-300 focus:outline-none transition-all font-bold text-xl text-slate-800"
                     />
                 </div>
                 <div className="space-y-3">
                     <label className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Icon</label>
                     <select
                         value={timelineData.icon}
                         onChange={(e) => setTimelineData({...timelineData, icon: e.target.value})}
                         className="w-full px-6 py-5 rounded-2xl bg-indigo-50/50 border-2 border-transparent focus:bg-white focus:border-indigo-300 focus:outline-none transition-all font-medium text-slate-700 appearance-none"
                     >
                         <option value="Flag">Flag (Milestone)</option>
                         <option value="Calendar">Calendar (Date)</option>
                         <option value="Star">Star (Achievement)</option>
                         <option value="Heart">Heart (Love)</option>
                     </select>
                 </div>
             </div>

             <div className="space-y-3">
                 <label className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Title</label>
                 <input
                 required
                 type="text"
                 value={timelineData.title}
                 onChange={(e) => setTimelineData({...timelineData, title: e.target.value})}
                 placeholder="First Steps"
                 className="w-full px-6 py-5 rounded-2xl bg-indigo-50/50 border-2 border-transparent focus:bg-white focus:border-indigo-300 focus:outline-none transition-all font-bold text-xl text-slate-800 placeholder:text-slate-300"
                 />
             </div>

             <div className="space-y-3">
                 <label className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Description</label>
                 <textarea
                 required
                 rows={3}
                 value={timelineData.desc}
                 onChange={(e) => setTimelineData({...timelineData, desc: e.target.value})}
                 placeholder="Short description of the moment..."
                 className="w-full px-6 py-5 rounded-2xl bg-indigo-50/50 border-2 border-transparent focus:bg-white focus:border-indigo-300 focus:outline-none transition-all resize-none font-medium text-slate-700 placeholder:text-slate-300 leading-relaxed"
                 />
             </div>

             <button
                 type="submit"
                 disabled={loading}
                 className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white rounded-2xl font-bold text-xl tracking-wide transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 flex items-center justify-center gap-3"
             >
                 {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle /> Add to Timeline</>}
             </button>
          </form>
        )}

      </div>
    </div>
  );
}
