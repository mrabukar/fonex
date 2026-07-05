# Product Catalog & Enquiry System — Plan

**Status: planning only — no code written yet.** This doc tracks what we decided and what's still open, so we can pick up implementation later without re-deriving context.

## 1. Goal

Replace the hardcoded product list in `apps/web/lib/content.ts` with a real backend-managed catalog, and let a user "Enquire" about a specific product in a way that reaches us via email + WhatsApp.

## 2. Decisions made so far

- **Sequencing**: backend first. No frontend changes until the backend is built and confirmed working.
- **Product images**: stored in **Cloudflare R2** (S3-compatible object storage), not local disk.
- **Status / device type**: modeled as **Prisma enums** (same pattern as the existing `Role` enum in `auth.prisma`).
- **Category**: modeled as its **own `Category` table**, not an enum — reversed from the original plan. Reason: we don't know if new categories will need adding later, and an enum requires a migration for that; a relational table lets categories be added/renamed via a row insert (and eventually an admin UI) instead.
- **Enquiry → WhatsApp**: **click-to-chat** (`wa.me` link with a pre-filled message), not the WhatsApp Business API. This is a client-side deep link, not a server-side integration — simplest option, no business account/approval/cost involved.

## 3. Open questions (not yet decided — need an answer before that part is built)

1. **Email provider.** Contact submissions today ([contact.service.ts](../apps/api/src/modules/contact/contact.service.ts)) are only saved to Postgres — there is currently **no email sending at all** in this codebase. We need to pick one (e.g. Resend, SMTP via Nodemailer, SES) before wiring "send us an email on enquiry."
2. **Enquiry storage shape**: reuse the existing `ContactSubmission` table with an added nullable `productId`, or create a separate `ProductEnquiry` table? Current recommendation below is to reuse `ContactSubmission` (§5) since the form fields are identical — but flagging this as a decision point, not yet final.
3. **R2 credentials/bucket**: need to be provisioned (bucket created, API token generated) before the upload code can be written.

## 4. Product catalog (backend)

### 4.1 Prisma schema — `apps/api/prisma/schema/product.prisma`

```prisma
enum ProductStatus {
  in_stock
  limited
  pre_order
}

enum DeviceType {
  phone
  watch
  charger
  earbuds
  case
  screen
  battery
}

model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  products  Product[]
}

model Product {
  id         String        @id @default(cuid())
  name       String
  categoryId String
  category   Category      @relation(fields: [categoryId], references: [id])
  status     ProductStatus @default(in_stock)
  type       DeviceType
  imageUrl   String?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
}
```

Notes:
- `"all"` (the "show everything" filter on the products page) stays a **frontend-only** pseudo-category — not a real DB value.
- `slug` is the stable filter key (e.g. `flagship`, `midrange`) — same role the hardcoded `cat` string plays in `content.ts` today, just backed by a real row now instead of a fixed enum.
- Initial categories (Flagship, Mid-Range, Accessories, Wearables, Spare Parts) get seeded as rows, mirroring today's `categoryFilters`/`categoryLabels` in `content.ts` — via a seed script (same pattern as `seed-admin.ts`), not hardcoded in application code.
- `colorFamilies` (the 6 decorative gradient palettes in `content.ts`) stay a **frontend constant** — not backend data. Used by `device-tile.tsx` both as the placeholder shape and as a tint overlay on real photos.
- `type` (device silhouette) is kept even though real photos exist, so the placeholder still renders something reasonable in the gap between "product created" and "photo uploaded."
- No `price` or `sku` — current UI hardcodes "Price on request" and shows no SKU. Easy to add later if that changes.
- `Product.categoryId` is required — a product must belong to an existing category, so categories need to exist (seeded or admin-created) before products can be created.

### 4.2 Image storage — Cloudflare R2

- R2 is S3-compatible → use `@aws-sdk/client-s3` pointed at the R2 endpoint (`https://<account_id>.r2.cloudflarestorage.com`).
- Recommended flow: **presigned upload URLs**. The admin backend issues a short-lived presigned PUT URL for a given object key; the admin's browser uploads the file directly to R2 (bypassing our API server for the actual bytes); once done, the frontend tells the API the object key, and the API stores the final public URL on the `Product` row. This avoids proxying image bytes through our own server.
- `Product.imageUrl` stores the final **public** URL (R2 public bucket dev URL, or a custom domain mapped to the bucket) — not the raw object key.
- Env vars needed (to add to `apps/api/.env`, not committed): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`.
- Deleting a product should also delete its object from R2.
- Validate on the presign step: mimetype whitelist (`image/jpeg|png|webp`), reasonable size cap (e.g. 5MB) enforced both client-side and via R2 conditions/policy where possible.

### 4.3 API surface

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/categories` | GET | public | paginated list (`?page`, `?pageSize`, `?search`) — sorted `updatedAt desc` |
| `/api/categories` | POST | admin | create a new category |
| `/api/categories/:id` | PATCH | admin | rename/update a category |
| `/api/categories/:id` | DELETE | admin | delete a category (only if no products reference it) |
| `/api/products` | GET | public | paginated list (`?page`, `?pageSize`, `?search`, optional `?category=<slug>`) — sorted `updatedAt desc` |
| `/api/products/:id` | GET | public | detail (not used by frontend yet, cheap to add) |
| `/api/products` | POST | admin | create |
| `/api/products/:id` | PATCH | admin | update |
| `/api/products/:id/image-upload-url` | POST | admin | issue a presigned R2 upload URL |
| `/api/products/:id` | DELETE | admin | delete (+ its R2 object) |

List responses use a paginated envelope: `{ data, total, page, pageSize, totalPages }`.

## 5. Product enquiry flow ("Enquire" button)

### 5.1 Data model change

Add to `ContactSubmission` (in `contact.prisma`):

```prisma
productId String?
product   Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
```

Nullable so the generic contact form (no product context) keeps working unchanged.

### 5.2 Backend behavior on submit

1. Validate & persist submission as today, now optionally carrying `productId`.
2. Send an email notification to us — **blocked on the email provider decision (§3.1)**.

### 5.3 Frontend behavior (documented now, not built until backend is done and greenlit)

- The "Enquire" link on a product card changes from a static `/contact` link to something like `/contact?productId=<id>` so product context survives the navigation.
- On the contact page, if a `productId` query param is present: fetch/display the product name (e.g. "Enquiring about: Aurora Pro 5G") and prefill the message/interest field accordingly.
- On successful form submit, **in addition to** the `POST /api/contact` call, open a `wa.me` deep link in a new tab:

  ```
  https://wa.me/252614511185?text=<url-encoded message>
  ```

  (Note: `wa.me` needs digits only — no `+` or dashes — so `+252-61-4511185` becomes `252614511185`.)

  The message text includes the product name and a short summary of what the user entered. This part is pure client-side — no backend involvement, no WhatsApp API integration.

## 6. Suggested build order

1. `Category` Prisma model + migration + seed script (initial 5 categories)
2. `Product` Prisma model (with `categoryId` FK) + migration
3. R2 client/service + presigned upload endpoint
4. Categories module (public read + admin write) and Products module (public read + admin write)
5. `ContactSubmission.productId` field + migration
6. Email provider decision + wiring (unblocks "email us on enquiry")
7. *(separate green light needed)* Frontend: products grid fetch, enquire flow + WhatsApp link, admin UI for category + product CRUD

## 7. Progress tracker

- [x] Category Prisma schema + migration + seed script
- [x] Product Prisma schema + migration
- [x] R2 client/service (presigned upload URLs) — verified end-to-end with real uploads
- [x] Categories module (public read + admin write)
- [x] Products module (public read + admin write)
- [x] Admin UI for category + product CRUD — login page, dashboard shell, categories CRUD, products CRUD incl. image upload
- [~] Product photo thumbnail not rendering in admin table — data reaching browser is correct (verified via network tab), root cause not yet confirmed; waiting on console error text + network request check
- [ ] `ContactSubmission.productId` field + migration
- [ ] Email provider chosen and wired into contact/enquiry submit
- [ ] Frontend: products grid wired to API (storefront still reads static `content.ts`)
- [ ] Frontend: enquire flow (`productId` param + WhatsApp click-to-chat link)
