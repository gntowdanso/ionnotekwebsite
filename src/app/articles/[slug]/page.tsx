import { notFound } from "next/navigation";

import { EntryDetailPage } from "@/components/entry-detail-page";
import { EntryType, getEntryBySlug } from "@/lib/cms-data";

type ArticleDetailProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ comment?: string }>;
};

export default async function ArticleDetailPage({ params, searchParams }: ArticleDetailProps) {
  const [{ slug }, { comment }] = await Promise.all([params, searchParams]);
  const entry = await getEntryBySlug(EntryType.ARTICLE, slug);

  if (!entry) {
    notFound();
  }

  return <EntryDetailPage entry={entry} commentState={comment} />;
}