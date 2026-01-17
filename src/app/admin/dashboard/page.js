'use client';
import FileUploader from '@/components/FileUploader';
import { CheckCircle, Edit2, Flag, Loader2, Image as LucideImage, Save, Settings, Smile, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('adventure'); // 'adventure', 'timeline', or 'manage'
  const [loading, setLoading] = useState(false);
  
  // Edit State
  const [mode, setMode] = useState('create'); // 'create' or 'edit'
  const [editId, setEditId] = useState(null);

  // Manage Data State
  const [manageData, setManageData] = useState({ memories: [], timeline: [] });
  const [manageLoading, setManageLoading] = useState(false);
  
  // Adventure Form State
  const [adventureData, setAdventureData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'daily',
    author: 'Mom',
    imageUrl: ''
  });
  const [adventureFiles, setAdventureFiles] = useState([]);

  // Timeline Form State
  const [timelineData, setTimelineData] = useState({
    year: new Date().getFullYear().toString(),
    title: '',
    desc: '',
    icon: 'Flag'
  });

  // Fetch Manage Data
  const fetchManageData = async () => {
    setManageLoading(true);
    try {
      const [memRes, timeRes] = await Promise.all([
        fetch('/api/memories'),
        fetch('/api/timeline')
      ]);
      const [memories, timeline] = await Promise.all([memRes.json(), timeRes.json()]);
      setManageData({ memories, timeline });
    } catch (error) {
      console.error(error);
    } finally {
      setManageLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchManageData();
    }
  }, [activeTab]);

  const handleAdventureSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = adventureData.imageUrl;

      if (adventureFiles.length > 0) {
        const formData = new FormData();
        adventureFiles.forEach(file => formData.append('files', file));
        
        const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        if (uploadRes.ok) {
            const result = await uploadRes.json();
            if (result.urls.length > 0) {
                imageUrl = result.urls[0];
            }
        }
      }

      const payload = { ...adventureData, imageUrl };
      const endpoint = '/api/memories';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      if (mode === 'edit') payload.id = editId;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(mode === 'edit' ? 'Adventure Updated!' : 'Woohoo! Adventure saved!');
        resetForms();
      } else {
        alert('Oops! Action failed.');
      }
    } catch (error) {
      console.error(error);
      alert('Error processing memory.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimelineSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const payload = { ...timelineData };
        const endpoint = '/api/timeline';
        const method = mode === 'edit' ? 'PUT' : 'POST';
        if (mode === 'edit') payload.id = editId;

        const res = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert(mode === 'edit' ? 'Milestone Updated!' : 'Milestone Added!');
            resetForms();
        } else {
            alert('Error processing milestone');
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const deleteItem = async (type, id) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    
    try {
        const endpoint = type === 'memory' ? `/api/memories?id=${id}` : `/api/timeline?id=${id}`;
        const res = await fetch(endpoint, { method: 'DELETE' });
        if (res.ok) {
            fetchManageData();
        } else {
            alert('Failed to delete');
        }
    } catch (error) {
        console.error(error);
    }
  };

  const editItem = (type, item) => {
    setMode('edit');
    setEditId(item.id);
    if (type === 'memory') {
        setAdventureData({
            title: item.title,
            description: item.description,
            date: item.date,
            type: item.type,
            author: item.author || 'Mom',
            imageUrl: item.imageUrl || ''
        });
        setActiveTab('adventure');
    } else {
        setTimelineData({
            year: item.year,
            title: item.title,
            desc: item.desc,
            icon: item.icon
        });
        setActiveTab('timeline');
    }
  };

  const resetForms = () => {
    setMode('create');
    setEditId(null);
    setAdventureData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'daily',
        author: 'Mom',
        imageUrl: ''
    });
    setAdventureFiles([]);
    setTimelineData({
        year: new Date().getFullYear().toString(),
        title: '',
        desc: '',
        icon: 'Flag'
    });
    if (activeTab === 'manage') fetchManageData();
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
        <div className="flex flex-wrap gap-4 mb-8">
            <button 
                onClick={() => { resetForms(); setActiveTab('adventure'); }}
                className={`flex-1 min-w-[150px] py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'adventure' ? 'bg-slate-800 text-white shadow-xl scale-[1.02]' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
            >
                <LucideImage size={20} /> {mode === 'edit' && activeTab === 'adventure' ? 'Editing Adventure' : 'New Adventure'}
            </button>
            <button 
                 onClick={() => { resetForms(); setActiveTab('timeline'); }}
                 className={`flex-1 min-w-[150px] py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'timeline' ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
             >
                <Flag size={20} /> {mode === 'edit' && activeTab === 'timeline' ? 'Editing Milestone' : 'New Milestone'}
            </button>
            <button 
                 onClick={() => { resetForms(); setActiveTab('manage'); }}
                 className={`flex-1 min-w-[150px] py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${activeTab === 'manage' ? 'bg-emerald-600 text-white shadow-xl scale-[1.02]' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
             >
                <Settings size={20} /> Manage Entries
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
                        value={adventureData.author}
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
                    {mode === 'edit' && adventureData.imageUrl && (
                        <div className="mb-4">
                            <p className="text-xs text-slate-400 mb-2">Current Photo:</p>
                            <img src={adventureData.imageUrl} alt="current" className="h-20 w-auto rounded-lg" />
                        </div>
                    )}
                    <FileUploader onFilesSelected={setAdventureFiles} maxFiles={5} />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-2xl font-bold text-xl tracking-wide transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                    {loading ? <Loader2 className="animate-spin" /> : mode === 'edit' ? <><Save /> Update Adventure</> : <><Save /> Save Adventure</>}
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
                 {loading ? <Loader2 className="animate-spin" /> : mode === 'edit' ? <><CheckCircle /> Update Milestone</> : <><CheckCircle /> Add to Timeline</>}
             </button>
          </form>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
                        <LucideImage className="text-sky-500" /> Adventures
                    </h2>
                    {manageLoading ? <Loader2 className="animate-spin text-slate-300" /> : manageData.memories.length === 0 ? <p className="text-slate-400 italic">No adventures yet.</p> : (
                        <div className="grid gap-4">
                            {manageData.memories.map(m => (
                                <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        {m.imageUrl && <img src={m.imageUrl} className="w-12 h-12 rounded-lg object-cover" />}
                                        <div>
                                            <p className="font-bold text-slate-800">{m.title}</p>
                                            <p className="text-xs text-slate-400">{m.date} • {m.author || 'Mom'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => editItem('memory', m)} className="p-2 bg-white text-slate-500 hover:text-sky-600 rounded-xl shadow-sm"><Edit2 size={18} /></button>
                                        <button onClick={() => deleteItem('memory', m.id)} className="p-2 bg-white text-slate-500 hover:text-rose-600 rounded-xl shadow-sm"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
                        <Flag className="text-indigo-500" /> Milestones
                    </h2>
                    {manageLoading ? <Loader2 className="animate-spin text-slate-300" /> : manageData.timeline.length === 0 ? <p className="text-slate-400 italic">No milestones yet.</p> : (
                        <div className="grid gap-4">
                            {manageData.timeline.map(t => (
                                <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-800">{t.title}</p>
                                        <p className="text-xs text-slate-400">{t.year}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => editItem('timeline', t)} className="p-2 bg-white text-slate-500 hover:text-sky-600 rounded-xl shadow-sm"><Edit2 size={18} /></button>
                                        <button onClick={() => deleteItem('timeline', t.id)} className="p-2 bg-white text-slate-500 hover:text-rose-600 rounded-xl shadow-sm"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
