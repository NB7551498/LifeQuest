import { createClient } from '@/lib/supabase/server';
import { HistoryClient } from './history-client';
import { redirect } from 'next/navigation';

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch transactions
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
          History
        </h1>
        <p className="text-slate-400 mt-1">Review your recent activities, earnings, and expenditures.</p>
      </div>
      
      <HistoryClient initialTransactions={transactions || []} />
    </div>
  );
}
