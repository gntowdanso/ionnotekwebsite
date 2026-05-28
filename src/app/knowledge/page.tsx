import { ContentListPage } from "@/components/content-list-page";
import { EntryType, getEntriesByType } from "@/lib/cms-data";

export default async function KnowledgePage() {
  const entries = await getEntriesByType(EntryType.KNOWLEDGE);

  return (
    <ContentListPage
      eyebrow="Knowledge"
      title="Training, frameworks, and operating knowledge from Ionnotek"
      description="Knowledge resources covering ICT training, AI readiness, reporting design, automation thinking, and digital capability building for teams and institutions."
      entries={entries}
    />
  );
}