"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Swords,
  User,
  ShoppingBag,
  Menu,
  Backpack,
  Trophy,
  BarChart3,
  ScrollText,
  Settings,
  X,
} from "lucide-react";

const mainTabs = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/quests", label: "Quests", icon: Swords },
  { href: "/app/character", label: "Character", icon: User },
  { href: "/app/shop", label: "Shop", icon: ShoppingBag },
];

const moreTabs = [
  { href: "/app/inventory", label: "Inventory", icon: Backpack },
  { href: "/app/achievements", label: "Achievements", icon: Trophy },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/history", label: "History", icon: ScrollText },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      {/* Dim overlay for more menu */}
      {isMoreOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      {/* More menu sheet */}
      <div
        className={cn(
          "fixed bottom-16 left-0 right-0 z-40 transform bg-slate-900 border-t border-slate-800 p-4 transition-transform duration-300 ease-in-out lg:hidden rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)]",
          isMoreOpen ? "translate-y-0" : "translate-y-[150%]"
        )}
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-bold text-white">More Options</h3>
          <button 
            onClick={() => setIsMoreOpen(false)}
            className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {moreTabs.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMoreOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t border-slate-800 bg-slate-950/95 px-2 pb-safe backdrop-blur lg:hidden">
        {mainTabs.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 p-1 text-[10px] font-medium transition-colors",
                isActive ? "text-amber-400" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        {/* More button */}
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 p-1 text-[10px] font-medium transition-colors",
            isMoreOpen || moreTabs.some(t => t.href === pathname) 
              ? "text-amber-400" 
              : "text-slate-500 hover:text-slate-300"
          )}
        >
          <Menu className="h-5 w-5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
