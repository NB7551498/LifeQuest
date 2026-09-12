import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";
import { getTodayDateString } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/app/settings");
  }

  const today = getTodayDateString();

  // Fetch streak
  const { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch today's active quests (due today or no due date)
  const { data: activeQuests } = await supabase
    .from("quests")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .or(`due_date.eq.${today},due_date.is.null`)
    .limit(5);

  // Total XP earned today
  const { data: completionsToday } = await supabase
    .from("quest_completions")
    .select("xp_earned")
    .eq("user_id", user.id)
    .gte("completed_at", `${today}T00:00:00Z`)
    .lt("completed_at", `${today}T23:59:59.999Z`);

  const xpEarnedToday = completionsToday?.reduce((acc, curr) => acc + (curr.xp_earned || 0), 0) || 0;
  const questsCompletedToday = completionsToday?.length || 0;

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-8">
      <DashboardClient 
        profile={profile}
        streak={streak}
        quests={activeQuests || []}
        xpEarnedToday={xpEarnedToday}
        questsCompletedToday={questsCompletedToday}
      />
    </div>
  );
}
