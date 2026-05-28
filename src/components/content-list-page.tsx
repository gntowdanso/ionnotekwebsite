import Link from "next/link";

import { EntryCard } from "@/components/entry-card";
import { type ManagedEntry } from "@/lib/cms-data";

type ContentListPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  entries: ManagedEntry[];
};

export function ContentListPage({ eyebrow, title, description, entries }: ContentListPageProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#02111f_0%,#073459_22%,#edf6ff_22%,#f4f9ff_100%)]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-10 sm:px-10 lg:px-12 lg:pb-24">
        <div className="flex items-center justify-between rounded-full border border-white/15 bg-slate-950/30 px-4 py-3 text-white backdrop-blur md:px-6">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-cyan-300">Ionnotek</p>
            <p className="text-xs text-slate-300">Insights, products, apps, and knowledge</p>
          </div>
          <Link href="/" className="text-sm text-slate-200 transition hover:text-white">
            Back home
          </Link>
        </div>

        <div className="space-y-6 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>
          <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">{title}</h1>
          <p className="max-w-3xl text-base leading-8 text-slate-100 sm:text-lg">{description}</p>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-[2rem] border border-sky-100 bg-white px-6 py-10 text-sm text-slate-700 shadow-[0_18px_40px_rgba(3,26,47,0.08)]">
            No published entries are available yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}