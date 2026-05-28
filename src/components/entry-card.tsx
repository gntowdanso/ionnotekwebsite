import { ArrowRight, Download, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EntryType, entryTypeMeta, getEntryPath, type ManagedEntry } from "@/lib/cms-data";

type EntryCardProps = {
  entry: ManagedEntry;
};

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-sky-100 bg-white shadow-[0_20px_44px_rgba(3,26,47,0.08)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_28px_60px_rgba(3,26,47,0.14)]">
      {entry.imageUrl ? (
        <div className="relative h-52 w-full bg-slate-100">
          <Image
            src={entry.imageUrl}
            alt={entry.imageAlt || entry.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : null}

      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-sky-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-800">
            {entryTypeMeta[entry.type].label}
          </span>
          {entry.type === EntryType.APP ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white">
              <Smartphone className="h-3.5 w-3.5" />
              Downloadable
            </span>
          ) : null}
        </div>

        <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{entry.title}</h3>
        <p className="mt-4 text-sm leading-7 text-slate-700">{entry.summary}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={getEntryPath(entry.type, entry.slug)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-700"
          >
            Read more
            <ArrowRight className="h-4 w-4" />
          </Link>
          {entry.type === EntryType.APP && entry.downloadUrl ? (
            <a
              href={entry.downloadUrl}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 transition hover:border-cyan-700 hover:text-cyan-700"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}