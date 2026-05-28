import { LockKeyhole, ShieldCheck } from "lucide-react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { loginAction } from "@/app/admin/actions";
import { BrandMark } from "@/components/brand-mark";
import { getAdminSession } from "@/lib/admin-auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  await connection();

  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.18),_transparent_24%),linear-gradient(180deg,#031a2f_0%,#052b49_48%,#f8fbff_48%,#eef6ff_100%)] px-6 py-10 text-slate-950 sm:px-10 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
        <section className="space-y-8 text-white">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <BrandMark className="h-8 w-8" title="Ionnotek mark" />
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              Ionnotek Admin CMS
            </span>
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
              Manage website content from one protected control room.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              This CMS is backed by your configured database connection and lets you update the
              live homepage content without editing the public page directly.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Database-backed content storage",
              "Server-side credential checks",
              "Reusable JSON content model",
              "Instant homepage revalidation after save",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                <p className="text-sm leading-7 text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_90px_rgba(3,26,47,0.18)] sm:p-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-cyan-50 p-3 text-cyan-700">
              <BrandMark className="h-10 w-10" title="Ionnotek mark" />
              <LockKeyhole className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Secure Access</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Sign in to the CMS
              </h2>
            </div>
          </div>

          <form action={loginAction} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Username</span>
              <input
                name="username"
                type="text"
                autoComplete="username"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white"
                placeholder="CMS admin username"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white"
                placeholder="CMS admin password"
                required
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-cyan-700"
            >
              Enter CMS
            </button>
          </form>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            Use the `CMS_ADMIN_USERNAME`, `CMS_ADMIN_PASSWORD`, and `CMS_SESSION_SECRET` values in
            the root `.env` file to control access.
          </div>
        </section>
      </div>
    </main>
  );
}