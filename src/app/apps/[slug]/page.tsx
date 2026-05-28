import { notFound } from "next/navigation";

import { EntryDetailPage } from "@/components/entry-detail-page";
import { EntryType, getEntryBySlug } from "@/lib/cms-data";

type AppDetailProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ comment?: string }>;
};

export default async function AppDetailPage({ params, searchParams }: AppDetailProps) {
  const [{ slug }, { comment }] = await Promise.all([params, searchParams]);
  const entry = await getEntryBySlug(EntryType.APP, slug);

  if (!entry) {
    notFound();
  }

  return <EntryDetailPage entry={entry} commentState={comment} />;
}