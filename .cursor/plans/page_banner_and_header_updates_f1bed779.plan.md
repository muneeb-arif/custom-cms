---
name: Page banner and header updates
overview: Add page-level banner settings (background, overlay, title, text, button, image) to the admin create/update page form, persist them on the Page model, render a hero banner on the public home and dynamic pages to match the reference screenshot, make the header sticky and semi-transparent (80%), and keep all dynamic pages server-rendered for SEO.
todos: []
isProject: false
---

# Page Banner, Header, and Front-Page Display Plan

## Current state

- **Admin:** [components/admin/PageEditor.tsx](components/admin/PageEditor.tsx) has slug, title, meta, isPublished, and sections. No banner fields.
- **Page model:** [prisma/schema.prisma](prisma/schema.prisma) `Page` has no banner-related columns.
- **Public pages:** [app/(public)/page.tsx](app/(public)/page.tsx) and [app/(public)/[...slug]/page.tsx](app/(public)/[...slug]/page.tsx) render title + sections only; no hero/banner. Both are **Server Components** with `revalidate = 60` (ISR) — already server-rendered and SEO-friendly.
- **Header:** [components/public/layout/Header.tsx](components/public/layout/Header.tsx) is static (`bg-white`), not sticky.
- **Upload:** [app/api/upload/route.ts](app/api/upload/route.ts) exists; supports `prefix` (e.g. `page-banner`). [components/admin/HeaderSettingsForm.tsx](components/admin/HeaderSettingsForm.tsx) shows the upload pattern (FormData + file + prefix → `{ url }`).

---

## 1. Data model and API (Subtask 1 & 2 & 3)

**Prisma – add to `Page` in [prisma/schema.prisma](prisma/schema.prisma):**

- `bannerBackgroundImage` – String? (URL for full-width background)
- `bannerOverlayColor` – String? (e.g. hex `#ffffff` or CSS color)
- `bannerOverlayOpacity` – Float? (0–1; “transparency level” of overlay)
- `bannerTitle` – String?
- `bannerText` – String?
- `bannerButtonText` – String?
- `bannerButtonLink` – String?
- `bannerButtonVisible` – Boolean? (default true when button is used)
- `bannerImage` – String? (URL for the circular “image on the banner”)

Run migration after schema change.

**Types – [types/cms.ts](types/cms.ts):** Extend `PageData` with the same optional fields.

**API – [app/api/pages/route.ts](app/api/pages/route.ts) and [app/api/pages/[id]/route.ts](app/api/pages/[id]/route.ts):** Extend Zod schemas to accept and validate the new fields (optional strings, optional number for opacity 0–1, optional boolean for button visible). Persist them in `create`/`update`.

---

## 2. Admin form (Subtask 1, 2, 3)

**File:** [components/admin/PageEditor.tsx](components/admin/PageEditor.tsx)

- Add the new banner fields to `formData` state (with defaults from `page` when editing).
- In the form, add a **“Page banner”** section (e.g. after meta description, before “Appear in menu”) with:
  - **Subtask 1:** Top banner: image upload (reuse pattern from HeaderSettingsForm: FormData, `prefix: "page-banner"`) or optional URL input; overlay color (text or color input); overlay transparency (number input 0–100 or 0–1, e.g. slider or number).
  - **Subtask 2:** Banner title (text); banner text (textarea); custom banner button: text, link, “Visible?” (checkbox).
  - **Subtask 3:** Image on the banner: upload (e.g. `prefix: "page-banner-image"`) or URL input.
- Include all new fields in the JSON body of the existing `handleSubmit` (POST/PUT to `/api/pages` and `/api/pages/[id]`).
- Optional: add a small preview or “Current image” thumbnails when URLs are set.

No new API routes; use existing upload API with appropriate prefixes.

---

## 3. Public banner component and layout (Subtask 5)

**New component:** `components/public/PageBanner.tsx` (or `HeroBanner.tsx`)

- **Props:** Page banner fields (background URL, overlay color, overlay opacity, title, text, button text/link/visible, image URL).
- **Layout (match reference screenshot):**
  - Full-width container with `bannerBackgroundImage` as background (e.g. `backgroundImage`, `backgroundSize: cover`, `backgroundPosition: center`).
  - Overlay div using `bannerOverlayColor` and `bannerOverlayOpacity` (e.g. `backgroundColor` with rgba derived from color + opacity, optional `backdrop-blur` for glass effect).
  - Content area: centered/left-aligned block with title (large, bold), text, and optional CTA button (link with `bannerButtonText`, `bannerButtonLink`, only if `bannerButtonVisible`).
  - “Image on the banner”: circular image (`border-radius: 50%` or `rounded-full`) positioned to the right (e.g. flex or grid), overlapping the content block slightly if desired.
- Make it a **server component** (no `"use client"` unless you need client interactivity). All data comes from parent.

**Home page – [app/(public)/page.tsx](app/(public)/page.tsx):**

- When a home page exists and is published, fetch it (already done) and pass banner fields to `PageBanner` if any banner data is set (e.g. `bannerTitle || page.bannerBackgroundImage || page.bannerImage`).
- Render: `PageBanner` (when applicable) → then existing title (optional: hide or downsize when banner title is present) → `SectionRenderer` for sections.
- Keep `revalidate = 60`; no client fetch for content — stays server-rendered and SEO-friendly.

**Dynamic pages – [app/(public)/[...slug]/page.tsx](app/(public)/[...slug]/page.tsx):**

- Same idea: when `page` is found and published, if it has banner data, render `PageBanner` above the rest.
- Then existing title (conditionally) and sections. No change to data-fetching; already server-rendered.

---

## 4. Header sticky and semi-transparent (Subtask 4)

**File:** [components/public/layout/Header.tsx](components/public/layout/Header.tsx)

- Make header sticky: add `sticky top-0 z-50` (or equivalent Tailwind).
- Semi-transparent 80% visible: replace `bg-white` with a style that yields ~80% opacity, e.g. `bg-white/80` (Tailwind) or `backgroundColor: 'rgba(255,255,255,0.8)'` so the content behind (e.g. banner) shows slightly through. Optional: add `backdrop-blur-sm` for a light glass effect.
- Ensure contrast and accessibility of nav links (existing text colors should remain readable).

---

## 5. SEO and server rendering (note)

- **Current:** Home and `[...slug]` are Server Components with `revalidate = 60`. Page content (and thus the new banner) is rendered on the server; no client-side fetch for page data.
- **After changes:** Keep the same. Banner data is part of the page document from Prisma, so it will be in the initial HTML and crawlable. No extra steps required beyond not moving page content to a client-only fetch.

Optional: If you want always-fresh content for certain pages, you could use `export const dynamic = 'force-dynamic'` for those routes; for most sites, ISR with revalidate is sufficient and remains “served from server” and SEO-friendly.

---

## Implementation order

1. **Schema + types + API** – Prisma migration, `PageData`, Zod and create/update handlers.
2. **Admin form** – PageEditor banner section and submit payload.
3. **PageBanner component** – Implement layout and styling to match reference.
4. **Public pages** – Integrate PageBanner into home and `[...slug]` when page has banner data.
5. **Header** – Sticky + `bg-white/80` (or equivalent).

---

## Files to touch (summary)


| Area           | Files                                                                                                                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Schema / types | [prisma/schema.prisma](prisma/schema.prisma), [types/cms.ts](types/cms.ts)                                                                                                                                                             |
| API            | [app/api/pages/route.ts](app/api/pages/route.ts), [app/api/pages/[id]/route.ts](app/api/pages/[id]/route.ts)                                                                                                                           |
| Admin form     | [components/admin/PageEditor.tsx](components/admin/PageEditor.tsx)                                                                                                                                                                     |
| Public UI      | New `components/public/PageBanner.tsx`, [app/(public)/page.tsx](app/(public)/page.tsx), [app/(public)/[...slug]/page.tsx](app/(public)/[...slug]/page.tsx), [components/public/layout/Header.tsx](components/public/layout/Header.tsx) |


No new API routes; upload uses existing [app/api/upload/route.ts](app/api/upload/route.ts) with prefixes.