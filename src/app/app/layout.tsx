import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-amber-500/30">
      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:flex" />
      
      {/* Main content area */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header 
          gold={profile?.gold ?? 0}
          username={profile?.username ?? 'Hero'}
          level={profile?.level ?? 1}
          avatarUrl={profile?.avatar_url}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
      
      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
