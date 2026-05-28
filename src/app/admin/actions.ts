'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  areAdminCredentialsValid,
  clearAdminSession,
  createAdminSession,
  getAdminSession,
} from "@/lib/admin-auth";
import {
  AppPlatform,
  CommentStatus,
  ContactStatus,
  EntryType,
  deleteComment,
  deleteEntry,
  getEntryById,
  getEntryCollectionPath,
  getEntryPath,
  updateCommentStatus,
  updateContactStatus,
  upsertEntry,
} from "@/lib/cms-data";
import { getSiteContent, normalizeSiteContent, parseSiteContentPayload, saveSiteContent } from "@/lib/site-content";
import { saveImageUpload } from "@/lib/uploads";

async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login?error=Session%20expired");
  }

  return session;
}

function isChecked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!areAdminCredentialsValid(username, password)) {
    redirect("/admin/login?error=Invalid%20credentials");
  }

  await createAdminSession(username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveSiteContentAction(formData: FormData) {
  await requireAdmin();

  const payload = String(formData.get("payload") ?? "");

  try {
    const content = parseSiteContentPayload(payload);
    await saveSiteContent(content);
    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin?saved=1");
  } catch {
    redirect("/admin?error=Invalid%20content%20payload");
  }
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdmin();

  try {
    const current = await getSiteContent();
    const nextContent = normalizeSiteContent({
      ...current,
      brand: {
        name: String(formData.get("brandName") ?? "").trim(),
        tagline: String(formData.get("brandTagline") ?? "").trim(),
      },
      hero: {
        ...current.hero,
        eyebrow: String(formData.get("heroEyebrow") ?? "").trim(),
        title: String(formData.get("heroTitle") ?? "").trim(),
        subtitle: String(formData.get("heroSubtitle") ?? "").trim(),
        primaryCta: {
          label: String(formData.get("heroPrimaryLabel") ?? "").trim(),
          href: String(formData.get("heroPrimaryHref") ?? "").trim(),
        },
        secondaryCta: {
          label: String(formData.get("heroSecondaryLabel") ?? "").trim(),
          href: String(formData.get("heroSecondaryHref") ?? "").trim(),
        },
      },
      about: {
        ...current.about,
        title: String(formData.get("aboutTitle") ?? "").trim(),
        partnerPitch: String(formData.get("aboutPartnerPitch") ?? "").trim(),
      },
      missionVision: {
        mission: String(formData.get("mission") ?? "").trim(),
        vision: String(formData.get("vision") ?? "").trim(),
      },
      contact: {
        email: String(formData.get("contactEmail") ?? "").trim(),
        phone: String(formData.get("contactPhone") ?? "").trim(),
        location: String(formData.get("contactLocation") ?? "").trim(),
      },
      sections: {
        ...current.sections,
        services: {
          ...current.sections.services,
          eyebrow: String(formData.get("servicesEyebrow") ?? "").trim(),
          title: String(formData.get("servicesTitle") ?? "").trim(),
          description: String(formData.get("servicesDescription") ?? "").trim(),
        },
        apps: {
          ...current.sections.apps,
          eyebrow: String(formData.get("appsEyebrow") ?? "").trim(),
          title: String(formData.get("appsTitle") ?? "").trim(),
          description: String(formData.get("appsDescription") ?? "").trim(),
          badge: String(formData.get("appsBadge") ?? "").trim(),
        },
        values: {
          ...current.sections.values,
          eyebrow: String(formData.get("valuesEyebrow") ?? "").trim(),
          title: String(formData.get("valuesTitle") ?? "").trim(),
          description: String(formData.get("valuesDescription") ?? "").trim(),
        },
        team: {
          ...current.sections.team,
          eyebrow: String(formData.get("teamEyebrow") ?? "").trim(),
          title: String(formData.get("teamTitle") ?? "").trim(),
          description: String(formData.get("teamDescription") ?? "").trim(),
        },
        stories: {
          ...current.sections.stories,
          eyebrow: String(formData.get("storiesEyebrow") ?? "").trim(),
          title: String(formData.get("storiesTitle") ?? "").trim(),
          description: String(formData.get("storiesDescription") ?? "").trim(),
        },
        insights: {
          ...current.sections.insights,
          eyebrow: String(formData.get("insightsEyebrow") ?? "").trim(),
          title: String(formData.get("insightsTitle") ?? "").trim(),
          description: String(formData.get("insightsDescription") ?? "").trim(),
          badge: String(formData.get("insightsBadge") ?? "").trim(),
        },
        contact: {
          ...current.sections.contact,
          eyebrow: String(formData.get("contactEyebrow") ?? "").trim(),
          title: String(formData.get("contactTitle") ?? "").trim(),
          description: String(formData.get("contactDescription") ?? "").trim(),
        },
      },
    });

    await saveSiteContent(nextContent);
    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin?settingsSaved=1");
  } catch {
    redirect("/admin?error=Unable%20to%20save%20site%20settings");
  }
}

export async function saveEntryAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim() || undefined;
  const type = String(formData.get("type") ?? EntryType.NEWS) as EntryType;
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const imageAlt = String(formData.get("imageAlt") ?? "").trim();
  const currentImageUrl = String(formData.get("currentImageUrl") ?? "").trim() || undefined;
  const appPlatform = String(formData.get("appPlatform") ?? "").trim() || undefined;
  const downloadUrl = String(formData.get("downloadUrl") ?? "").trim() || undefined;
  const secondaryDownloadUrl =
    String(formData.get("secondaryDownloadUrl") ?? "").trim() || undefined;
  const file = formData.get("image") as File | null;

  try {
    const uploadedImageUrl = await saveImageUpload(file);
    const entry = await upsertEntry({
      id,
      type,
      title,
      slug,
      summary,
      content,
      imageAlt,
      imageUrl: uploadedImageUrl ?? currentImageUrl,
      published: isChecked(formData, "published"),
      featured: isChecked(formData, "featured"),
      commentsEnabled: isChecked(formData, "commentsEnabled"),
      appPlatform: appPlatform ? (appPlatform as AppPlatform) : undefined,
      downloadUrl,
      secondaryDownloadUrl,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(getEntryCollectionPath(entry.type));
    revalidatePath(getEntryPath(entry.type, entry.slug));

    redirect(`/admin?entrySaved=1&edit=${entry.id}`);
  } catch {
    redirect(`/admin?error=Unable%20to%20save%20entry${id ? `&edit=${id}` : ""}`);
  }
}

export async function deleteEntryAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect("/admin?error=Missing%20entry%20identifier");
  }

  try {
    const existing = await getEntryById(id);

    if (!existing) {
      redirect("/admin?error=Entry%20not%20found");
    }

    await deleteEntry(id);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(getEntryCollectionPath(existing.type));
    revalidatePath(getEntryPath(existing.type, existing.slug));
    redirect("/admin?entryDeleted=1");
  } catch {
    redirect("/admin?error=Unable%20to%20delete%20entry");
  }
}

export async function updateContactStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? ContactStatus.READ) as ContactStatus;

  try {
    await updateContactStatus(id, status);
    revalidatePath("/admin");
    redirect("/admin?contactUpdated=1");
  } catch {
    redirect("/admin?error=Unable%20to%20update%20contact%20status");
  }
}

export async function updateCommentStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? CommentStatus.APPROVED) as CommentStatus;

  try {
    const updated = await updateCommentStatus(id, status);
    revalidatePath("/admin");
    revalidatePath(getEntryPath(updated.entry.type, updated.entry.slug));
    redirect("/admin?commentUpdated=1");
  } catch {
    redirect("/admin?error=Unable%20to%20update%20comment");
  }
}

export async function deleteCommentAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  try {
    const deleted = await deleteComment(id);
    revalidatePath("/admin");
    revalidatePath(getEntryPath(deleted.entry.type, deleted.entry.slug));
    redirect("/admin?commentDeleted=1");
  } catch {
    redirect("/admin?error=Unable%20to%20delete%20comment");
  }
}