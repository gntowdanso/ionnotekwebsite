import { Send } from "lucide-react";

import { submitContactAction } from "@/app/site-actions";

type ContactFormProps = {
  returnPath?: string;
};

export function ContactForm({ returnPath = "/" }: ContactFormProps) {
  return (
    <form action={submitContactAction} className="grid gap-4 rounded-[1.75rem] border border-white/15 bg-white/10 p-6 shadow-[0_18px_50px_rgba(3,26,47,0.18)] backdrop-blur">
      <input type="hidden" name="returnPath" value={returnPath} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Your name" className="rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-cyan-400" required />
        <input name="email" type="email" placeholder="Your email" className="rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-cyan-400" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="phone" placeholder="Phone number" className="rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
        <input name="company" placeholder="Company" className="rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
      </div>
      <input name="subject" placeholder="Subject" className="rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
      <textarea name="message" placeholder="Tell Ionnotek what you need" className="min-h-36 rounded-[1.5rem] border border-white/20 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-cyan-400" required />
      <div className="flex justify-end">
        <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-100">
          <Send className="h-4 w-4" />
          Send enquiry
        </button>
      </div>
    </form>
  );
}