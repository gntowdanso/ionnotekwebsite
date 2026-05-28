import { ContentListPage } from "@/components/content-list-page";
import { EntryType, getEntriesByType } from "@/lib/cms-data";

export default async function NewsPage() {
  const entries = await getEntriesByType(EntryType.NEWS);

  return (
    <ContentListPage
      eyebrow="News"
      title="Latest Ionnotek updates and project momentum"
      description="Company updates, launches, delivery milestones, and operational highlights from Ionnotek's work across digitization, automation, software, and AI."
      entries={entries}
    />
  );
}