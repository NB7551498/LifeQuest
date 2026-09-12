import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { isDemoEnvironment, DEMO_PROFILE } from '@/lib/auth/demo-helper'
import { cookies } from 'next/headers'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isDemoCookie = cookieStore.get('lifequest_demo')?.value === 'true';
  const isDemoEnv = isDemoEnvironment();
  const allowDemo = isDemoCookie || isDemoEnv;

  let user = null;
  let profile = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user) {
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      profile = p;
    }
  } catch (err) {
    console.error('Auth check error:', err);
  }

  if (!user && !allowDemo) {
    redirect('/login');
  }

  const activeProfile = profile || DEMO_PROFILE;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30">
      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:flex" />
      
      {/* Main content area */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header 
          gold={activeProfile?.gold ?? 450}
          username={activeProfile?.username ?? 'Hero'}
          level={activeProfile?.level ?? 12}
          avatarUrl={activeProfile?.avatar_url}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
      
      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
