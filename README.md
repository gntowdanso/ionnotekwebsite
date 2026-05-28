This is a Next.js website for Ionnotek built with the App Router approach.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

Edit `src/app/page.tsx` to change the landing page.

Core files:

- `src/app/layout.tsx` sets the global layout and metadata.
- `src/app/page.tsx` contains the public homepage and reads content from the CMS layer.
- `src/app/admin/page.tsx` contains the protected admin CMS editor.
- `src/app/admin/login/page.tsx` contains the admin login screen.
- `src/app/news`, `src/app/articles`, `src/app/knowledge`, `src/app/products`, and `src/app/apps` expose public content listing and detail routes.
- `src/app/globals.css` defines the theme and global styling.
- `src/lib/site-content.ts` defines the main website info schema, defaults, and JSON-backed helpers.
- `src/lib/cms-data.ts` defines the CRUD data model for news, articles, products, apps, comments, and contact messages.
- `prisma/schema.prisma` defines the database model used by the CMS.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.
- `npm run prisma:generate` regenerates the Prisma client.
- `npm run prisma:push` pushes the CMS table to the configured database.

## Notes

- The project uses TypeScript, Tailwind CSS v4, and ESLint.
- Routing is handled through the `src/app` directory, which is the App Router convention.
- Database access is configured via `DATABASE_WEB_URL` in `.env`.
- Admin CMS access is controlled by `CMS_ADMIN_USERNAME`, `CMS_ADMIN_PASSWORD`, and `CMS_SESSION_SECRET`.
- Public contact submissions are stored in the database for admin review.
- Public comments on content entries are created as pending and require admin moderation before display.
