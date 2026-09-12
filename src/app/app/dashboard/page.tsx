import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";
import { getTodayDateString } from "@/lib/utils";
import { DEMO_PROFILE, DEMO_QUESTS } from "@/lib/auth/demo-helper";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  let profile = DEMO_PROFILE;
  let streak: any = DEMO_PROFILE.streak;
  let activeQuests: any[] = DEMO_QUESTS;
  let xpEarnedToday = 30;
  let questsCompletedToday = 1;

  if (user) {
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userProfile) {
      profile = userProfile;
      const today = getTodayDateString();

      const { data: userStreak } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (userStreak) streak = userStreak;

      const { data: userActiveQuests } = await supabase
        .from("quests")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .or(`due_date.eq.${today},due_date.is.null`)
        .limit(5);

      if (userActiveQuests && userActiveQuests.length > 0) {
        activeQuests = userActiveQuests;
      }

      const { data: completionsToday } = await supabase
        .from("quest_completions")
        .select("xp_earned")
        .eq("user_id", user.id)
        .gte("completed_at", `${today}T00:00:00Z`)
        .lt("completed_at", `${today}T23:59:59.999Z`);

      xpEarnedToday = completionsToday?.reduce((acc, curr) => acc + (curr.xp_earned || 0), 0) || 0;
      questsCompletedToday = completionsToday?.length || 0;
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-8">
      <DashboardClient 
        profile={profile}
        streak={streak}
        quests={activeQuests}
        xpEarnedToday={xpEarnedToday}
        questsCompletedToday={questsCompletedToday}
      />
    </div>
  );
}
