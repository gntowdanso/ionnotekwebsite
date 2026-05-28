import { ArrowRight, ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { getSiteContent } from "@/lib/site-content";

type PublicSiteShellProps = {
  children: React.ReactNode;
};

const primaryLinks = [
  { href: "/#about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/apps", label: "Apps" },
  { href: "/news", label: "News" },
  { href: "/articles", label: "Articles" },
  { href: "/#contact", label: "Contact" },
];

const footerSections = {
  quickLinks: [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About Ionnotek" },
    { href: "/#stories", label: "Customer stories" },
    { href: "/#contact", label: "Contact" },
  ],
  services: [
    { href: "/products", label: "Products" },
    { href: "/apps", label: "Apps and downloads" },
    { href: "/knowledge", label: "Knowledge hub" },
    { href: "/admin", label: "Admin CMS" },
  ],
  resources: [
    { href: "/news", label: "News" },
    { href: "/articles", label: "Articles" },
    { href: "/knowledge", label: "Knowledge" },
    { href: "/products", label: "Solutions catalog" },
  ],
};

export async function PublicSiteShell({ children }: PublicSiteShellProps) {
  const content = await getSiteContent();

  const tickerItems = [
    content.brand.tagline,
    "Digitization and office automation",
    "Custom software and AI delivery",
    "Delivery and ride-sharing platforms",
    content.contact.phone,
    content.contact.email,
  ];

  const scrollingItems = [...tickerItems, ...tickerItems];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(231,242,252,0.98))] text-slate-950">
      <div data-site-header className="sticky top-0 z-50 border-b border-slate-200/80 shadow-[0_10px_35px_rgba(3,26,47,0.08)] backdrop-blur">
        <div className="overflow-hidden border-b border-cyan-300/10 bg-slate-950 text-white">
          <div className="mx-auto flex max-w-7xl overflow-hidden px-6 sm:px-10 lg:px-12">
            <div className="ticker-track flex min-w-max items-center gap-8 py-3 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-cyan-100">
              {scrollingItems.map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-8 whitespace-nowrap">
                  <span>{item}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                </span>
              ))}
            </div>
          </div>
        </div>

        <header className="bg-white/95">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-4 sm:px-10 lg:px-12">
            <Link href="/" className="flex items-center gap-3 text-slate-950 transition hover:text-cyan-800">
              <BrandMark className="h-12 w-12 shrink-0" title={`${content.brand.name} mark`} />
              <div>
                <p className="text-sm uppercase tracking-[0.34em] text-cyan-700">{content.brand.name}</p>
                <p className="text-xs text-slate-600">{content.brand.tagline}</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 lg:flex">
              {primaryLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-cyan-700">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${content.contact.email}`}
                className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-700 hover:text-cyan-700 sm:inline-flex"
              >
                {content.contact.email}
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-800"
              >
                Reach Ionnotek
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>
      </div>

      {children}

      <footer className="mt-16 bg-slate-950 text-slate-200">
        <div className="border-b border-white/10 bg-[linear-gradient(135deg,#031423_0%,#07365f_48%,#0b567c_100%)]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Institutional technology partner</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                A stronger digital front door for customers, teams, and operations.
              </h2>
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-100"
            >
              Start a conversation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.3fr_repeat(3,0.8fr)] lg:px-12">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <BrandMark className="h-12 w-12 shrink-0" title={`${content.brand.name} mark`} />
              <div>
                <p className="text-sm uppercase tracking-[0.34em] text-cyan-300">{content.brand.name}</p>
                <p className="text-sm text-slate-300">{content.brand.tagline}</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-300">
              Ionnotek designs digital systems for enterprises that need reliable software, automation, reporting,
              AI, and customer-facing platforms that fit real operating conditions.
            </p>
            <div className="grid gap-3 text-sm text-slate-200">
              <a href={`mailto:${content.contact.email}`} className="inline-flex items-center gap-3 transition hover:text-white">
                <Mail className="h-4 w-4 text-cyan-300" />
                <span>{content.contact.email}</span>
              </a>
              <div className="inline-flex items-center gap-3">
                <Phone className="h-4 w-4 text-cyan-300" />
                <span>{content.contact.phone}</span>
              </div>
              <div className="inline-flex items-center gap-3">
                <MapPin className="h-4 w-4 text-cyan-300" />
                <span>{content.contact.location}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Quick links</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              {footerSections.quickLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Platforms</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              {footerSections.services.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Resources</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              {footerSections.resources.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-5 text-xs uppercase tracking-[0.22em] text-slate-400 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <p>{content.brand.name} digital systems and automation</p>
            <p>Built for enterprise, SME, and platform growth</p>
          </div>
        </div>
      </footer>
    </div>
  );
}