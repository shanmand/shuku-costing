import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const isConfigured = 
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-cream p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-charcoal/5"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-honey rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="text-charcoal" size={32} />
          </div>
          <h1 className="text-2xl font-black text-charcoal uppercase tracking-tight">Bakery OS</h1>
          <p className="text-charcoal/40 text-sm font-bold uppercase tracking-widest mt-1">System Authentication</p>
        </div>

        {!isConfigured && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col gap-2 text-amber-800 text-xs font-bold">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              SUPABASE NOT CONFIGURED
            </div>
            <p className="font-medium opacity-70">Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables in Settings.</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={20} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20"
                placeholder="admin@bakery.co.za"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={20} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-secondary-cream/50 border border-charcoal/5 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-honey/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full py-4 bg-charcoal text-amber-honey rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In to System'}
            </button>

            {!isConfigured && (
              <button 
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-secondary-cream text-charcoal rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-charcoal/5 transition-all flex items-center justify-center gap-2"
              >
                Enter Demo Mode (Bypass)
              </button>
            )}
          </div>
        </form>

        <p className="text-center mt-8 text-[10px] font-bold text-charcoal/20 uppercase tracking-widest">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
};
