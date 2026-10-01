# Homepage Images (Carousel) — Plan

**Status: implemented, pending deploy.** This doc is the source of truth for what we decided.

## Apply on a server / local DB

```bash
# from repo root
npx prisma migrate deploy --schema apps/api/prisma/schema
# or, from apps/api:
npx prisma migrate deploy

npm run seed:homepage-slides -w @fonex/api
```

The seed is idempotent: it creates the settings row and inserts the current public-folder banners only when the table is empty. It does **not** upload those banners to R2 (so the homepage does not change shape on day one). New admin uploads go to R2 under `homepage/`.

Related current code:

- Hardcoded slides: `apps/web/lib/content.ts` → `featuredDevices` (21 images)
- Public carousel: `apps/web/components/home/featured-devices.tsx`
- Home page: `apps/web/app/(site)/page.tsx` (carousel is the main visible block; hero / news / services are commented out)
- Closest existing admin analog: **Partners** (image upload + `order` field)

---

## 1. Goal

The homepage carousel is hardcoded. Adding, removing, or reordering an image means editing `featuredDevices` in code and deploying. The admin should manage those images himself from the admin panel — same self-serve idea as Products, Partners, and News.

Build this by replicating the existing **Category / Product / Partner architecture**:

Prisma model → `@fonex/shared` Zod schema → NestJS module → admin CRUD page → public homepage fetch.

Do **not** drive the carousel from the Products catalog. Homepage banners and catalog product photos are different images with different jobs. A slide may *optionally link* to a product; it does not *become* a product.

---

## 2. Locked decisions

### 2.1 Data, not files-in-repo

Each slide is a `HomepageSlide` row. Photos live in the **same Cloudflare R2 bucket** already used for products / partners / news. New key prefix: `homepage/`. No new env vars.

The public carousel reads the API. The hardcoded `featuredDevices` array is removed after the existing 21 images are migrated.

### 2.2 Admin page name

**Homepage images** — not “Carousel”, “Featured Devices”, or `HomepageSlide`.

Nav entry goes in the hardcoded `navItems` array in `apps/web/app/admin/(app)/layout.tsx` (that array is the single source of truth for admin nav).

### 2.3 Crop before upload — locked 16:9

Every **new** and **replaced** photo must be cropped before it is uploaded.

- Aspect ratio is **locked to 16:9** (standard banner). Admin cannot pick a freeform ratio (that would make the slider uneven again).
- Crop UI: drag to reposition + zoom. Helper text: *“This is how the image will look on the homepage.”*
- We upload the **cropped** file, not the original. Target export ~**1920×1080**, quality ~0.85, WebP or JPEG.
- Reject tiny sources so the slider does not go blurry (shortest side at least **800px** before crop).
- Existing shared `ImageUpload` is for products/partners/news. Homepage slides get a **crop-first** flow (recommended library: `react-easy-crop`). Do not change product / news / partner upload behavior.
- **No separate phone vs desktop crops.** One 16:9 image is used everywhere. (Two crops would mean the admin frames the same slide twice — too much for this user.)

After crop, public slides use `object-fit: cover` so they fill the card evenly.

**Tradeoff (accepted):** the live card is taller on phones and wider on desktops. A single 16:9 crop cannot be perfect on both. 16:9 was chosen over 3:2.

### 2.4 Reorder — no typed numbers

`order` exists in the database. The admin **never types it**.

The admin screen is **not** a DataTable like Products. It is a **vertical stack of large thumbnails**, in the same order visitors see.

- Drag a card up or down. **Save on drop** (no “Save order” button).
- Each card also has **Move up** / **Move down** (phones + people who do not drag).
- New slides always go to the **end**, then they drag into place.
- The only position text is **“3 of 12”**, never a field named Order.

Recommended library: `@dnd-kit/core` + `@dnd-kit/sortable`.

### 2.5 Empty homepage

- **Public site:** if there are no *visible* slides, **hide the carousel**. Do not show customers “No images yet.”
- **Admin:** empty state *“No homepage images yet”* + **Add image** button.

### 2.6 Migrate the existing 21 images

Seed/migrate today’s `featuredDevices` rows in the current order, already **visible**.

- Keep the existing `alt` text as `imageDescription`.
- Keep existing `bg` values on the row (used as letterbox fallback for uncropped legacy photos). Hidden from the admin UI; new slides default to `#FFFFFF`.
- **Do not auto-crop on migrate.** Shapes differ; a guessed crop would cut products. The homepage should look like it does now on day one.
- When the admin later replaces/recrops a migrated slide, that one becomes 16:9 and joins the uniform set.
- Internal name on migrate: derive a short label from the current `alt` (admin can rename).
- **Files:** referenced as `/images/new/...`. They may not be in every workspace clone (large binaries). Migration needs the actual files from the live site or a local copy, then upload into R2 under `homepage/`.

### 2.7 Optional product link (not a raw URL)

A slide may optionally open a product page. The admin **picks a product** from a searchable list (name + thumbnail). They do not paste `/products/<id>` or a product ID.

- Store optional `productId`.
- If set, click/tap → `/products/:id`.
- If empty, the image is **not a clickable link** (default).
- Homepage photo stays its own cropped banner. It is **not** taken from the product’s catalog image.
- If the linked product is later deleted: the **slide stays**; `productId` is cleared (`onDelete: SetNull`). The image just stops being clickable.

**v1 does not include a free-form URL** (Contact, WhatsApp, `/products` list, external). That is a later “Open another page” option. Two link types at once would confuse this admin.

### 2.8 Optional caption overlay

Optional short text drawn **on top of** the image (bottom overlay + dark gradient for contrast).

- Empty caption = no overlay, same look as today (many current photos already have text baked into the file).
- One field, not title + subtitle.

### 2.9 Optional start / end dates

Both dates are optional. If the admin leaves them blank, **do nothing extra** — the slide shows whenever it is Visible.

| Start | End | Behavior |
|---|---|---|
| empty | empty | Show whenever Visible |
| set | empty | Hidden until start day, then stays up |
| empty | set | Show now, hide after end day |
| set | set | Show only inside that window |

**Visible on homepage** toggle overrides dates: Off = never show, even if the window says yes.

Date-only is enough (not date+time). Interpret start as start-of-day and end as end-of-day in a single consistent timezone (recommend **Africa/Mogadishu**, UTC+3). Store UTC in the database.

Admin list shows a plain-language status so they do not have to reason about dates:

- **Visible** — toggle on and currently inside the window (or no dates)
- **Hidden** — toggle off
- **Scheduled** — toggle on, start date still in the future
- **Ended** — toggle on, end date has passed

### 2.10 Autoplay speed

Site-wide, **not per slide**. Lives on the same admin page.

- Label: **“Seconds each image stays on screen.”**
- Default **3** (today’s hardcoded `AUTOPLAY_MS = 3000`).
- Admin can change it later anytime.
- Pause-on-hover stays hardcoded (current behavior).

Stored on a small `HomepageSettings` singleton row, not on each slide.

### 2.11 Multi-file upload

Admin can pick **several files at once**. A crop step then runs **one after another** (“Image 2 of 5”). Every file still gets the 16:9 crop. All new slides are appended at the bottom.

Skipping crop is not allowed. There is no “upload without framing.”

### 2.12 Other v1 UX (locked)

| Item | Decision |
|---|---|
| Internal name | Required. Visitors never see it. e.g. “Huawei earbuds promo.” Stops the list being a wall of similar thumbnails. |
| Image description | Optional, labeled in plain language (not `alt`), with an example. Used for accessibility. |
| Replace image | Same crop flow. **Keeps the slide’s position.** |
| Delete | Confirm: “This will disappear from the homepage.” Also delete the R2 object. |
| View homepage | Link on the admin page so they can check the live site after saving. |
| `bg` color | Default `#FFFFFF`. **Not shown** in the admin form. |

### 2.13 Explicitly out of v1

- Separate phone vs desktop crops
- Letting the admin pick any aspect ratio
- Asking them to type hex colors
- Building slides out of the Products catalog images
- Free-form / custom click URL (Contact, WhatsApp, etc.)
- Dual caption fields (title + subtitle)

---

## 3. What the admin actually does

1. Opens **Homepage images**.
2. **Add image** (one or many) → pick files → crop each → they appear at the bottom.
3. Drags (or Move up/down) into the order they want. Saved on drop.
4. Optionally sets caption, linked product, start/end dates.
5. Hides a promo with **Visible on homepage** instead of deleting it.
6. Changes speed if 3 seconds feels wrong.
7. Clicks **View homepage** to confirm.

No code files. No “call the developer.”

---

## 4. Backend

### 4.1 Prisma — `apps/api/prisma/schema/homepage-slide.prisma`

```prisma
model HomepageSlide {
  id               String    @id @default(cuid())
  title            String
  imageUrl         String?
  imageDescription String?
  caption          String?
  bg               String    @default("#FFFFFF")
  order            Int       @default(0)
  isActive         Boolean   @default(true)
  startsAt         DateTime?
  endsAt           DateTime?
  productId        String?
  product          Product?  @relation(fields: [productId], references: [id], onDelete: SetNull)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([order])
  @@index([productId])
  @@map("homepage_slide")
}

model HomepageSettings {
  id         String   @id
  autoplayMs Int      @default(3000)
  updatedAt  DateTime @updatedAt

  @@map("homepage_settings")
}
```

Notes:

- `HomepageSettings.id` is a fixed singleton (e.g. `"default"`). Seed that row with `autoplayMs = 3000`.
- Add the inverse relation `homepageSlides HomepageSlide[]` on `Product` in `product.prisma`.
- `imageUrl` is nullable so a row can exist for a moment before the cropped upload finishes (same create-then-upload pattern as Partners). Public GET must **omit slides with no `imageUrl`**.
- `order` is compacted on reorder (0..n-1). New slides get `max(order) + 1`.

### 4.2 Visibility rule (public GET)

A slide is shown on the homepage only if **all** of these are true:

1. `isActive === true`
2. `imageUrl` is present
3. `startsAt` is null **or** `startsAt <= now`
4. `endsAt` is null **or** `endsAt >= now`

Sort: `order asc`, then `createdAt asc`.

Admin list returns **all** slides (including hidden / scheduled / ended / missing image) plus a computed `status` of `visible | hidden | scheduled | ended` so the UI does not re-implement the date math.

### 4.3 API surface

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/homepage-slides` | GET | public | Visible slides only (rule in §4.2), sorted by `order`. Used by the homepage carousel. Not paginated — return the full visible set (homepage needs all of them). Include enough product fields to build `/products/:id` if `productId` is set (`id` is enough). |
| `/api/homepage-settings` | GET | public | `{ autoplayMs }` so the carousel uses the admin-configured speed |
| `/api/homepage-slides/admin` | GET | admin | All slides, with product preview `{ id, name, imageUrl }` and computed `status` |
| `/api/homepage-slides` | POST | admin | Create a slide (title required; image comes next). `order` assigned server-side to the end. |
| `/api/homepage-slides/:id` | PATCH | admin | Update title, description, caption, isActive, dates, productId. **Not** `order` (use reorder). |
| `/api/homepage-slides/reorder` | PATCH | admin | Body `{ ids: string[] }` — full ordered id list. Rewrite `order` to 0..n-1. |
| `/api/homepage-slides/:id/image-upload-url` | POST | admin | Presigned R2 PUT, prefix `homepage/`. Same create-URL-then-browser-PUT pattern as Partners. Replacing an image deletes the previous R2 object. |
| `/api/homepage-slides/:id` | DELETE | admin | Delete row + R2 object |
| `/api/homepage-settings` | PATCH | admin | Update `autoplayMs` (validate a sensible range, e.g. 1000–15000 ms; UI talks in **seconds**) |

Public product picker data for the admin form: reuse existing `GET /api/products` (already admin-usable / public list). Do not invent a second products endpoint.

### 4.4 Shared package

Add to `@fonex/shared`:

- `homepage-slide.schema.ts` — create / update Zod schemas
- Reorder body schema: `{ ids: z.array(z.string().min(1)).min(1) }`
- Settings update schema: `{ autoplayMs: z.number().int().min(1000).max(15000) }` (or accept seconds in the UI and convert)
- Export from `packages/shared/src/index.ts`
- No change needed to `pagination.schema.ts` unless we paginate the admin list (not required; the set is small)

### 4.5 Image storage

Same R2 service (`R2Service.createUploadUrl(contentType, 'homepage')`). Allowed types stay JPEG / PNG / WebP. Max upload size stays 5MB **after crop** (cropped 1920×1080 will be well under).

---

## 5. Frontend admin

### 5.1 Route and nav

- `apps/web/app/admin/(app)/homepage/page.tsx`
- Nav: `{ href: "/admin/homepage", label: "Homepage images", icon: Images }` (or similar Lucide icon)
- Types in `apps/web/lib/types.ts`: `HomepageSlide`, `HomepageSettings`

### 5.2 Page layout

Not a DataTable. Top of page:

- `AdminPageHeader` — title **Homepage images**, count, short description, **Add image** + **View homepage** (`/`)
- A compact **speed** control: “Seconds each image stays on screen” (number, default 3), saved to `PATCH /api/homepage-settings`

Then the sortable card list. Each card shows:

- Large thumbnail
- Internal name
- Status badge (Visible / Hidden / Scheduled / Ended)
- Linked product name, if any
- Caption preview, if any
- Date range, if any
- “3 of 12”
- Drag handle, Move up, Move down
- Actions: Edit, Replace, Hide/Show, Delete

### 5.3 Add / edit flow

**Add image**

1. File picker, `multiple` allowed.
2. For each file: validate type/size/min-resolution → open 16:9 cropper → confirm → `POST` slide (title defaulted from filename, admin can edit after) → `POST .../image-upload-url` → PUT cropped blob to R2.
3. Queue UI: “Image 2 of 5”, with a way to cancel the remainder.
4. New cards appear at the bottom.

**Edit**

Dialog/sheet: internal name, image description, caption, product picker (searchable, optional, clearable), Visible toggle, start date, end date. Image replace is the crop flow again and does not change `order`.

**Product picker**

Searchable list of existing products (name + thumbnail). Empty = no link. Clearing the selection sets `productId` to null.

### 5.4 Copy (plain language)

Avoid developer words in the UI:

| Instead of | Show |
|---|---|
| `alt` | Image description |
| `order` | (nothing — just “3 of 12”) |
| `isActive` | Visible on homepage |
| `startsAt` / `endsAt` | Start date / End date |
| `productId` | When someone clicks this image → Do nothing / Open a product |
| `autoplayMs` | Seconds each image stays on screen |
| `caption` | Caption (optional) — short text on top of the image |

Delete confirm: “This will disappear from the homepage.”

---

## 6. Frontend public

`FeaturedDevices` stops importing `featuredDevices` from `content.ts`.

1. Fetch `GET /api/homepage-slides` and `GET /api/homepage-settings`.
2. If the visible list is empty → render **nothing** (no empty message).
3. Keep the current animation (peeking neighbors, 1s ease, infinite clone loop, pause on hover, dots).
4. Use `autoplayMs` from settings instead of the `3000` constant.
5. `object-fit: cover` for cropped/uniform images. Migrated uncropped images may still letterbox; `bg` on the card handles the frame (legacy only).
6. If `caption` is set, draw it on the slide (bottom, readable over a dark gradient).
7. If `productId` is set, the **active** slide is a link to `/products/:id`. Inactive (peeking) slides keep today’s “click to focus that slide” behavior so we do not navigate by accident.
8. Remove `featuredDevices` from `content.ts` once migration + fetch are in place.

---

## 7. Suggested build order

1. Prisma models + migration (`HomepageSlide`, `HomepageSettings`, `Product.homepageSlides` relation)
2. Seed `HomepageSettings` singleton (`autoplayMs = 3000`)
3. Shared Zod schemas
4. NestJS module (public GET + admin CRUD + reorder + upload URL + settings)
5. Seed/migrate the 21 existing images into R2 + `HomepageSlide` rows (needs the image files)
6. Admin page: list, crop-on-upload (single + multi), edit, delete, visibility, dates, product picker
7. Drag + up/down reorder
8. Settings control (speed) + View homepage
9. Public `FeaturedDevices` wired to the API; hide when empty; caption + product link; remove hardcoded array

---

## 8. Progress tracker

- [x] Prisma schema + migration (`HomepageSlide`, `HomepageSettings`, Product relation)
- [x] Seed HomepageSettings singleton (3s default)
- [x] `@fonex/shared` Zod schemas
- [x] NestJS homepage-slides + settings module
- [x] Migrate existing `featuredDevices` images as local `/images/new/...` rows (not R2 — keeps current photos intact; new uploads go to R2)
- [x] Admin: Homepage images page (card list, not DataTable)
- [x] Admin: 16:9 crop-before-upload (single + multi-file queue)
- [x] Admin: edit fields (name, description, caption, visible, dates, product picker)
- [x] Admin: drag + move up/down reorder (save on drop)
- [x] Admin: speed setting + View homepage + delete confirm
- [x] Public carousel fetches API; hide when empty; caption overlay; product link
- [x] Remove hardcoded `featuredDevices` from `content.ts`
- [x] Admin nav entry

---

## 9. Seed map (current hardcoded slides)

Migrate in this order (`order` 0..20). `title` can start as a shortened `alt`.

| # | Current path | alt (→ imageDescription) | bg |
|---|---|---|---|
| 1 | `/images/new/1-e4ec4854a5-p9cm5zs.webp` | Wireless earbuds with charging case — blue, white, black, and rose gold | `#FFFFFF` |
| 2 | `/images/new/17066330c08334e8cf01cb23f4db7c33.jpg.jpeg` | Security display stand with alarm for mobile phones | `#B4D1E8` |
| 3 | `/images/new/440x440-1000x1000.png` | Wireless earbuds charging case — black | `#FFFFFF` |
| 4 | `/images/new/51IUDy2NLRL._AC_UF1000,1000_QL80_.jpg.jpeg` | Wireless earbuds charging case — silver | `#FFFFFF` |
| 5 | `/images/new/Cell-Phone-Alarm-Stand-Security-Display-Anti-Theft-Device-for-Mobile-Phone.webp` | Anti-theft security display stand for mobile phones | `#EBE9E7` |
| 6 | `/images/new/htb1hyc3jfxxxxxoxxxxq6xxfxxx5.jpg.jpeg` | Security display stand with mobile phone | `#FFFFFF` |
| 7 | `/images/new/HUAWEI-FreeClip-2-Teaser-C-bridge-Design-2.jpeg` | HUAWEI FreeClip 2 open-ear earbuds — blue, white, black, and pink | `#FFFFFF` |
| 8 | `/images/new/images (1).jpg.jpeg` | Security display stand with mobile phone, rear view | `#DBFBF4` |
| 9 | `/images/new/images (11).jpg.jpeg` | Open-ear earbuds charging case — rose gold | `#EDEDED` |
| 10 | `/images/new/images (12).jpg.jpeg` | Open-ear earbuds charging case — black | `#FFFFFF` |
| 11 | `/images/new/images (4).jpg.jpeg` | Open-ear earbuds charging case — purple | `#FFFFFF` |
| 12 | `/images/new/images (5).jpg.jpeg` | Open-ear earbuds charging case — beige | `#FFFFFF` |
| 13 | `/images/new/images (6).jpg.jpeg` | Open-ear earbuds — pink, black, purple, and beige | `#FFFFFF` |
| 14 | `/images/new/images (7).jpg.jpeg` | HUAWEI open-ear earbuds — white, black, and blue | `#554032` |
| 15 | `/images/new/IMG-20260810-WA0028(1).jpg.jpeg` | Security display stand with iPhone, rear view | `#FFFFFF` |
| 16 | `/images/new/IMG-20260810-WA0029(1).jpg.jpeg` | Security display stand with price tag holder, shown with iPhone 15 Pro | `#FFFFFF` |
| 17 | `/images/new/IMG-20260810-WA0030(1).jpg.jpeg` | Price tag holder for security display stand — iPhone 15 Pro spec card | `#FFFFFF` |
| 18 | `/images/new/IMG-20260810-WA0031(1).jpg.jpeg` | Security display stand with price tag holder, front view, shown with iPhone 15 Pro | `#FFFFFF` |
| 19 | `/images/new/IMG-20260810-WA0032(1).jpg.jpeg` | Security display stand with price tag holder, angled view, shown with iPhone 15 Pro | `#FFFFFF` |
| 20 | `/images/new/images (4n).jpg.jpeg` | Acrylic slanted sign holder, A5 size — 6-pack | `#FFFFFF` |
| 21 | `/images/new/images (5n).jpg.jpeg` | Acrylic slanted sign holder, 8.5" x 11" — 6-pack | `#FFFFFF` |
| 22 | `/images/new/images (6n).jpg.jpeg` | Acrylic slanted sign holder, 8.5" x 11" — 6-pack | `#FFFFFF` |

(22 files in the array — the “21” in conversation was approximate. Migrate **all rows in `featuredDevices`**, in array order.)

Migrated defaults: `isActive = true`, `caption = null`, `productId = null`, `startsAt = null`, `endsAt = null`.

---

## 10. Implementation notes (so we do not re-litigate)

- Follow Partners for create-then-upload, presigned PUT, and delete-previous-R2-object on replace.
- Reorder is a dedicated endpoint. Do not let PATCH on a single slide change `order` (avoids two slides claiming “first”).
- Public homepage should not depend on admin cookies.
- Next.js already allows `**.r2.dev` and `NEXT_PUBLIC_R2_PUBLIC_URL` in `apps/web/next.config.ts` — cropped R2 URLs will render without extra image-host config.
- New frontend deps expected: `react-easy-crop`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.
- Keep carousel motion constants (`TRANSITION_S`, `PEEK`, `GAP`) hardcoded. Only duration between slides is admin-controlled.
