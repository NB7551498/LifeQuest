"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Volume2, VolumeX, LogOut, AlertTriangle, Save, Calendar, BarChart3, ShieldAlert } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showDangerDialog, setShowDangerDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username);
      }
      
      const savedSound = localStorage.getItem('lq_sound_enabled');
      if (savedSound !== null) {
        setSoundEnabled(savedSound === 'true');
      }
      
      setLoading(false);
    }
    
    loadData();
  }, [supabase, router]);

  const handleSaveProfile = async () => {
    if (!user || !username.trim() || username === profile?.username) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });
      
      if (response.ok) {
        setProfile({ ...profile, username: username.trim() });
      }
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('lq_sound_enabled', String(newState));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
          Settings
        </h1>
        <p className="text-slate-400 mt-1">Manage your account and character preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <User className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-white">Profile Identity</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
              <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="opacity-80">{user?.email}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Email cannot be changed.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Adventurer Name (Username)</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving || username === profile?.username || !username.trim()}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Preferences */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-white">Preferences</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium">Sound Effects</h3>
                <p className="text-sm text-slate-400">Play sounds when completing quests or leveling up.</p>
              </div>
              <button 
                onClick={toggleSound}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  soundEnabled ? "bg-amber-500" : "bg-slate-700"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  soundEnabled ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
            
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm text-center">
                ✨ More themes and customization options are available in the Shop! ✨
              </p>
            </div>
          </div>
        </motion.section>

        {/* Account Summary */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-white">Account Details</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Level</span>
                <span className="text-2xl font-bold text-white">{profile?.level || 1}</span>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total XP</span>
                <span className="text-2xl font-bold text-amber-500">{profile?.total_xp || 0}</span>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Gold</span>
                <span className="text-2xl font-bold text-yellow-500">{profile?.gold || 0}</span>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Member Since</span>
                <span className="text-sm font-medium text-slate-300 mt-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {profile?.created_at ? formatDate(new Date(profile.created_at)) : 'N/A'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of LifeQuest
            </button>
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/60 border border-red-900/50 rounded-xl overflow-hidden relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
          <div className="p-6 border-b border-red-900/30 flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-slate-200 font-medium">Reset Progress</h3>
                <p className="text-sm text-slate-400 max-w-md">Permanently delete all your quests, achievements, and stats. Start fresh from Level 1.</p>
              </div>
              <button 
                onClick={() => setShowDangerDialog(true)}
                className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Danger Dialog */}
      {showDangerDialog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-red-900/50 rounded-xl max-w-md w-full p-6 shadow-2xl"
          >
            <div className="w-12 h-12 bg-red-950 rounded-full flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-center text-white mb-2">Are you absolutely sure?</h3>
            <p className="text-slate-400 text-center mb-6 text-sm">
              This action cannot be undone. This will permanently delete your character progress, stats, inventory, and quest history.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDangerDialog(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Progress reset is not yet implemented!");
                  setShowDangerDialog(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Yes, Reset All
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
