# Partnerships & News — Plan

**Status: planning only — no code written yet.** This doc tracks what we decided and what's still open, so we can pick up implementation later without re-deriving context.

## 1. Goal

The client can currently manage **Products** and **Categories** through the admin panel — everything else (the `/partnerships` page copy, the homepage "Featured Devices" carousel) is hardcoded in `apps/web/lib/content.ts` and can only be changed by editing code. The client asked for two more things he can manage himself:

- **Partnerships** → a real **roster of partner companies** (logo, name, website), not just editorial copy.
- **News** → a brand-new **News/Updates feed** with full article pages, surfaced on the homepage and its own section.

Both get built by replicating the existing **Category/Product architecture**: Prisma model → `@fonex/shared` Zod schema → NestJS module (controller/service/dto) → admin CRUD page → public page(s).

## 2. Decisions made so far

- **Partnerships is a roster, not just copy.** The existing pillars/benefits marketing copy on `/partnerships` stays exactly as-is (still hardcoded, still editorial); a new "Our Partners" logo-wall section is added to that same page, backed by a real `Partner` table.
- **Partner categorization**: reuse the 4 existing pillar concepts (Global Manufacturers / Local Retailers / Technology Providers / Community Organizations) as a `PartnerType` enum, so the logo wall can be grouped the same way the pillars already are.
- **Partner placement**: `/partnerships` page only — no homepage logo strip. (Considered and declined, to keep scope tight.)
- **News gets full article pages**, not just teaser cards — each article has its own detail page with a full body, not only a title/image/excerpt.
- **News placement**: a "Latest News" section on the homepage (latest 3–4 published articles) **and** a full `/news` archive with `/news/[slug]` detail pages — mirroring how Products has both a homepage teaser (`FeaturedDevices`) and a full `/products` listing.
- **News needs a draft/published workflow** — unlike `ProductStatus` (which is an inventory-state label, not a visibility gate), News genuinely needs to hide unfinished articles from the public. `publishedAt` is set automatically, server-side, the first time an article is flipped to `published` (not manually editable by the admin).
- **News body is rich text**, authored via a WYSIWYG editor in the admin form (not the plain `<textarea>` pattern `Product.description` uses) — a new capability for this codebase, since no rich-text editor exists anywhere in it today. **Tiptap** (`@tiptap/react` + `@tiptap/starter-kit` + `@tiptap/extension-link`) is the recommended library: headless, React-native, pairs cleanly with Tailwind/shadcn, no backend/collab-server requirement. `NewsArticle.body` stores the editor's **sanitized HTML output** (still a plain `String` column — no schema type change). Server-side sanitization (`sanitize-html`, added to `apps/api`) runs on every create/update regardless of what called it, so a raw API call can't smuggle in a `<script>` tag even though only `@Roles(['admin'])` can reach that route — defense in depth, not reliance on the editor alone. Public rendering uses `dangerouslySetInnerHTML` on the already-sanitized string, styled with a small custom "article prose" stylesheet matching the site's existing typography tokens (`--font-sora` headings, `--font-manrope` body) rather than pulling in `@tailwindcss/typography` (the rest of the site doesn't use Tailwind's typography plugin — it's all bespoke inline-style components).
- **Image storage**: same Cloudflare R2 pattern already used for product photos (presigned-URL uploads, browser PUTs directly to R2). Reuses the **same bucket and credentials**, just with new key prefixes (`partners/`, `news/`) — no new env vars.
- **Upload plumbing gets generalized, not copied a third time.** This is the third feature needing "upload a photo via presigned URL, show a thumbnail with a fallback state" — so instead of a third copy-paste of `product-image-upload.tsx` / `product-thumbnail.tsx`, those get extracted into shared, parameterized components (`apps/web/components/admin/image-upload.tsx`, `image-thumbnail.tsx`) and `R2Service.createUploadUrl` gets a `prefix` argument instead of a hardcoded `products/`. Products gets refactored onto the shared versions in the same pass so there's one implementation, not three.

## 3. Open questions (need an answer before that part is built)

1. **Partner display order.** Proposing an `order Int @default(0)` field on `Partner` so the client can control logo-wall ordering within each type group (sort `order asc, createdAt asc`). Categories/Products don't have anything like this today — confirm this is wanted, or simplify to just `createdAt`/name sort like Categories does.
2. **News excerpt authoring.** Proposing an optional `excerpt` field the admin fills in for the teaser/card text, falling back to a truncated `body` if left blank. Confirm vs. always auto-truncating (simpler, but less control over how teasers read).
3. **Partner logo fallback.** If a partner has no logo yet, do we show a placeholder box (same `ImageOff` pattern `ProductThumbnail` already uses) or just render the name as text? Recommending the existing placeholder pattern for consistency.
4. **Inline images inside article body.** Tiptap can support drag-drop/inline images within the article text itself (not just the one cover image), but that means wiring the same R2 upload flow *inside* the editor. Recommending **not** doing this in v1 — cover image only — to keep scope tight; can add `@tiptap/extension-image` + an inline upload handler later if the client asks.

## 4. Partners roster (backend)

### 4.1 Prisma schema — `apps/api/prisma/schema/partner.prisma`

```prisma
enum PartnerType {
  manufacturer
  retailer
  tech_provider
  community
}

model Partner {
  id          String      @id @default(cuid())
  name        String
  type        PartnerType
  logoUrl     String?
  websiteUrl  String?
  description String?
  order       Int         @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("partner")
}
```

### 4.2 API surface

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/partners` | GET | public | paginated list (`?page`, `?pageSize`, `?search`, optional `?type=`) — sorted `order asc, createdAt asc` |
| `/api/partners` | POST | admin | create a partner |
| `/api/partners/:id` | PATCH | admin | update a partner |
| `/api/partners/:id/logo-upload-url` | POST | admin | issue a presigned R2 upload URL (key prefix `partners/`) |
| `/api/partners/:id` | DELETE | admin | delete a partner (+ its R2 logo object) |

### 4.3 Image storage

Same R2 bucket/credentials as Products, new key prefix `partners/...`. No new env vars.

## 5. News feed (backend)

### 5.1 Prisma schema — `apps/api/prisma/schema/news.prisma`

```prisma
enum NewsStatus {
  draft
  published
}

model NewsArticle {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  excerpt     String?
  body        String
  imageUrl    String?
  status      NewsStatus @default(draft)
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("news_article")
}
```

`body` stores **sanitized HTML** (Tiptap's output, cleaned server-side via `sanitize-html` before every write) — see the rich-text decision in §2. New backend dependency: `sanitize-html` (+ `@types/sanitize-html`) in `apps/api`.

### 5.2 API surface

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/news` | GET | public | paginated list, **forced to `status: published`**, sorted `publishedAt desc` — used by both `/news` and the homepage "Latest News" (called with `?pageSize=4`) |
| `/api/news/:slug` | GET | public | article detail — published only, 404s on drafts so a draft URL can't be guessed |
| `/api/news/admin` | GET | admin | paginated list, **all statuses** — used by the admin table |
| `/api/news` | POST | admin | create (defaults to `draft`) |
| `/api/news/:id` | PATCH | admin | update; if `status` transitions to `published` and `publishedAt` is null, server sets it to `now()` |
| `/api/news/:id/image-upload-url` | POST | admin | issue a presigned R2 upload URL (key prefix `news/`) |
| `/api/news/:id` | DELETE | admin | delete (+ its R2 cover image) |

### 5.3 Image storage

Same R2 bucket/credentials as Products, new key prefix `news/...`. No new env vars.

## 6. Frontend admin

- Add `Partner` / `NewsArticle` types to `apps/web/lib/types.ts` (hand-written, mirroring the API response shape — same convention as `Product`/`Category`).
- Add nav entries to the hardcoded `navItems` array in `apps/web/app/admin/(app)/layout.tsx` (this one array is the single source of truth for admin nav — no separate config file).
- `apps/web/app/admin/(app)/partners/` — `page.tsx` (DataTable pattern, like Products) + `components/partner-form-dialog.tsx`.
- `apps/web/app/admin/(app)/news/` — `page.tsx` (DataTable pattern, calling `GET /api/news/admin` not the public endpoint) + `components/news-form-dialog.tsx` (includes a draft/published status select, same UX as the existing `ProductStatus` select, plus the new rich-text field below).
- New `apps/web/components/admin/rich-text-editor.tsx`: Tiptap-based WYSIWYG editor (`StarterKit` + `Link` extension) with a small toolbar (bold/italic, headings, bullet/numbered list, link) — used only by the News form's `body` field. New frontend dependencies: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/pm`.
- Extract `apps/web/components/admin/image-upload.tsx` and `image-thumbnail.tsx` from the current `product-image-upload.tsx` / `product-thumbnail.tsx`, parameterized by upload-url path; refactor Products onto the shared versions.

## 7. Frontend public

- `apps/web/app/(site)/partnerships/page.tsx`: add an "Our Partners" section below the existing pillars, fetching `GET /api/partners?pageSize=100`, grouped client-side by `type` into the same 4 buckets already on the page. Pillars/benefits sections untouched.
- `apps/web/app/(site)/news/page.tsx` (list) + `apps/web/app/(site)/news/[slug]/page.tsx` (detail) — mirrors `(site)/products/page.tsx` + `products/[id]/page.tsx`. The detail page renders `article.body` via `dangerouslySetInnerHTML` (already sanitized server-side) inside a small custom "article prose" wrapper matching site typography.
- New `apps/web/components/home/latest-news.tsx` — a card grid (not a carousel) of the latest 3–4 published articles, inserted into `(site)/page.tsx` below `<FeaturedDevices />`.
- Add `{ label: "News", href: "/news" }` to `navLinks` in `apps/web/lib/content.ts` — `Navbar` already renders this array generically.

## 8. Suggested build order

1. `Partner` Prisma model + migration
2. `NewsArticle` Prisma model + migration
3. Generalize `R2Service.createUploadUrl` with a `prefix` argument; update Products' call site
4. Partners module (public read + admin write)
5. News module (public read + admin write, draft/publish transition logic, `sanitize-html` wired into create/update)
6. Extract shared admin `image-upload` / `image-thumbnail` components; refactor Products onto them
7. Admin UI: Partners CRUD
8. Admin UI: News CRUD, including the Tiptap rich-text editor for `body`
9. *(separate green light needed)* Frontend: `/partnerships` "Our Partners" section, `/news` list + detail pages (sanitized HTML rendering), homepage "Latest News" section, nav link

## 9. Progress tracker

- [ ] Partner Prisma schema + migration
- [ ] NewsArticle Prisma schema + migration
- [ ] R2Service `prefix` generalization
- [ ] Partners module (public read + admin write)
- [ ] News module (public read + admin write, draft/publish, server-side HTML sanitization)
- [ ] Shared admin `image-upload` / `image-thumbnail` components extracted; Products refactored onto them
- [ ] Admin UI: Partners CRUD
- [ ] Admin UI: News CRUD (Tiptap rich-text editor for `body`)
- [ ] Frontend: `/partnerships` "Our Partners" section
- [ ] Frontend: `/news` list + `/news/[slug]` detail pages (sanitized HTML rendering)
- [ ] Frontend: homepage "Latest News" section
- [ ] Nav links updated (site + admin)
