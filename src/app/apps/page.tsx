import { ContentListPage } from "@/components/content-list-page";
import { EntryType, getEntriesByType } from "@/lib/cms-data";

export default async function AppsPage() {
  const entries = await getEntriesByType(EntryType.APP);

  return (
    <ContentListPage
      eyebrow="Apps"
      title="Mobile and iOS-ready app experiences by Ionnotek"
      description="Explore Ionnotek delivery apps, ride sharing platforms, and other downloadable mobile experiences built for customers, drivers, field teams, and business operations."
      entries={entries}
    />
  );
}