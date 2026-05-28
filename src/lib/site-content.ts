import "server-only";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const brandSchema = z.object({
  name: z.string().min(1).default("Ionnotek"),
  tagline: z.string().min(1).default("Digitization, automation, software, AI"),
});

const sectionCopySchema = z.object({
  eyebrow: z.string().min(1).default("Section"),
  title: z.string().min(1).default("Section title"),
  description: z.string().min(1).default("Section description"),
  badge: z.string().optional().default(""),
});

const heroSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  primaryCta: linkSchema,
  secondaryCta: linkSchema,
});

const statSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

const aboutSchema = z.object({
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  partnerPitch: z.string().min(1),
});

const serviceSchema = z.object({
  title: z.string().min(1),
  icon: z.string().min(1),
  description: z.string().min(1),
});

const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const valueSchema = z.object({
  title: z.string().min(1),
  icon: z.string().min(1),
  description: z.string().min(1),
});

const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
});

const storySchema = z.object({
  title: z.string().min(1),
  client: z.string().min(1),
  summary: z.string().min(1),
  outcomes: z.array(z.string().min(1)).min(1),
  contactName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

const missionVisionSchema = z.object({
  mission: z.string().min(1),
  vision: z.string().min(1),
});

const contactSchema = z.object({
  email: z.string().min(1),
  phone: z.string().min(1),
  location: z.string().min(1),
});

export const siteContentSchema = z.object({
  brand: brandSchema.default({
    name: "Ionnotek",
    tagline: "Digitization, automation, software, AI",
  }),
  hero: heroSchema,
  stats: z.array(statSchema).min(1),
  about: aboutSchema,
  services: z.array(serviceSchema).min(1),
  solutions: z.array(productSchema).min(1),
  missionVision: missionVisionSchema,
  values: z.array(valueSchema).min(1),
  team: z.array(teamMemberSchema).min(1),
  stories: z.array(storySchema).min(1),
  contact: contactSchema,
  sections: z
    .object({
      services: sectionCopySchema.default({
        eyebrow: "Capabilities",
        title: "Services designed for real business operations.",
        description:
          "We identify operational challenges, remove friction, and deliver seamless solutions that strengthen productivity, reporting, customer integration, and growth.",
        badge: "",
      }),
      apps: sectionCopySchema.default({
        eyebrow: "Mobile and iOS Apps",
        title: "Delivery and ride sharing platforms ready for download and deployment.",
        description:
          "Explore Ionnotek delivery apps, ride sharing platforms, and other downloadable mobile experiences built for customers, drivers, field teams, and business operations.",
        badge: "Android, iOS, and cross-platform app delivery",
      }),
      values: sectionCopySchema.default({
        eyebrow: "Core Values",
        title: "How Ionnotek works with clients and teams.",
        description:
          "These values shape how we build, collaborate, and deliver long-term technology value.",
        badge: "",
      }),
      team: sectionCopySchema.default({
        eyebrow: "Leadership",
        title: "Experienced operators guiding solution delivery.",
        description:
          "Leadership with experience across engineering, operations, commercial growth, and long-term delivery.",
        badge: "",
      }),
      stories: sectionCopySchema.default({
        eyebrow: "Customer Stories",
        title: "Selected delivery work across automation, lending, payroll, and SME platforms.",
        description:
          "These projects show how Ionnotek translates complex operational needs into workable digital systems.",
        badge: "",
      }),
      insights: sectionCopySchema.default({
        eyebrow: "Latest Insights",
        title: "News, articles, and knowledge resources from Ionnotek.",
        description:
          "Fresh updates, opinion, and practical guidance published directly from the admin CMS.",
        badge: "Managed from the admin CMS",
      }),
      contact: sectionCopySchema.default({
        eyebrow: "Contact",
        title: "Ready to digitize operations, automate reporting, or build a custom platform?",
        description:
          "Ionnotek helps organizations modernize workflows, strengthen insight generation, reduce cost, and create practical digital systems that support growth.",
        badge: "",
      }),
    })
    .default({
      services: {
        eyebrow: "Capabilities",
        title: "Services designed for real business operations.",
        description:
          "We identify operational challenges, remove friction, and deliver seamless solutions that strengthen productivity, reporting, customer integration, and growth.",
        badge: "",
      },
      apps: {
        eyebrow: "Mobile and iOS Apps",
        title: "Delivery and ride sharing platforms ready for download and deployment.",
        description:
          "Explore Ionnotek delivery apps, ride sharing platforms, and other downloadable mobile experiences built for customers, drivers, field teams, and business operations.",
        badge: "Android, iOS, and cross-platform app delivery",
      },
      values: {
        eyebrow: "Core Values",
        title: "How Ionnotek works with clients and teams.",
        description:
          "These values shape how we build, collaborate, and deliver long-term technology value.",
        badge: "",
      },
      team: {
        eyebrow: "Leadership",
        title: "Experienced operators guiding solution delivery.",
        description:
          "Leadership with experience across engineering, operations, commercial growth, and long-term delivery.",
        badge: "",
      },
      stories: {
        eyebrow: "Customer Stories",
        title: "Selected delivery work across automation, lending, payroll, and SME platforms.",
        description:
          "These projects show how Ionnotek translates complex operational needs into workable digital systems.",
        badge: "",
      },
      insights: {
        eyebrow: "Latest Insights",
        title: "News, articles, and knowledge resources from Ionnotek.",
        description:
          "Fresh updates, opinion, and practical guidance published directly from the admin CMS.",
        badge: "Managed from the admin CMS",
      },
      contact: {
        eyebrow: "Contact",
        title: "Ready to digitize operations, automate reporting, or build a custom platform?",
        description:
          "Ionnotek helps organizations modernize workflows, strengthen insight generation, reduce cost, and create practical digital systems that support growth.",
        badge: "",
      },
    }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

const CMS_KEY = "ionnotek-site-content";

export const defaultSiteContent: SiteContent = {
  brand: {
    name: "Ionnotek",
    tagline: "Digitization, automation, software, AI",
  },
  hero: {
    eyebrow: "Digitization. Automation. AI.",
    title: "Ionnotek builds digital systems that fit the way African businesses actually operate.",
    subtitle:
      "We design office automation, custom software, data-driven reporting, AI solutions, and ICT training for SMEs and large enterprises across Africa and beyond.",
    primaryCta: {
      label: "Talk to Ionnotek",
      href: "#contact",
    },
    secondaryCta: {
      label: "View customer stories",
      href: "#stories",
    },
  },
  stats: [
    {
      value: "20+",
      label: "Years of founder-led industry experience",
    },
    {
      value: "50+",
      label: "BOG returns automated for Bayport via ORASS API",
    },
    {
      value: "1000+",
      label: "Bayport agents supported through web and mobile leads apps",
    },
    {
      value: "Africa+",
      label: "Solutions delivered for organizations in Africa and beyond",
    },
  ],
  about: {
    title: "About Ionnotek",
    paragraphs: [
      "Ionnotek is an IT and ICT company focused on digitization, office automation, custom software, data-driven reporting, and IT training for small, medium, and large organizations.",
      "The company works closely with enterprises to understand operational bottlenecks and deliver seamless technology solutions that match existing business processes without friction.",
      "Ionnotek helps businesses eliminate waste, reduce redundancy, connect better with customers, improve insight generation, lower cost, and create new products that accelerate growth.",
    ],
    partnerPitch:
      "We become a technology partner that helps your business move faster with systems built around your actual workflow instead of forcing your team into generic software.",
  },
  services: [
    {
      title: "Web App Development",
      icon: "globe",
      description:
        "Responsive, scalable, and secure web applications built with modern engineering practices and aligned to business needs.",
    },
    {
      title: "Mobile App Development",
      icon: "smartphone",
      description:
        "Native and cross-platform Android and iOS applications designed for engagement, usability, and conversion.",
    },
    {
      title: "API Integration",
      icon: "plug",
      description:
        "Secure integration with third-party services and internal systems to improve interoperability and extend platform capability.",
    },
    {
      title: "General Digitization",
      icon: "scan-search",
      description:
        "Document digitization, workflow automation, customer experience modernization, and broader digital transformation support.",
    },
    {
      title: "Robotic Process Automation",
      icon: "bot",
      description:
        "Automation of repetitive, rules-based processes so teams can focus on decision-making, innovation, and growth.",
    },
    {
      title: "Data Science and AI Solutions",
      icon: "brain-circuit",
      description:
        "Predictive analytics, machine learning, NLP, and intelligent reporting that turn data into decisions.",
    },
  ],
  solutions: [
    {
      title: "Mobile Banking",
      description: "End-to-end digital banking workflows tailored for customer access and operational control.",
    },
    {
      title: "Credit and Loans Management",
      description: "Loan origination, approval, tracking, and repayment tooling designed for financial institutions.",
    },
    {
      title: "Accounting Software",
      description: "Financial processing and reporting systems that improve visibility and control.",
    },
    {
      title: "Inventory Software",
      description: "Inventory movement, stock tracking, requisitions, and distribution workflows.",
    },
    {
      title: "School and Church Management",
      description: "Operational systems designed for education and faith-based organizations.",
    },
    {
      title: "Cloud Payroll",
      description: "Payroll platforms for processing, reporting, statutory outputs, and employee self-service needs.",
    },
  ],
  missionVision: {
    mission:
      "To empower businesses and individuals through innovative digital solutions and mobile applications that are intuitive, efficient, and scalable.",
    vision:
      "To become a global leader in the ICT industry, recognized for innovation, excellence, and customer satisfaction in a fully digitized world.",
  },
  values: [
    {
      title: "Innovation",
      icon: "sparkles",
      description:
        "We continuously implement modern technologies to deliver practical digital solutions with clear business value.",
    },
    {
      title: "Integrity",
      icon: "shield-check",
      description:
        "We operate with honesty, transparency, and ethical discipline in every client engagement.",
    },
    {
      title: "Customer-Centricity",
      icon: "users",
      description:
        "We listen closely, understand the need behind the request, and build solutions that genuinely fit the client.",
    },
    {
      title: "Excellence",
      icon: "award",
      description:
        "We aim for high quality in our products, services, and every interaction around them.",
    },
    {
      title: "Collaboration",
      icon: "handshake",
      description:
        "We work closely with clients, partners, and teammates because strong outcomes are built together.",
    },
  ],
  team: [
    {
      name: "Godwin Ntow Danso",
      role: "Founder and CEO",
      bio:
        "Engineer and banker with more than 20 years of corporate experience across banking, telecommunications, and education, including software, credit, and project management.",
    },
    {
      name: "Remeo Nketsiah",
      role: "Chief Operating Officer",
      bio:
        "Operations leader with over 30 years of experience in project management, business management, and process engineering.",
    },
    {
      name: "Emma Ntow Danso",
      role: "Chief Commercial Officer",
      bio:
        "Business development executive with more than 10 years of experience building and reviving SMEs across multiple industries.",
    },
  ],
  stories: [
    {
      title: "BOG ORASS Returns Automation",
      client: "Bayport Savings and Loans",
      summary:
        "Ionnotek automated more than 50 Bank of Ghana returns through the ORASS API, including data extraction, cleaning, aggregation, mapping, validation, and automated submission workflows.",
      outcomes: [
        "Connected Bayport to BOG via a dedicated web application",
        "Enabled manual preparation with automated submission",
        "Mapped hundreds of fields into the BOG return format",
      ],
      contactName: "Nathaniel Nortey",
      email: "nathaniel.nortey@bayportghana.com",
      phone: "0577680922",
    },
    {
      title: "Leads Web and Mobile Platform",
      client: "Bayport Savings and Loans",
      summary:
        "Ionnotek developed a fully functional leads platform for web and mobile that enables more than 1,000 agents to receive and work monthly leads efficiently.",
      outcomes: [
        "Web and mobile access for field teams",
        "Monthly lead distribution at scale",
        "Improved agent productivity and follow-up speed",
      ],
      contactName: "Nathaniel Nortey",
      email: "nathaniel.nortey@bayportghana.com",
      phone: "0244968847",
    },
    {
      title: "Loan and Credit Management",
      client: "PH Home Based Hire Purchase",
      summary:
        "Ionnotek built a credit and loan management solution to support operational control and lending workflows.",
      outcomes: [
        "Streamlined lending operations",
        "Improved tracking and process management",
      ],
      contactName: "Eric Ansah",
      phone: "0267775340",
    },
    {
      title: "Cloud Payroll Platform",
      client: "Pentecost University",
      summary:
        "Pentecost University currently uses a cloud-based payroll system developed by Ionnotek for payroll processing and reporting.",
      outcomes: [
        "Cloud-based payroll processing",
        "Improved reporting and payroll management",
      ],
      contactName: "Esther Amissah Ansah",
      phone: "0244968847",
    },
    {
      title: "SME ERP and Financing Platform",
      client: "Ionnotek Innovation Program",
      summary:
        "Ionnotek designed an SME ERP and financing platform to digitize micro, mini, and small enterprises while connecting them to financiers through better operational data and credit workflows.",
      outcomes: [
        "Invoicing, billing, and accounting workflows",
        "Credit scoring and loan management modules",
        "Web, mobile, e-commerce, and payment integration support",
      ],
    },
  ],
  contact: {
    email: "hello@ionnotek.com",
    phone: "+233 24 000 0000",
    location: "Ghana, serving Africa and beyond",
  },
  sections: {
    services: {
      eyebrow: "Capabilities",
      title: "Services designed for real business operations.",
      description:
        "We identify operational challenges, remove friction, and deliver seamless solutions that strengthen productivity, reporting, customer integration, and growth.",
      badge: "",
    },
    apps: {
      eyebrow: "Mobile and iOS Apps",
      title: "Delivery and ride sharing platforms ready for download and deployment.",
      description:
        "Explore Ionnotek delivery apps, ride sharing platforms, and other downloadable mobile experiences built for customers, drivers, field teams, and business operations.",
      badge: "Android, iOS, and cross-platform app delivery",
    },
    values: {
      eyebrow: "Core Values",
      title: "How Ionnotek works with clients and teams.",
      description:
        "These values shape how we build, collaborate, and deliver long-term technology value.",
      badge: "",
    },
    team: {
      eyebrow: "Leadership",
      title: "Experienced operators guiding solution delivery.",
      description:
        "Leadership with experience across engineering, operations, commercial growth, and long-term delivery.",
      badge: "",
    },
    stories: {
      eyebrow: "Customer Stories",
      title: "Selected delivery work across automation, lending, payroll, and SME platforms.",
      description:
        "These projects show how Ionnotek translates complex operational needs into workable digital systems.",
      badge: "",
    },
    insights: {
      eyebrow: "Latest Insights",
      title: "News, articles, and knowledge resources from Ionnotek.",
      description:
        "Fresh updates, opinion, and practical guidance published directly from the admin CMS.",
      badge: "Managed from the admin CMS",
    },
    contact: {
      eyebrow: "Contact",
      title: "Ready to digitize operations, automate reporting, or build a custom platform?",
      description:
        "Ionnotek helps organizations modernize workflows, strengthen insight generation, reduce cost, and create practical digital systems that support growth.",
      badge: "",
    },
  },
};

export function parseSiteContentPayload(payload: string) {
  const parsed = JSON.parse(payload) as unknown;
  return siteContentSchema.parse(parsed);
}

export function serializeSiteContent(content: SiteContent) {
  return JSON.stringify(content, null, 2);
}

export async function getSiteContent() {
  try {
    const record = await prisma.cmsContent.findUnique({
      where: { key: CMS_KEY },
    });

    if (!record) {
      return defaultSiteContent;
    }

    const result = siteContentSchema.safeParse(record.value);
    return result.success ? result.data : defaultSiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content: SiteContent) {
  return prisma.cmsContent.upsert({
    where: { key: CMS_KEY },
    create: {
      key: CMS_KEY,
      value: content,
    },
    update: {
      value: content,
    },
  });
}