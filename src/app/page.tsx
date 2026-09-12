"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swords, BarChart3, Flame, ShoppingBag, Trophy, LineChart, ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Swords className="w-8 h-8 text-amber-500" />,
      title: "Quest System",
      description: "Turn mundane tasks into epic quests. Earn XP and Gold by completing real-world habits and chores."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
      title: "RPG Stats",
      description: "Develop 6 character attributes: Strength, Intellect, Vitality, Discipline, Creativity, and Social."
    },
    {
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      title: "Streaks",
      description: "Build unstoppable momentum with daily streaks. Earn massive bonus multipliers for consistency."
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-yellow-500" />,
      title: "Shop & Inventory",
      description: "Spend your hard-earned Gold on custom themes, badges, weapons, and restorative items."
    },
    {
      icon: <Trophy className="w-8 h-8 text-purple-500" />,
      title: "Achievements",
      description: "Unlock legendary achievements as you hit milestones and progress on your life's journey."
    },
    {
      icon: <LineChart className="w-8 h-8 text-emerald-500" />,
      title: "Analytics",
      description: "Track your growth with detailed stats, completion rates, and attribute proficiency radars."
    }
  ];

  const steps = [
    {
      icon: <CheckCircle2 className="w-10 h-10 text-amber-500" />,
      title: "Create Quests",
      description: "Add your real-life tasks, assign them a difficulty and attribute type to begin."
    },
    {
      icon: <Shield className="w-10 h-10 text-emerald-500" />,
      title: "Complete & Earn",
      description: "Slay your tasks to earn XP and Gold. Your character grows as you do."
    },
    {
      icon: <Sparkles className="w-10 h-10 text-purple-500" />,
      title: "Level Up",
      description: "Reach new levels, unlock powerful titles, and become legendary in your own life."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-amber-500/30 selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl opacity-50 mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-8 h-8 text-amber-500" />
            <span className="text-xl font-bold text-white tracking-wider">LifeQuest</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                document.cookie = "lifequest_demo=true; path=/; max-age=2592000";
                window.location.href = "/app/dashboard";
              }}
              className="text-sm font-medium text-amber-400 hover:text-amber-300 border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              🎮 Demo Mode
            </button>
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors glow-amber">
              Start Journey
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Turn Your Real Life Into <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 text-glow">
                An RPG
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Build habits. Complete quests. Level up. <br />
              Become the legendary hero of your own story.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  document.cookie = "lifequest_demo=true; path=/; max-age=2592000";
                  window.location.href = "/app/dashboard";
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                🎮 Enter Realm (Instant Demo) <ArrowRight className="w-5 h-5" />
              </button>
              <Link 
                href="/signup" 
                className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-medium text-lg px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Create Account
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-medium text-lg px-6 py-4 rounded-xl transition-all"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Master Your Life</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Everything you need to stay motivated and conquer your goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/80 hover:border-slate-700 transition-all group"
              >
                <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 origin-left">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-6 py-24 border-t border-slate-800/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Hero's Journey</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Three simple steps to transform your productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0 z-0" />
            
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-slate-900 border-4 border-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform rotate-3 hover:rotate-6 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-amber-900/20 to-slate-900/60 border border-amber-900/30 rounded-3xl p-12 md:p-20 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Begin Your Quest?</h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join other adventurers who have already gamified their lives. The realm awaits your arrival.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    document.cookie = "lifequest_demo=true; path=/; max-age=2592000";
                    window.location.href = "/app/dashboard";
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xl px-10 py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transform hover:-translate-y-1"
                >
                  🎮 Enter Realm (Instant Demo) <Swords className="w-6 h-6" />
                </button>
                <Link 
                  href="/signup" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-medium text-xl px-8 py-5 rounded-xl transition-all"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 py-12 text-center text-slate-500">
          <p className="mb-4 text-slate-400">
            Built by <span className="text-amber-500 font-medium">Nikhil Rajbhar</span>
          </p>
          <div className="flex items-center justify-center gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <span className="opacity-50">•</span>
            <span className="hover:text-white transition-colors cursor-pointer">MIT License</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
