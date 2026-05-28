import "server-only";

import {
  AppPlatform,
  CommentStatus,
  ContactStatus,
  EntryType,
  type Prisma,
  type CmsEntry,
  type ContactMessage,
  type EntryComment,
} from "@prisma/client";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export { AppPlatform, CommentStatus, ContactStatus, EntryType };

export type ManagedEntry = CmsEntry;
export type ManagedComment = EntryComment;
export type ManagedContactMessage = ContactMessage;
export type ManagedEntryWithComments = Prisma.CmsEntryGetPayload<{
  include: { comments: true };
}>;

const DEFAULT_ENTRIES: Array<{
  type: EntryType;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured?: boolean;
  appPlatform?: AppPlatform;
  downloadUrl?: string;
  secondaryDownloadUrl?: string;
}> = [
  {
    type: EntryType.PRODUCT,
    title: "SME ERP and Financing Platform",
    slug: "sme-erp-financing-platform",
    summary:
      "A digital operating system for SMEs that combines ERP workflows with financing access.",
    content:
      "Ionnotek's SME ERP and Financing Platform helps micro, mini, and small businesses digitize invoicing, billing, accounting, credit scoring, loan management, e-commerce, and payment workflows while improving access to financing.",
    featured: true,
  },
  {
    type: EntryType.APP,
    title: "Ionnotek Delivery App Suite",
    slug: "ionnotek-delivery-app-suite",
    summary:
      "A full delivery platform for dispatch coordination, customer ordering, driver tracking, and merchant management.",
    content:
      "The Ionnotek Delivery App Suite supports food delivery, courier dispatch, order management, rider operations, route visibility, notifications, payment workflows, and reporting. It is designed for businesses that need real-time delivery coordination on mobile and web.",
    featured: true,
    appPlatform: AppPlatform.CROSS_PLATFORM,
    downloadUrl: "#contact",
    secondaryDownloadUrl: "#contact",
  },
  {
    type: EntryType.APP,
    title: "Ionnotek Ride Sharing Platform",
    slug: "ionnotek-ride-sharing-platform",
    summary:
      "A ride-hailing application stack for passengers, drivers, admins, pricing, trips, and live operational visibility.",
    content:
      "Ionnotek's ride sharing platform covers rider onboarding, passenger trip booking, live vehicle tracking, fare management, ratings, trip history, and administrative operations. The product can be tailored for corporate transport, public ride hailing, or private fleet use cases.",
    featured: true,
    appPlatform: AppPlatform.CROSS_PLATFORM,
    downloadUrl: "#contact",
    secondaryDownloadUrl: "#contact",
  },
  {
    type: EntryType.KNOWLEDGE,
    title: "AI and Data Science Training Programs",
    slug: "ai-data-science-training-programs",
    summary:
      "Training programs designed to build practical AI, data science, and big data capability inside institutions.",
    content:
      "Ionnotek provides practical IT and ICT training, including Data Science, Artificial Intelligence, and Big Data Hadoop programmes. These can be adapted for enterprise teams, universities, and professional development tracks.",
    featured: true,
  },
  {
    type: EntryType.NEWS,
    title: "Ionnotek Expands Custom Business Platform Portfolio",
    slug: "ionnotek-expands-custom-business-platform-portfolio",
    summary:
      "Ionnotek continues to broaden its portfolio across lending, payroll, automation, and SME technology systems.",
    content:
      "Ionnotek is growing its portfolio of digital products across office automation, custom applications, reporting systems, payroll, lending platforms, SME operations, and mobile experiences for businesses across Africa and beyond.",
  },
  {
    type: EntryType.ARTICLE,
    title: "Why Custom Digitization Beats Generic Business Software",
    slug: "why-custom-digitization-beats-generic-business-software",
    summary:
      "A practical look at why tailored platforms outperform off-the-shelf tools for operationally complex businesses.",
    content:
      "Generic software often forces teams to adapt their business around the tool. Ionnotek takes the opposite approach by studying the operation, identifying waste, bottlenecks, and reporting gaps, then building systems that align with the business process itself.",
  },
];

export const entryTypeMeta = {
  [EntryType.NEWS]: { label: "News", path: "news" },
  [EntryType.ARTICLE]: { label: "Articles", path: "articles" },
  [EntryType.PRODUCT]: { label: "Products", path: "products" },
  [EntryType.KNOWLEDGE]: { label: "Knowledge", path: "knowledge" },
  [EntryType.APP]: { label: "Apps", path: "apps" },
} as const;

export function getEntryPath(type: EntryType, slug: string) {
  return `/${entryTypeMeta[type].path}/${slug}`;
}

export function getEntryCollectionPath(type: EntryType) {
  return `/${entryTypeMeta[type].path}`;
}

const createEntrySchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(EntryType),
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(10),
  content: z.string().min(20),
  imageAlt: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
  commentsEnabled: z.boolean(),
  appPlatform: z.nativeEnum(AppPlatform).optional(),
  downloadUrl: z.string().optional(),
  secondaryDownloadUrl: z.string().optional(),
});

export type EntryMutationInput = z.infer<typeof createEntrySchema> & {
  imageUrl?: string;
};

export async function ensureDefaultEntries() {
  const count = await prisma.cmsEntry.count();

  if (count > 0) {
    return;
  }

  await prisma.cmsEntry.createMany({
    data: DEFAULT_ENTRIES.map((entry) => ({
      type: entry.type,
      title: entry.title,
      slug: entry.slug,
      summary: entry.summary,
      content: entry.content,
      featured: entry.featured ?? false,
      appPlatform: entry.appPlatform,
      downloadUrl: entry.downloadUrl,
      secondaryDownloadUrl: entry.secondaryDownloadUrl,
      published: true,
      commentsEnabled: true,
    })),
    skipDuplicates: true,
  });
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function parseEntryInput(input: Record<string, unknown>) {
  const normalized = {
    ...input,
    slug: normalizeSlug(String(input.slug ?? input.title ?? "")),
  };

  return createEntrySchema.parse(normalized);
}

export async function getAllEntries() {
  await ensureDefaultEntries();

  return prisma.cmsEntry.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getEntriesByType(type: EntryType, publishedOnly = true) {
  await ensureDefaultEntries();

  return prisma.cmsEntry.findMany({
    where: {
      type,
      ...(publishedOnly ? { published: true } : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getFeaturedEntries(limit = 6) {
  await ensureDefaultEntries();

  return prisma.cmsEntry.findMany({
    where: {
      featured: true,
      published: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getEntryBySlug(type: EntryType, slug: string, publishedOnly = true) {
  await ensureDefaultEntries();

  return prisma.cmsEntry.findFirst({
    where: {
      type,
      slug,
      ...(publishedOnly ? { published: true } : {}),
    },
    include: {
      comments: {
        where: {
          status: CommentStatus.APPROVED,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getEntryById(id: string) {
  return prisma.cmsEntry.findUnique({
    where: { id },
  });
}

export async function upsertEntry(input: EntryMutationInput) {
  const payload = parseEntryInput(input);

  const data = {
    type: payload.type,
    title: payload.title,
    slug: payload.slug,
    summary: payload.summary,
    content: payload.content,
    imageUrl: input.imageUrl,
    imageAlt: payload.imageAlt,
    published: payload.published,
    featured: payload.featured,
    commentsEnabled: payload.commentsEnabled,
    appPlatform: payload.type === EntryType.APP ? (payload.appPlatform ?? AppPlatform.CROSS_PLATFORM) : null,
    downloadUrl: payload.type === EntryType.APP ? payload.downloadUrl : null,
    secondaryDownloadUrl: payload.type === EntryType.APP ? payload.secondaryDownloadUrl : null,
  };

  if (payload.id) {
    return prisma.cmsEntry.update({
      where: { id: payload.id },
      data,
    });
  }

  return prisma.cmsEntry.create({
    data,
  });
}

export async function deleteEntry(id: string) {
  return prisma.cmsEntry.delete({
    where: { id },
  });
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}) {
  return prisma.contactMessage.create({
    data: input,
  });
}

export async function getContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  return prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
}

export async function createEntryComment(input: {
  entryId: string;
  authorName: string;
  authorEmail: string;
  body: string;
}) {
  return prisma.entryComment.create({
    data: input,
  });
}

export async function getComments() {
  return prisma.entryComment.findMany({
    include: {
      entry: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateCommentStatus(id: string, status: CommentStatus) {
  return prisma.entryComment.update({
    where: { id },
    data: { status },
    include: {
      entry: true,
    },
  });
}

export async function deleteComment(id: string) {
  return prisma.entryComment.delete({
    where: { id },
    include: {
      entry: true,
    },
  });
}