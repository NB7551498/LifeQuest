"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Swords,
  User,
  Backpack,
  ShoppingBag,
  Trophy,
  BarChart3,
  ScrollText,
  Settings,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/quests", label: "Quests", icon: Swords },
  { href: "/app/character", label: "Character", icon: User },
  { href: "/app/inventory", label: "Inventory", icon: Backpack },
  { href: "/app/shop", label: "Shop", icon: ShoppingBag },
  { href: "/app/achievements", label: "Achievements", icon: Trophy },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/history", label: "History", icon: ScrollText },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 flex-col justify-between border-r border-slate-800 bg-slate-950",
        className
      )}
    >
      <div>
        <div className="flex h-16 items-center px-6 border-b border-slate-800">
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-wider">⚔️ LifeQuest</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 rounded-l-none"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 py-4 border-t border-slate-800">
        <Link
          href="/app/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            pathname === "/app/settings"
              ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 rounded-l-none"
              : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
          )}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
