'use client';
import { BookLock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'aniya123') {
      document.cookie = "admin-token=authenticated; path=/";
      router.push('/admin/dashboard');
    } else {
      setError('Wrong code! Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border-4 border-yellow-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 -rotate-6 shadow-sm">
            <BookLock className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-800">Parents Only!</h1>
          <p className="text-slate-500 mt-2 text-lg">Enter the secret code to open the diary.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Secret Code..."
              className="w-full px-6 py-4 rounded-xl border-2 border-slate-100 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all font-mono text-lg text-center tracking-widest"
            />
          </div>
          
          {error && <p className="text-rose-500 font-bold text-center animate-pulse">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:-translate-y-1"
          >
            Unlock Diary
          </button>
        </form>
      </div>
    </div>
  );
}
