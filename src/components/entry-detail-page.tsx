import { Download, MessageSquareText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { submitCommentAction } from "@/app/site-actions";
import { getEntryCollectionPath, type ManagedEntryWithComments } from "@/lib/cms-data";

type EntryDetailPageProps = {
  entry: ManagedEntryWithComments;
  commentState?: string;
};

export function EntryDetailPage({ entry, commentState }: EntryDetailPageProps) {
  const collectionPath = getEntryCollectionPath(entry.type);
  const entryPath = `${collectionPath}/${entry.slug}`;
  const paragraphs = entry.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#031423_0%,#062847_22%,#eef6ff_22%,#f8fbff_100%)]">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-10 sm:px-10 lg:pb-24">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/8 px-4 py-3 text-white backdrop-blur md:px-6">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-cyan-300">Ionnotek</p>
            <p className="text-xs text-slate-300">Content and product experience</p>
          </div>
          <Link href={collectionPath} className="text-sm text-slate-200 transition hover:text-white">
            Back to listing
          </Link>
        </div>

        <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(3,26,47,0.06)]">
          {entry.imageUrl ? (
            <div className="relative h-80 w-full bg-slate-100">
              <Image src={entry.imageUrl} alt={entry.imageAlt || entry.title} fill className="object-cover" sizes="100vw" />
            </div>
          ) : null}

          <div className="p-8 sm:p-10">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-700">{entry.title}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {entry.summary}
            </h1>

            <div className="mt-8 grid gap-5 text-base leading-8 text-slate-700">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {entry.downloadUrl || entry.secondaryDownloadUrl ? (
              <div className="mt-10 flex flex-wrap gap-3 rounded-[1.75rem] bg-slate-950 p-6 text-white">
                {entry.downloadUrl ? (
                  <a href={entry.downloadUrl} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-100">
                    <Download className="h-4 w-4" />
                    Download primary app
                  </a>
                ) : null}
                {entry.secondaryDownloadUrl ? (
                  <a href={entry.secondaryDownloadUrl} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-300 hover:text-cyan-200">
                    <Download className="h-4 w-4" />
                    Download secondary app
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </article>

        <section id="comments" className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.06)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Comments</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  Join the conversation
                </h2>
              </div>
            </div>

            {commentState === "pending" ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Your comment has been submitted for review.
              </div>
            ) : null}
            {commentState === "error" ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Please complete all comment fields before submitting.
              </div>
            ) : null}

            {entry.commentsEnabled ? (
              <form action={submitCommentAction} className="mt-6 grid gap-4">
                <input type="hidden" name="entryId" value={entry.id} />
                <input type="hidden" name="entryPath" value={entryPath} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input name="authorName" placeholder="Your name" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white" required />
                  <input name="authorEmail" type="email" placeholder="Your email" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white" required />
                </div>
                <textarea name="body" placeholder="Write your comment" className="min-h-32 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white" required />
                <div className="flex justify-end">
                  <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-700">
                    Submit comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-600">
                Comments are disabled for this entry.
              </div>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.06)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Approved comments</p>
            <div className="mt-6 grid gap-4">
              {entry.comments.length === 0 ? (
                <div className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  No approved comments yet.
                </div>
              ) : (
                entry.comments.map((comment) => (
                  <article key={comment.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-medium text-slate-950">{comment.authorName}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{comment.body}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}