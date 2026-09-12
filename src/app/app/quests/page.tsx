import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QuestsClient } from "./quests-client";

export default async function QuestsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch all quests for the user
  const { data: quests } = await supabase
    .from("quests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto p-4 max-w-5xl space-y-8">
      <QuestsClient initialQuests={quests || []} />
    </div>
  );
}
