import { ContentListPage } from "@/components/content-list-page";
import { EntryType, getEntriesByType } from "@/lib/cms-data";

export default async function ArticlesPage() {
  const entries = await getEntriesByType(EntryType.ARTICLE);

  return (
    <ContentListPage
      eyebrow="Articles"
      title="Practical thinking on digitization, automation, and custom software"
      description="Longer-form insights from Ionnotek on operational technology, AI adoption, automation design, and building systems that fit the business instead of distorting it."
      entries={entries}
    />
  );
}