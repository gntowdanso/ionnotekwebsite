'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createContactMessage, createEntryComment } from "@/lib/cms-data";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
  returnPath: z.string().min(1),
});

const commentSchema = z.object({
  entryId: z.string().min(1),
  authorName: z.string().min(2),
  authorEmail: z.email(),
  body: z.string().min(5),
  entryPath: z.string().min(1),
});

export async function submitContactAction(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    company: String(formData.get("company") ?? "").trim() || undefined,
    subject: String(formData.get("subject") ?? "").trim() || undefined,
    message: String(formData.get("message") ?? "").trim(),
    returnPath: String(formData.get("returnPath") ?? "/").trim(),
  });

  if (!parsed.success) {
    redirect(`${String(formData.get("returnPath") ?? "/")}?contact=error#contact`);
  }

  await createContactMessage(parsed.data);
  revalidatePath("/admin");
  redirect(`${parsed.data.returnPath}?contact=success#contact`);
}

export async function submitCommentAction(formData: FormData) {
  const parsed = commentSchema.safeParse({
    entryId: String(formData.get("entryId") ?? "").trim(),
    authorName: String(formData.get("authorName") ?? "").trim(),
    authorEmail: String(formData.get("authorEmail") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    entryPath: String(formData.get("entryPath") ?? "/").trim(),
  });

  if (!parsed.success) {
    redirect(`${String(formData.get("entryPath") ?? "/")}?comment=error#comments`);
  }

  await createEntryComment({
    entryId: parsed.data.entryId,
    authorName: parsed.data.authorName,
    authorEmail: parsed.data.authorEmail,
    body: parsed.data.body,
  });

  revalidatePath("/admin");
  redirect(`${parsed.data.entryPath}?comment=pending#comments`);
}