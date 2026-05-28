import { notFound } from "next/navigation";

import { EntryDetailPage } from "@/components/entry-detail-page";
import { EntryType, getEntryBySlug } from "@/lib/cms-data";

type NewsDetailProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ comment?: string }>;
};

export default async function NewsDetailPage({ params, searchParams }: NewsDetailProps) {
  const [{ slug }, { comment }] = await Promise.all([params, searchParams]);
  const entry = await getEntryBySlug(EntryType.NEWS, slug);

  if (!entry) {
    notFound();
  }

  return <EntryDetailPage entry={entry} commentState={comment} />;
}