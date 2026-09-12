import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { QuestDetailClient } from "./quest-detail-client";

export default async function QuestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch the quest
  const { data: quest, error } = await supabase
    .from("quests")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !quest) {
    notFound();
  }

  // Fetch completion history if recurring
  let history = [];
  if (quest.is_recurring) {
    const { data: completions } = await supabase
      .from("quest_completions")
      .select("*")
      .eq("quest_id", id)
      .order("completed_at", { ascending: false })
      .limit(10);
      
    history = completions || [];
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl space-y-8">
      <QuestDetailClient initialQuest={quest} completionHistory={history} />
    </div>
  );
}
