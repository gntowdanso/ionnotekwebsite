import {
  AppWindow,
  FileText,
  GraduationCap,
  ImagePlus,
  Inbox,
  LogOut,
  Newspaper,
  Package2,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import {
  deleteCommentAction,
  deleteEntryAction,
  logoutAction,
  saveEntryAction,
  saveSiteContentAction,
  saveSiteSettingsAction,
  updateCommentStatusAction,
  updateContactStatusAction,
} from "@/app/admin/actions";
import { getAdminSession } from "@/lib/admin-auth";
import {
  CommentStatus,
  ContactStatus,
  EntryType,
  entryTypeMeta,
  getAllEntries,
  getComments,
  getContactMessages,
  type ManagedComment,
  type ManagedContactMessage,
  type ManagedEntry,
} from "@/lib/cms-data";
import { getSiteContent, serializeSiteContent } from "@/lib/site-content";

type AdminPageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
    settingsSaved?: string;
    edit?: string;
    entrySaved?: string;
    entryDeleted?: string;
    contactUpdated?: string;
    commentUpdated?: string;
    commentDeleted?: string;
  }>;
};

const typeIcons = {
  [EntryType.NEWS]: Newspaper,
  [EntryType.ARTICLE]: FileText,
  [EntryType.PRODUCT]: Package2,
  [EntryType.KNOWLEDGE]: GraduationCap,
  [EntryType.APP]: AppWindow,
} as const;

const entryTypes: EntryType[] = [
  EntryType.NEWS,
  EntryType.ARTICLE,
  EntryType.PRODUCT,
  EntryType.KNOWLEDGE,
  EntryType.APP,
];

const contactStatuses: ContactStatus[] = [
  ContactStatus.NEW,
  ContactStatus.READ,
  ContactStatus.RESOLVED,
];

const commentStatuses: CommentStatus[] = [
  CommentStatus.PENDING,
  CommentStatus.APPROVED,
  CommentStatus.REJECTED,
];

const adminSections = [
  { id: "entry-editor", label: "Entry editor", description: "Create or update news, apps, and public content." },
  { id: "site-settings", label: "Site settings", description: "Homepage headings, contact details, and section copy." },
  { id: "advanced-content", label: "Advanced content", description: "Structured JSON for services, team, values, and stories." },
  { id: "managed-entries", label: "Managed entries", description: "Browse, edit, or delete public pages." },
  { id: "contact-inbox", label: "Contact inbox", description: "Review and update website enquiries." },
  { id: "comment-moderation", label: "Comment moderation", description: "Approve, reject, or delete comments." },
] as const;

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await connection();

  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [content, entries, contacts, comments, params] = await Promise.all([
    getSiteContent(),
    getAllEntries(),
    getContactMessages(),
    getComments(),
    searchParams,
  ]);

  const entryToEdit = params.edit
    ? entries.find((entry: ManagedEntry) => entry.id === params.edit)
    : undefined;
  const entryCounts = {
    [EntryType.NEWS]: entries.filter((entry: ManagedEntry) => entry.type === EntryType.NEWS).length,
    [EntryType.ARTICLE]: entries.filter((entry: ManagedEntry) => entry.type === EntryType.ARTICLE).length,
    [EntryType.PRODUCT]: entries.filter((entry: ManagedEntry) => entry.type === EntryType.PRODUCT).length,
    [EntryType.KNOWLEDGE]: entries.filter((entry: ManagedEntry) => entry.type === EntryType.KNOWLEDGE).length,
    [EntryType.APP]: entries.filter((entry: ManagedEntry) => entry.type === EntryType.APP).length,
  };

  const cards = [
    { label: "News", value: entryCounts[EntryType.NEWS], icon: Newspaper },
    { label: "Articles", value: entryCounts[EntryType.ARTICLE], icon: FileText },
    { label: "Knowledge", value: entryCounts[EntryType.KNOWLEDGE], icon: GraduationCap },
    {
      label: "Products and Apps",
      value: entryCounts[EntryType.PRODUCT] + entryCounts[EntryType.APP],
      icon: AppWindow,
    },
    { label: "Contact Messages", value: contacts.length, icon: Inbox },
    {
      label: "Pending Comments",
      value: comments.filter((comment: ManagedComment) => comment.status === CommentStatus.PENDING).length,
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#031a2f_0%,#052544_18%,#f3f8ff_18%,#edf4fb_100%)] px-6 py-8 sm:px-10 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-950 px-6 py-6 text-white shadow-[0_28px_90px_rgba(3,26,47,0.28)] sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-slate-100">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              Signed in as {session.username}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Ionnotek CMS</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                Content, apps, messages, and moderation
              </h1>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Manage main website information, create and edit news, articles, products, knowledge
              posts, and app download pages, then review incoming contact messages and comments.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              View website
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-100"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.label}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{card.label}</p>
                  <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
                  {card.value}
                </p>
              </article>
            );
          })}
        </section>

        {params.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}

        {params.saved ||
        params.settingsSaved ||
        params.entrySaved ||
        params.entryDeleted ||
        params.contactUpdated ||
        params.commentUpdated ||
        params.commentDeleted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Changes saved successfully.
          </div>
        ) : null}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(3,26,47,0.06)] sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quick Navigation</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Move through the CMS faster
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              The admin is grouped by task so you can jump between content creation, site settings, moderation, and inbox review without scrolling blindly.
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {adminSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 transition hover:border-cyan-200 hover:bg-cyan-50/40"
              >
                <p className="text-sm font-semibold tracking-[-0.02em] text-slate-950">{section.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.52fr_0.48fr]">
          <section id="entry-editor" className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.06)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Entry Editor</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {entryToEdit ? `Edit ${entryToEdit.title}` : "Create new content entry"}
                </h2>
              </div>
              {entryToEdit ? (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-cyan-700 transition hover:text-cyan-900"
                >
                  Clear editor
                </Link>
              ) : null}
            </div>

            <form action={saveEntryAction} className="mt-6 grid gap-4">
              <input type="hidden" name="id" defaultValue={entryToEdit?.id} />
              <input
                type="hidden"
                name="currentImageUrl"
                defaultValue={entryToEdit?.imageUrl ?? ""}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-700">
                  <span className="font-medium">Content type</span>
                  <select
                    name="type"
                    defaultValue={entryToEdit?.type ?? EntryType.NEWS}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
                  >
                    {entryTypes.map((type) => (
                      <option key={type} value={type}>
                        {entryTypeMeta[type].label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm text-slate-700">
                  <span className="font-medium">Title</span>
                  <input
                    name="title"
                    defaultValue={entryToEdit?.title ?? ""}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-700">
                  <span className="font-medium">Slug</span>
                  <input
                    name="slug"
                    defaultValue={entryToEdit?.slug ?? ""}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-700">
                  <span className="font-medium">Image alt text</span>
                  <input
                    name="imageAlt"
                    defaultValue={entryToEdit?.imageAlt ?? ""}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm text-slate-700">
                <span className="font-medium">Summary</span>
                <textarea
                  name="summary"
                  defaultValue={entryToEdit?.summary ?? ""}
                  className="min-h-28 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-700">
                <span className="font-medium">Full content</span>
                <textarea
                  name="content"
                  defaultValue={entryToEdit?.content ?? ""}
                  className="min-h-48 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
                  required
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-700">
                  <span className="font-medium">Upload image</span>
                  <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-4">
                    <div className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600">
                      <ImagePlus className="h-4 w-4" />
                      Images are stored in `public/uploads`.
                    </div>
                    <input name="image" type="file" accept="image/*" className="block w-full text-sm text-slate-700" />
                    {entryToEdit?.imageUrl ? (
                      <a
                        href={entryToEdit.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 block text-sm text-cyan-700 transition hover:text-cyan-900"
                      >
                        Current image: {entryToEdit.imageUrl}
                      </a>
                    ) : null}
                  </div>
                </label>

                <div className="grid gap-4">
                  <label className="grid gap-2 text-sm text-slate-700">
                    <span className="font-medium">App platform</span>
                    <select
                      name="appPlatform"
                      defaultValue={entryToEdit?.appPlatform ?? ""}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
                    >
                      <option value="">Not an app entry</option>
                      <option value="ANDROID">Android</option>
                      <option value="IOS">iOS</option>
                      <option value="CROSS_PLATFORM">Cross-platform</option>
                      <option value="WEB">Web</option>
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm text-slate-700">
                    <span className="font-medium">Primary download URL</span>
                    <input
                      name="downloadUrl"
                      defaultValue={entryToEdit?.downloadUrl ?? ""}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
                      placeholder="https://play.google.com/..."
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-slate-700">
                    <span className="font-medium">Secondary download URL</span>
                    <input
                      name="secondaryDownloadUrl"
                      defaultValue={entryToEdit?.secondaryDownloadUrl ?? ""}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
                      placeholder="https://apps.apple.com/..."
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                <label className="inline-flex items-center gap-2">
                  <input name="published" type="checkbox" defaultChecked={entryToEdit?.published ?? true} />
                  Published
                </label>
                <label className="inline-flex items-center gap-2">
                  <input name="featured" type="checkbox" defaultChecked={entryToEdit?.featured ?? false} />
                  Featured
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    name="commentsEnabled"
                    type="checkbox"
                    defaultChecked={entryToEdit?.commentsEnabled ?? true}
                  />
                  Comments enabled
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-cyan-700"
                >
                  <Save className="h-4 w-4" />
                  {entryToEdit ? "Update entry" : "Create entry"}
                </button>
              </div>
            </form>
          </section>

          <div className="grid gap-6">
            <section id="site-settings" className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.06)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Structured Site Settings</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    Manage homepage, contact, and section copy
                  </h2>
                </div>
                <p className="max-w-lg text-sm leading-7 text-slate-600">
                  Update the public brand text, homepage headings, contact details, and section copy here.
                  App download links remain in the app entry editor on the left.
                </p>
              </div>

              <form action={saveSiteSettingsAction} className="mt-6 grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm text-slate-700">
                    <span className="font-medium">Brand name</span>
                    <input name="brandName" defaultValue={content.brand.name} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white" required />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-700">
                    <span className="font-medium">Brand tagline</span>
                    <input name="brandTagline" defaultValue={content.brand.tagline} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white" required />
                  </label>
                </div>

                <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">Hero</p>
                  <label className="grid gap-2 text-sm text-slate-700">
                    <span className="font-medium">Eyebrow</span>
                    <input name="heroEyebrow" defaultValue={content.hero.eyebrow} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-700">
                    <span className="font-medium">Title</span>
                    <textarea name="heroTitle" defaultValue={content.hero.title} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-700">
                    <span className="font-medium">Subtitle</span>
                    <textarea name="heroSubtitle" defaultValue={content.hero.subtitle} className="min-h-28 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700">
                      <span className="font-medium">Primary CTA label</span>
                      <input name="heroPrimaryLabel" defaultValue={content.hero.primaryCta.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-700">
                      <span className="font-medium">Primary CTA link</span>
                      <input name="heroPrimaryHref" defaultValue={content.hero.primaryCta.href} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required />
                    </label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700">
                      <span className="font-medium">Secondary CTA label</span>
                      <input name="heroSecondaryLabel" defaultValue={content.hero.secondaryCta.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required />
                    </label>
                    <label className="grid gap-2 text-sm text-slate-700">
                      <span className="font-medium">Secondary CTA link</span>
                      <input name="heroSecondaryHref" defaultValue={content.hero.secondaryCta.href} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required />
                    </label>
                  </div>
                </div>

                <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">Homepage Sections</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Services eyebrow</span><input name="servicesEyebrow" defaultValue={content.sections.services.eyebrow} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Services title</span><input name="servicesTitle" defaultValue={content.sections.services.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  </div>
                  <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Services description</span><textarea name="servicesDescription" defaultValue={content.sections.services.description} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Apps eyebrow</span><input name="appsEyebrow" defaultValue={content.sections.apps.eyebrow} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Apps badge</span><input name="appsBadge" defaultValue={content.sections.apps.badge ?? ""} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  </div>
                  <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Apps title</span><textarea name="appsTitle" defaultValue={content.sections.apps.title} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Apps description</span><textarea name="appsDescription" defaultValue={content.sections.apps.description} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Insights eyebrow</span><input name="insightsEyebrow" defaultValue={content.sections.insights.eyebrow} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Insights badge</span><input name="insightsBadge" defaultValue={content.sections.insights.badge ?? ""} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  </div>
                  <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Insights title</span><input name="insightsTitle" defaultValue={content.sections.insights.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Insights description</span><textarea name="insightsDescription" defaultValue={content.sections.insights.description} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                </div>

                <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">Supporting Copy and Contact</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">About title</span><input name="aboutTitle" defaultValue={content.about.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Partner pitch</span><input name="aboutPartnerPitch" defaultValue={content.about.partnerPitch} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Values eyebrow</span><input name="valuesEyebrow" defaultValue={content.sections.values.eyebrow} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Values title</span><input name="valuesTitle" defaultValue={content.sections.values.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  </div>
                  <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Values description</span><textarea name="valuesDescription" defaultValue={content.sections.values.description} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Team eyebrow</span><input name="teamEyebrow" defaultValue={content.sections.team.eyebrow} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Team title</span><input name="teamTitle" defaultValue={content.sections.team.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  </div>
                  <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Team description</span><textarea name="teamDescription" defaultValue={content.sections.team.description} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Stories eyebrow</span><input name="storiesEyebrow" defaultValue={content.sections.stories.eyebrow} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Stories title</span><input name="storiesTitle" defaultValue={content.sections.stories.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  </div>
                  <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Stories description</span><textarea name="storiesDescription" defaultValue={content.sections.stories.description} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Mission</span><textarea name="mission" defaultValue={content.missionVision.mission} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Vision</span><textarea name="vision" defaultValue={content.missionVision.vision} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Contact eyebrow</span><input name="contactEyebrow" defaultValue={content.sections.contact.eyebrow} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Contact title</span><input name="contactTitle" defaultValue={content.sections.contact.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  </div>
                  <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Contact description</span><textarea name="contactDescription" defaultValue={content.sections.contact.description} className="min-h-24 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Contact email</span><input name="contactEmail" defaultValue={content.contact.email} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Contact phone</span><input name="contactPhone" defaultValue={content.contact.phone} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                    <label className="grid gap-2 text-sm text-slate-700"><span className="font-medium">Contact location</span><input name="contactLocation" defaultValue={content.contact.location} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500" required /></label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-cyan-700"
                  >
                    <Save className="h-4 w-4" />
                    Save structured settings
                  </button>
                </div>
              </form>
            </section>

            <section id="advanced-content" className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.06)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Advanced Website Info</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    JSON content payload
                  </h2>
                </div>
                <p className="max-w-lg text-sm leading-7 text-slate-600">
                  Use the advanced editor for arrays like services, team, values, and stories. It accepts strict JSON and now fills in any missing structured defaults before saving.
                </p>
              </div>

              <form action={saveSiteContentAction} className="mt-6 space-y-5">
                <textarea
                  name="payload"
                  defaultValue={serializeSiteContent(content)}
                  className="min-h-[30rem] w-full rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 font-mono text-sm leading-7 text-cyan-100 outline-none transition focus:border-cyan-400"
                  spellCheck={false}
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-cyan-700"
                  >
                    <Save className="h-4 w-4" />
                    Save advanced website info
                  </button>
                </div>
              </form>
            </section>
          </div>
        </section>

        <section id="managed-entries" className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.06)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Managed Entries</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                News, articles, products, knowledge, and apps
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Each entry becomes a public page and can include uploaded images, app download links,
              and optional comments.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {entries.map((entry) => {
              const Icon = typeIcons[entry.type];

              return (
                <article key={entry.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-cyan-700">
                          {entryTypeMeta[entry.type].label}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
                          {entry.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{entry.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em]">
                          <span
                            className={`rounded-full px-3 py-2 ${entry.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}
                          >
                            {entry.published ? "Published" : "Draft"}
                          </span>
                          {entry.featured ? (
                            <span className="rounded-full bg-cyan-100 px-3 py-2 text-cyan-700">Featured</span>
                          ) : null}
                          {entry.type === EntryType.APP && entry.appPlatform ? (
                            <span className="rounded-full bg-indigo-100 px-3 py-2 text-indigo-700">
                              {entry.appPlatform.replaceAll("_", " ")}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      <Link
                        href={`/admin?edit=${entry.id}`}
                        className="text-sm font-medium text-cyan-700 transition hover:text-cyan-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/${entryTypeMeta[entry.type].path}/${entry.slug}`}
                        className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
                      >
                        Open public page
                      </Link>
                      <form action={deleteEntryAction}>
                        <input type="hidden" name="id" value={entry.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <section id="contact-inbox" className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.06)]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Contact Inbox</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Website contact messages
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              {contacts.length === 0 ? (
                <div className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  No contact messages yet.
                </div>
              ) : (
                contacts.map((message: ManagedContactMessage) => (
                  <article key={message.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                          {message.subject || "General enquiry"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {message.name} · {message.email}
                          {message.phone ? ` · ${message.phone}` : ""}
                          {message.company ? ` · ${message.company}` : ""}
                        </p>
                      </div>
                      <span className="rounded-full bg-cyan-100 px-3 py-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-700">
                        {message.status}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-700">{message.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {contactStatuses.map((status) => (
                        <form key={status} action={updateContactStatusAction}>
                          <input type="hidden" name="id" value={message.id} />
                          <input type="hidden" name="status" value={status} />
                          <button
                            type="submit"
                            className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition ${message.status === status ? "bg-slate-950 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                          >
                            Mark {status.toLowerCase()}
                          </button>
                        </form>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section id="comment-moderation" className="scroll-mt-28 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.06)]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Comment Moderation</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Review public discussion
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              {comments.length === 0 ? (
                <div className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  No comments submitted yet.
                </div>
              ) : (
                comments.map((comment: ManagedComment & { entry: ManagedEntry }) => (
                  <article key={comment.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-cyan-700">
                          {entryTypeMeta[comment.entry.type].label}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                          {comment.entry.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                          {comment.authorName} · {comment.authorEmail}
                        </p>
                      </div>
                      <span className="rounded-full bg-cyan-100 px-3 py-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-700">
                        {comment.status}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-700">{comment.body}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {commentStatuses.map((status) => (
                        <form key={status} action={updateCommentStatusAction}>
                          <input type="hidden" name="id" value={comment.id} />
                          <input type="hidden" name="status" value={status} />
                          <button
                            type="submit"
                            className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition ${comment.status === status ? "bg-slate-950 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                          >
                            {status.toLowerCase()}
                          </button>
                        </form>
                      ))}
                      <form action={deleteCommentAction}>
                        <input type="hidden" name="id" value={comment.id} />
                        <button
                          type="submit"
                          className="rounded-full bg-red-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-red-700 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}