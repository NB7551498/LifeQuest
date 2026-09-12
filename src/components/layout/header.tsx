"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  gold?: number;
  username?: string;
  level?: number;
  avatarUrl?: string | null;
}

export function Header({ gold = 0, username = "Hero", level = 1, avatarUrl }: HeaderProps) {
  const pathname = usePathname();
  
  // Format page title from pathname
  const pageTitle = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';
  const displayTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center">
        {/* Mobile Title */}
        <div className="lg:hidden text-lg font-bold text-white tracking-wider">
          ⚔️ LifeQuest
        </div>
        {/* Desktop Title */}
        <div className="hidden lg:block text-xl font-bold text-white/90">
          {displayTitle}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Gold Display */}
        <div className="flex items-center gap-1.5 rounded-full bg-slate-950/50 px-3 py-1.5 border border-amber-900/30">
          <span className="text-sm font-medium text-amber-400">🪙 {gold.toLocaleString()}</span>
        </div>

        {/* Notifications */}
        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 border border-slate-900"></span>
        </button>

        {/* User Avatar */}
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700 cursor-pointer overflow-visible">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="h-full w-full rounded-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-slate-300">{username.charAt(0).toUpperCase()}</span>
          )}
          
          {/* Level Badge Overlay */}
          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 border border-slate-900 shadow-sm">
            <span className="text-[9px] font-bold text-white leading-none">{level}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
