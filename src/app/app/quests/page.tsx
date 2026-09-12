import { createClient } from "@/lib/supabase/server";
import { QuestsClient } from "./quests-client";
import { DEMO_QUESTS } from "@/lib/auth/demo-helper";

export default async function QuestsPage() {
  const supabase = await createClient();
  let quests = DEMO_QUESTS;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: userQuests } = await supabase
      .from("quests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (userQuests && userQuests.length > 0) {
      quests = userQuests;
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-8">
      <QuestsClient initialQuests={quests} />
    </div>
  );
}
