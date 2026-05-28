import { ContentListPage } from "@/components/content-list-page";
import { EntryType, getEntriesByType } from "@/lib/cms-data";

export default async function ProductsPage() {
  const entries = await getEntriesByType(EntryType.PRODUCT);

  return (
    <ContentListPage
      eyebrow="Products"
      title="Business platforms and software products from Ionnotek"
      description="A closer look at Ionnotek-built platforms across ERP, finance, payroll, automation, and operational systems designed for African business environments."
      entries={entries}
    />
  );
}