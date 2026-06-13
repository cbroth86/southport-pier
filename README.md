# Southport Pier — Community Heritage Archive

An independent, community-driven archive for [SouthportPier.co.uk](https://www.southportpier.co.uk):
a heritage timeline, a moderated memory board, an endless photographic mural, and the
**Friends of Southport Pier** community directory.

> An independent community archive. Not affiliated with Sefton Council.

## Stack

- **Next.js 15 (App Router) + React 19 + TypeScript** — React Server Components by default.
- **Native CSS Modules + global CSS Custom Properties** — no Tailwind, no UI component libraries.
- **`next/font`** self-hosting Fraunces (headings) + DM Sans (body, 18px base).
- **Prisma + Supabase Postgres**; **Supabase Storage** for media (width/height/blurDataURL
  derived at upload time via `sharp` for zero CLS).
- On-demand cache revalidation via `unstable_cache` tags + `revalidateTag`.

## Architecture highlights

- **4 client islands only:** the memory submission form, the mural grid + sentinel, the
  native `<dialog>` lightbox, and the moderation controls. Everything else is server-rendered.
- **Governance:** public submissions are stored `PENDING`; only `APPROVED` content is public
  (`approvalStatus` is the single source of truth, `isApproved` is a synced mirror).
- **Instant publishing:** approving an item fires `revalidateTag('memories:approved')`,
  `revalidateTag('mural:feed')`, `revalidateTag('directory:listings')` so the static cache
  updates on the very next request — no waiting for the ISR window.
- **Webhook fallback:** `POST /api/revalidate?tag=…|path=…` with a `Bearer $REVALIDATION_SECRET`.

## Cache tags

| Surface | Tag |
| --- | --- |
| Approved memories | `memories:approved` |
| Approved directory listings | `directory:listings` |
| Mural feed | `mural:feed` |

## Local setup

```bash
cp .env.example .env        # fill in Supabase credentials + REVALIDATION_SECRET
npm install
npm run prisma:generate
npm run prisma:push         # push schema to Supabase
npm run seed                # admin + founding Friends + sample content
npm run dev
```

Then visit `/`, `/history`, `/memories`, `/friends`, `/mural`, and `/admin` (moderation queue).

## Scripts

- `npm run dev` / `npm run build` / `npm start`
- `npm run typecheck` · `npm run lint`
- `npm run analyze` — build with `@next/bundle-analyzer`
