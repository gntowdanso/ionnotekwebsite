import {
  AppWindow,
  ArrowRight,
  ChevronRight,
  Database,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";

import { ContactForm } from "@/components/contact-form";
import { EntryCard } from "@/components/entry-card";
import { HashAnchorScroller } from "@/components/hash-anchor-scroller";
import { EntryType, getEntriesByType } from "@/lib/cms-data";
import { getCmsIcon } from "@/lib/cms-icons";
import { getSiteContent } from "@/lib/site-content";

const featuredClients = [
  "Bayport Savings and Loans",
  "PH Home Base Hire Purchase",
  "Pentecost University",
  "All Nation University",
  "Shield Microfinance",
  "JD Oil Link",
];

export default async function Home() {
  await connection();

  const [content, appEntries, newsEntries, articleEntries, knowledgeEntries] = await Promise.all([
    getSiteContent(),
    getEntriesByType(EntryType.APP),
    getEntriesByType(EntryType.NEWS),
    getEntriesByType(EntryType.ARTICLE),
    getEntriesByType(EntryType.KNOWLEDGE),
  ]);

  const insightEntries = [...newsEntries, ...articleEntries, ...knowledgeEntries].slice(0, 6);

  return (
    <main className="overflow-hidden bg-[linear-gradient(180deg,#02111f_0%,#073459_17%,#edf6ff_17%,#f4f9ff_100%)] text-slate-950">
      <HashAnchorScroller />
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(18,153,214,0.35),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.14),_transparent_20%)]" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 pb-16 pt-8 sm:px-10 lg:px-12 lg:pb-24">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-white/12 bg-slate-950/72 px-4 py-4 text-white shadow-[0_20px_50px_rgba(2,17,31,0.28)] md:px-6">
            <div>
              <p className="text-sm uppercase tracking-[0.34em] text-cyan-300">{content.brand.name}</p>
              <p className="text-xs text-slate-200">{content.brand.tagline}</p>
            </div>
            <nav className="hidden flex-wrap items-center gap-6 text-sm text-slate-100 md:flex">
              <a href="#about" className="transition hover:text-white">
                About
              </a>
              <a href="#services" className="transition hover:text-white">
                Services
              </a>
              <a href="#apps" className="transition hover:text-white">
                Apps
              </a>
              <a href="#stories" className="transition hover:text-white">
                Stories
              </a>
              <a href="#contact" className="transition hover:text-white">
                Contact
              </a>
            </nav>
          </header>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="space-y-8 text-white">
              <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
                <Sparkles className="h-4 w-4" />
                {content.hero.eyebrow}
              </div>

              <div className="space-y-6">
                <h1 className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                  {content.hero.title}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">
                  {content.hero.subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href={content.hero.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-100"
                >
                  {content.hero.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={content.hero.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/8 px-6 py-3 text-sm font-medium text-white transition hover:border-cyan-200 hover:bg-white/12"
                >
                  {content.hero.secondaryCta.label}
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {content.stats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.5rem] border border-white/14 bg-slate-950/52 p-4 shadow-[0_16px_35px_rgba(2,17,31,0.2)]">
                    <p className="text-3xl font-semibold tracking-[-0.05em] text-white">{stat.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-100">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/15 bg-slate-950/72 p-6 text-white shadow-[0_28px_90px_rgba(3,26,47,0.34)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.26em] text-cyan-200">Why Ionnotek</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
                    Systems built around your workflow.
                  </h2>
                </div>
                <div className="rounded-2xl bg-cyan-300/15 p-3 text-cyan-200">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-6 text-sm leading-8 text-slate-100">{content.about.partnerPitch}</p>

              <div className="mt-8 grid gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-5">
                <div className="flex items-center justify-between text-sm text-slate-100">
                  <span>Website CMS</span>
                  <span className="text-cyan-200">Enabled</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-100">
                  <span>Database</span>
                  <span className="text-cyan-200">PostgreSQL</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-100">
                  <span>Architecture</span>
                  <span className="text-cyan-200">Next.js App Router</span>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {featuredClients.map((client) => (
                  <div
                    key={client}
                    className="rounded-2xl border border-white/15 bg-white/8 px-4 py-4 text-sm text-slate-100"
                  >
                    {client}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
        <div className="grid gap-8 rounded-[2rem] border border-sky-100 bg-white p-7 shadow-[0_24px_60px_rgba(3,26,47,0.08)] sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">About</p>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {content.about.title}
            </h2>
            <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-base">
              Practical digital transformation, clearer operations, and software that fits the way teams already work.
            </p>
          </div>
          <div className="grid gap-4">
            {content.about.paragraphs.map((paragraph) => (
              <div key={paragraph} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-5 sm:px-6">
                <p className="text-base leading-8 text-slate-800 sm:text-lg">{paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 lg:px-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">{content.sections.services.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {content.sections.services.title}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-700 sm:text-base">
            {content.sections.services.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {content.services.map((service) => {
            const Icon = getCmsIcon(service.icon);

            return (
              <article
                key={service.title}
                className="group rounded-[1.9rem] border border-sky-100 bg-white p-7 shadow-[0_20px_45px_rgba(3,26,47,0.08)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_28px_65px_rgba(3,26,47,0.12)]"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700 transition group-hover:bg-cyan-700 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <Star className="h-4 w-4 text-cyan-500" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{service.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_1fr] lg:px-12 lg:py-24">
        <article className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_28px_90px_rgba(3,26,47,0.18)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Mission</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
            Empowering businesses and individuals through intuitive digital systems.
          </h2>
          <p className="mt-5 text-sm leading-8 text-slate-300 sm:text-base">{content.missionVision.mission}</p>
        </article>

        <article className="rounded-[2rem] border border-sky-200 bg-white p-8 shadow-[0_20px_45px_rgba(3,26,47,0.08)] sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">Vision</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
            A digitized future where transformation is accessible and practical.
          </h2>
          <p className="mt-5 text-sm leading-8 text-slate-700 sm:text-base">{content.missionVision.vision}</p>
        </article>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 lg:px-12">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#031423_0%,#052e52_55%,#0b4d79_100%)] p-8 text-white shadow-[0_28px_90px_rgba(3,26,47,0.22)] sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Solutions</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                End-to-end platforms designed by Ionnotek.
              </h2>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-cyan-200">
              <Database className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.solutions.map((solution) => (
              <article key={solution.title} className="rounded-[1.5rem] border border-white/10 bg-white/7 p-5">
                <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">{solution.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-100">{solution.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="apps" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">{content.sections.apps.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {content.sections.apps.title}
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-cyan-50 px-4 py-3 text-sm text-cyan-700">
            <AppWindow className="h-4 w-4" />
            {content.sections.apps.badge}
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
          {content.sections.apps.description}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {appEntries.slice(0, 3).map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Link href="/apps" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-cyan-700 hover:text-cyan-700">
            Explore all apps
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">{content.sections.values.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {content.sections.values.title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
            {content.sections.values.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {content.values.map((value) => {
            const Icon = getCmsIcon(value.icon);

            return (
              <article key={value.title} className="rounded-[1.75rem] border border-sky-100 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.08)]">
                <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700 w-fit">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-slate-950">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{value.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 pb-16 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:px-12 lg:pb-24">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">{content.sections.team.eyebrow}</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {content.sections.team.title}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-700 sm:text-base">
            {content.sections.team.description}
          </p>
        </div>
        <div className="grid gap-5">
          {content.team.map((member) => (
            <article key={member.name} className="rounded-[1.75rem] border border-sky-100 bg-white p-6 shadow-[0_18px_40px_rgba(3,26,47,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-700">{member.role}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{member.name}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="stories" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 pb-16 sm:px-10 lg:px-12 lg:pb-24">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">{content.sections.stories.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {content.sections.stories.title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
            {content.sections.stories.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-2">
          {content.stories.map((story) => (
            <article key={`${story.client}-${story.title}`} className="rounded-[1.8rem] border border-sky-100 bg-white p-7 shadow-[0_20px_45px_rgba(3,26,47,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-700">{story.client}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{story.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-700">{story.summary}</p>

              <div className="mt-6 grid gap-3">
                {story.outcomes.map((outcome) => (
                  <div key={outcome} className="flex gap-3 rounded-2xl bg-sky-50 px-4 py-4 text-sm leading-7 text-slate-800">
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-cyan-700" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>

              {story.contactName || story.email || story.phone ? (
                <div className="mt-6 rounded-[1.5rem] border border-cyan-100 bg-cyan-50 px-5 py-4 text-sm leading-7 text-slate-700">
                  <p className="font-medium text-slate-950">Reference Contact</p>
                  <p>{story.contactName}</p>
                  {story.email ? <p>{story.email}</p> : null}
                  {story.phone ? <p>{story.phone}</p> : null}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 lg:px-12 lg:pb-24">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">{content.sections.insights.eyebrow}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {content.sections.insights.title}
            </h2>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-4 py-3 text-sm text-white">
            <Newspaper className="h-4 w-4 text-cyan-300" />
            {content.sections.insights.badge}
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
          {content.sections.insights.description}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {insightEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/news" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 transition hover:border-cyan-700 hover:text-cyan-700">
            News
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/articles" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 transition hover:border-cyan-700 hover:text-cyan-700">
            Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/knowledge" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 transition hover:border-cyan-700 hover:text-cyan-700">
            Knowledge
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 transition hover:border-cyan-700 hover:text-cyan-700">
            Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 pb-20 sm:px-10 lg:px-12">
        <div className="rounded-[2.2rem] bg-[linear-gradient(135deg,#031423_0%,#07365f_48%,#0b567c_100%)] p-8 text-white shadow-[0_32px_100px_rgba(3,26,47,0.24)] sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{content.sections.contact.eyebrow}</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
                {content.sections.contact.title}
              </h2>
              <p className="mt-5 text-sm leading-8 text-slate-100 sm:text-base">
                {content.sections.contact.description}
              </p>
              <div className="mt-6 grid gap-3 text-sm text-slate-100 sm:text-base">
                <a href={`mailto:${content.contact.email}`} className="rounded-full bg-white px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-100">
                  {content.contact.email}
                </a>
                <div>{content.contact.phone}</div>
                <div>{content.contact.location}</div>
                <Link href="/admin" className="text-cyan-200 transition hover:text-white">
                  Open admin CMS
                </Link>
              </div>
            </div>

            <div>
              <ContactForm returnPath="/" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
