# Manage Mart — Implementation Plan (Mid-Level Full-Stack Upgrade)

Goal: take Manage Mart from its current prototype state to a resume-ready, mid-level
full-stack e-commerce project — one unified data model, a real checkout/payment flow,
role-based access, and production polish.

Target audience for the finished project: mid-level full-stack interviewers. Priorities
are chosen to maximize demonstrated skill (system design judgment, payment integration,
authZ, deployment) over feature count.

**Status: Phases 1–3 and 5–9 done — all planned phases complete. Phase 4 done except
deployment** (deployment explicitly
deferred — not needed right now). Product model unified, dashboard CRUD and the storefront
both read/write the same MongoDB collection, `public/product.json` is now only a seed source
(`npm run seed:products`), Cart dedupes by product+user with a `quantity` field, checkout runs
through real Stripe Checkout Sessions with an `Order` model and a signature-verified webhook
as the source of truth for fulfillment, `/dashboard/*` is role-gated (customer/seller/admin)
with per-seller product and order scoping, product images upload to Cloudinary via signed
requests, the storefront does real server-side search/filter/pagination, the Analytics page
runs real MongoDB aggregations instead of mock data, checkout/cart/AI-generation are rate
limited, removed product images clean themselves up in Cloudinary, the product detail page
shows a real multi-image gallery, product ratings are real verified-purchase reviews instead
of static seed numbers, customers can save products to a wishlist, customers have a real
order-history page with email notifications (Resend) on payment and shipping, and paid orders
can be properly refunded through Stripe (with the status dropdown restricted so it can no
longer desync the DB from what was actually charged). **Bonus, beyond the original 4-phase
plan**: an AI product description generator (Claude API) in the seller dashboard, and a
normalized Category/Brand taxonomy (admin-managed, not free text) replacing what used to be a
typo-prone string field.

**What's left**: deployment (explicitly deferred) and the Stretch Goal below (TypeScript,
tests) — everything else in this plan is implemented.

---

## Current State (baseline, confirmed by code read)

- **Two disconnected "product" systems**:
  - Storefront (`/service`, `/service/[id]`) reads static `public/product.json` (id, name,
    price, category, seller, stock, ratings, img, description, shipping).
  - Dashboard ("Create Product", "All Products") actually operates on a `Post` model
    (`src/models/post.js`: title, slug, content only — no price/image/stock/category).
    Creating a "product" in the dashboard has zero effect on the storefront.
- **Cart** (`src/models/Cart.js`) has no `quantity` field and no product reference — every
  "Add to Cart" click inserts a new document, even for the same item.
- **Orders page** (`src/app/dashboard/orders/page.jsx`) and **Analytics page**
  (`src/app/dashboard/analytics/page.jsx`) are 100% hardcoded mock arrays — no `Order`
  model exists, no DB query backs them.
- **Auth**: NextAuth (Google + Credentials) works, `User.role` field exists (default
  `"User"`) but nothing reads or enforces it — no authorization anywhere.
- **No payment integration**, no checkout page, no image upload (images are hardcoded
  external URLs).
- **No README beyond create-next-app boilerplate**, no deployment.

---

## Phase 1 — Foundation: Unified Product Model ✅ done

Implementation notes (deviations from the original plan, and why):
- Cart's `user` scoping landed now instead of "once auth-gated" — `/api/Cart` already reads
  the session via `getServerSession`, so it cost nothing extra to wire it up immediately.
  Guest (logged-out) carts still share a single `user: null` bucket — that's a known
  limitation, fine until checkout requires login in Phase 2.
- `/post/[slug]` was retired outright (not repurposed) — `/service/[id]` is the canonical
  product detail route; all internal links point there now.
- Per-seller ownership enforcement on edit/delete was intentionally **not** added yet (any
  signed-in user can edit/delete any product) — that's Phase 3's job once roles are formal.
  Adding it now would have made local testing confusing (seeded products are owned by a
  placeholder seed user, not whoever logs in to test the dashboard).
- `images` is a `[String]` field, populated today via a comma-separated URL text input in
  the dashboard form — Phase 4 swaps that input for real upload (Cloudinary/UploadThing)
  without touching the schema.


**Why first**: every later phase (checkout, orders, analytics, RBAC-scoped products) depends
on one real `Product` collection. Fixing this is also the single most interview-relevant
fix — it's a genuine "found and fixed a bad system design decision" story.

1. **New model** `src/models/Product.js`
   - Fields: `name`, `slug`, `description`, `price` (Number), `category`, `images` (array of
     URLs, for now), `stock` (Number), `seller` (ref → `User._id`), `ratings`, `ratingsCount`,
     `shipping`, timestamps.
2. **Seed script** `scripts/seed-products.js` — import `public/product.json` into MongoDB once,
   so the storefront isn't empty on first run. Assign a placeholder `seller` (or the first
   registered user).
3. **Replace `Post` server actions** in `src/app/dashboard/action.jsx` (rename file/functions to
   `product-actions.js` or keep path but rename exports: `getProducts`, `createProduct`,
   `updateProduct`, `deleteProduct`, `getProductBySlug`) — Zod schema expands to full product
   fields (name, price, category, stock, images, description).
4. **Update dashboard UI**:
   - `CreatePostForm.jsx` → `CreateProductForm.jsx`: add price/category/stock/image-url fields.
   - `PostList.jsx`, `EditPostDialog.jsx` → rename to Product equivalents, show price/stock
     columns.
   - `dashboard/page.jsx`, `dashboard/products/page.jsx`: swap `getPosts()` → `getProducts()`.
5. **Update storefront** — `service/page.jsx` and `service/[id]/page.jsx` fetch from MongoDB
   (`getProducts()` / `getProductBySlug()` or a new `/api/products` route) instead of importing
   `public/product.json` directly. Keep `product.json` only as seed source.
6. **Retire `Post` model and `/post/[slug]` route**, or repurpose `/post/[slug]` as the real
   product detail page (merge with `/service/[id]`) — pick one canonical detail route.
7. **Fix Cart model**: add `productId` (ref → `Product`), `quantity` (Number, default 1),
   `user` (ref → `User`, once auth-gated). Update `/api/Cart` POST to `upsert` (increment
   quantity if the same product+user combo already exists) instead of always inserting.

**Deliverable**: creating a product in the dashboard immediately appears on `/service`;
adding the same item to cart twice increments quantity instead of duplicating rows.

---

## Phase 2 — Checkout & Order Flow + Payment ✅ done

Implementation notes:
- Used Stripe's **hosted Checkout Session** (redirect to `checkout.session.url`), not Stripe
  Elements — no `@stripe/stripe-js` dependency needed, no client-side card form to secure,
  and it's the faster-to-implement, still-fully-legitimate integration path for this scope.
- An `Order` is created as `"pending"` at the moment a Checkout Session is started (not only
  on success) — this captures shipping details/items/total immediately and gives an audit
  trail for abandoned checkouts, at the cost of a stray "pending" row per abandoned attempt
  (acceptable; no cleanup job for that is in scope).
- **The webhook (`/api/webhooks/stripe`), not the success-page redirect, is what flips an
  order to `"paid"`** and clears the cart — the redirect alone isn't trustworthy (it can be
  forged or interrupted), a signature-verified webhook event is. The success page instead
  calls the Stripe API directly to show a receipt-like summary, independent of webhook
  timing.
- Dashboard "Active Orders" / "Revenue" overview stats now come from a real Mongo aggregation
  (`getOrderStats()`) instead of hardcoded numbers.
- Per-seller order scoping intentionally not added yet — same reasoning as Phase 1, deferred
  to Phase 3.


**Why this order**: this is the highest resume-impact phase — a working payment integration
is the one thing every interviewer recognizes and asks about.

1. **New model** `src/models/Order.js`
   - Fields: `user` (ref), `items` (array of `{ product, name, price, quantity }`), `total`,
     `status` (`pending | paid | shipped | cancelled`), `paymentIntentId`, `shippingAddress`,
     timestamps.
2. **Checkout page** `src/app/checkout/page.jsx` — reads current user's cart, shows order
   summary, collects shipping info (react-hook-form + Zod), "Pay now" button.
3. **Payment integration — Stripe (test mode)**:
   - `npm install stripe @stripe/stripe-js`
   - `src/app/api/checkout/route.js` — creates a Stripe Checkout Session from cart contents,
     returns session URL.
   - `src/app/api/webhooks/stripe/route.js` — verifies Stripe webhook signature, on
     `checkout.session.completed` creates the `Order` document and clears the user's cart.
   - Success/cancel pages: `src/app/checkout/success/page.jsx`, `.../cancel/page.jsx`.
4. **Wire dashboard Orders page to real data** — replace `mockOrders` with a server action
   `getOrders()` querying the `Order` collection (all orders for admin, or seller's own
   products' orders once RBAC lands in Phase 3).
5. **Order status update** — small dashboard action to transition `pending → shipped`, etc.
   (manual admin action is fine; no courier integration needed for resume scope).

**Deliverable**: a user can browse → add to cart → checkout → pay with a Stripe test card →
see the order appear in the dashboard Orders page with real data.

---

## Phase 3 — Authorization Maturity (RBAC) ✅ done

Implementation notes (deviations from the original plan, and why):
- Route protection is `src/middleware.js` (using `next-auth/jwt`'s `getToken`), not an
  updated client-side `ProtectedRoute` component — middleware runs before the page renders
  (no flash of protected content) and is the more idiomatic Next.js App Router pattern.
  `protected-route.jsx` was unused dead code (nothing ever imported it) and was deleted
  rather than built out further.
- **Fixed a real bug this phase surfaced**: Google sign-in has no NextAuth `adapter`
  configured, so it never persisted a `User` document — a Google-authenticated session's
  `token.role` was `undefined`, which the new middleware would have treated as "not allowed"
  for every Google user, seller or not. `src/lib/auth.js`'s `jwt` callback now find-or-creates
  the matching `User` by email for Google sign-ins so they get a real role.
- Signup now has an "I want to sell products" checkbox (`role: "seller"` vs the default
  `"customer"`); `/api/register` only ever accepts `customer`/`seller` from the client —
  `admin` is bootstrap-only via `npm run make-admin <email>`.
- Per-seller order scoping shows a seller the **whole order** if any line item is theirs
  (not just their own items) — true per-seller sub-orders are a bigger data-model change
  (splitting one checkout into N sub-orders) that's out of scope here.
- Orders created before this phase have no `items.seller` — they won't show up for the
  seller who owns those products (only for `admin`, who sees everything). Not an issue in
  practice yet since Stripe wasn't configured during Phase 1–2 testing, so no real orders exist.


1. Define roles explicitly: `customer` (default), `seller`, `admin`. Update `User.role` enum
   and the NextAuth `jwt`/`session` callbacks (already pass `role` through — just need to
   enforce it) in `src/lib/auth.js`.
2. **Middleware/guards**:
   - `src/middleware.js` (Next.js middleware) — redirect unauthenticated users away from
     `/dashboard/*`; redirect non-seller/admin roles away from dashboard entirely.
   - Server-action-level checks: every `createProduct`/`updateProduct`/`deleteProduct` verifies
     `session.user.role !== "customer"` before writing.
3. **Seller scoping** — sellers only see/manage their own products (`Product.find({ seller:
   session.user.id })`) and only orders containing their products; admins see everything.
4. **Update `ProtectedRoute` component** (`src/components/auth/protected-route.jsx`) to accept
   an allowed-roles list, reuse across dashboard pages.

**Deliverable**: a "seller" account only manages its own catalog; a plain "customer" account
can't reach `/dashboard` at all; this is demonstrable in a 2-minute demo video.

---

## Phase 4 — Production Polish ✅ done (except deployment — deferred, not needed right now)

1. **Image upload** ✅ — Cloudinary, **signed** uploads (not the simpler unsigned-preset
   route): `src/app/api/upload/sign/route.js` generates a short-lived signature server-side
   (seller/admin only) using `CLOUDINARY_API_SECRET`, which never reaches the browser; the
   client (`src/components/dashboard/ImageUpload.jsx`) then uploads the file straight to
   Cloudinary with that signature. `Product.images` is unchanged (`[String]`) — no schema
   migration needed. Known limitation: removing an image from the form, or deleting a
   product, does not delete the Cloudinary asset — orphaned files accumulate. Acceptable for
   this scope; a real cleanup would call `cloudinary.uploader.destroy` with the stored
   `public_id` (not currently captured).
2. **Server-side search/filter/pagination** ✅ — done via URL search params + a server
   component, not a separate `/api/products` endpoint: `getStorefrontProducts()` in
   `src/app/dashboard/action.jsx` runs `.find(filter).skip().limit()` directly, `/service`
   reads `searchParams` server-side, and `ProductFilters.jsx` (client) pushes new URL query
   params (debounced search) rather than filtering in the browser. This is the more
   Next.js-idiomatic pattern than a hand-rolled API route + client fetch, and ships less
   client JS.
3. **Analytics from real data** ✅ — `getAnalytics()` in `src/app/dashboard/order-actions.js`:
   monthly revenue (6-month window, zero-filled for months with no orders), top 5 products by
   revenue, and headline totals (revenue/orders/new customers/avg order value) — all via
   `Order.aggregate()`, scoped the same way as `getOrders()` (a seller sees revenue from only
   their own line items). Dropped "Total Views" / "Conversion" from the old mock UI entirely
   rather than fabricate numbers — there's no traffic-tracking system in this app to back them.
   **Caught a real bug while building this**: `Model.aggregate()` bypasses Mongoose's query
   casting, so the Phase 3 seller-scoped `$match` in `getOrderStats()` was comparing a raw
   string against a BSON ObjectId field and silently matching nothing — fixed alongside the
   new analytics code (see `toObjectId()` helper in `order-actions.js`).
4. **Basic error/loading states** ✅ — replaced the `alert()` calls in `myProduct/page.jsx`
   with the `sonner` toast system already used elsewhere.
5. **README** ✅ — setup instructions, env vars, roles, Stripe local-webhook testing all
   documented incrementally as each phase landed, rather than as one final rewrite.
6. **Deployment** — explicitly out of scope per request ("deployment kora lagbe na"). Nothing
   here blocks it later: Vercel (app) + MongoDB Atlas (DB) + real Stripe/Cloudinary keys.

**Deliverable**: everything except a live URL — the app is feature-complete and demoable
locally (`npm run dev` + a screen recording is enough for a resume link if deployment stays
out of scope).

---

## Bonus — AI Product Description Generator ✅ done

Not part of the original 4-phase plan; added on request as a resume-relevant "LLM API
integration" signal.

- `src/lib/anthropic.js` — Claude client (`ANTHROPIC_API_KEY`), same fail-fast-on-missing-env
  pattern as `stripe.js`/`cloudinary.js`.
- `src/app/dashboard/ai-actions.js` — `generateProductDescription({ name, category, keywords })`
  server action, seller/admin-only, calls `claude-opus-5` with a system prompt constraining
  output to a plain 2-4 sentence listing description (no markdown/bullets), `max_tokens: 500`
  (deliberately short — this is a bounded creative-writing task, not open-ended generation).
- Wired into both `CreateProductForm.jsx` and `EditProductDialog.jsx`: an optional "AI
  Keywords" hint field plus a "Generate with AI" button next to the Description label, which
  fills `description` via `form.setValue(...)` — the seller can still edit the result before
  saving, this never auto-submits.
- Called as a plain async function from a client component `onClick`, not through
  `useActionState`/a `<form action>` — Next.js Server Actions can be invoked directly like any
  other async function; a form binding is only needed when the action should run as part of a
  native form submission.
- Known limitation: no rate limiting on this endpoint — a seller could spam the button and run
  up API cost. Fine for a resume demo; a real deployment would want a per-user cooldown or
  usage cap.

---

## Phase 5 — Ops/Security Quick Wins ✅ done

Small, mostly-independent fixes — bundled together because none of them need new data
models, just changes to existing flows.

1. **Rate limiting** ✅ — `src/lib/rate-limit.js`, an in-memory fixed-window limiter, applied
   to `/api/checkout` (5/min per user), `/api/Cart` POST (30/min per user, IP fallback for
   guests), and `generateProductDescription` (5/min per user — the most expensive one to
   spam). Known limitation: in-memory state doesn't survive a serverless cold start or
   multiple instances — correct for local dev / single-process deployment, not for a real
   multi-instance Vercel deploy (that needs Upstash Redis or similar). Documented as a
   deliberate scope call, not an oversight.
2. **Cloudinary orphaned-image cleanup** ✅ — `extractCloudinaryPublicId()` in
   `src/lib/cloudinary.js` recovers the `public_id` from a stored `secure_url` (predictable
   shape: `.../upload/v<version>/<public_id>.<ext>`) rather than migrating `Product.images`
   to store it separately. New route `/api/upload/delete` (seller/admin only) does the actual
   `cloudinary.uploader.destroy`. Cleanup timing differs by form, and this distinction matters:
   - **Create form**: deletes immediately on remove-click — nothing in the DB references an
     unsaved product's images yet, so this is unconditionally safe.
   - **Edit dialog**: does **not** delete on remove-click. The dialog's images start out as
     the product's *persisted* state — deleting immediately would 404 a still-live storefront
     image if the seller then cancels instead of saving. Instead it tracks `originalImages`
     (the baseline at dialog-open) vs. the working `images` state, and only deletes the diff
     — `originalImages` minus `images` — **after** `updateProduct` reports success. This was
     the one part of this phase that needed real thought, not just wiring.
   - `deleteProduct` (dashboard/action.jsx) also cleans up all of a product's images on
     delete, via a **dynamic** `import("@/lib/cloudinary")` rather than a top-level import —
     that file's other exports (`getProducts`, `getStorefrontProducts`, read on every
     storefront page load) would otherwise inherit a hard `CLOUDINARY_*` env requirement they
     have nothing to do with. Verified with a build that omits Cloudinary env vars entirely:
     it fails only on the genuinely Cloudinary-dependent upload routes, not on `/service`.
   - Known limitation still open: images uploaded-then-abandoned without ever removing them
     (add a file, then just close the create form or the edit dialog without saving) stay
     orphaned — cleaning that up would need tracking "uploaded this session," a bigger change
     deferred as not worth it for this scope.
3. **Multi-image gallery** ✅ — new `src/components/service/ProductGallery.jsx` (thumbnail
   strip + selected main image) replaces the single `images[0]` on `/service/[id]`.

## Phase 6 — Real Product Reviews ✅ done

1. **New model** ✅ `src/models/Review.js` — `product`, `user`, `order` (proof of purchase),
   `rating` (1-5), `comment`, `userName` (denormalized so the review list needs no populate),
   timestamps. Compound unique index on `{product, user}` — one review per product per
   customer (also enforced in code before insert, for a friendlier error message than a raw
   Mongo duplicate-key error).
2. **Verified-purchase gate** ✅ — `src/app/service/review-actions.js`. `getReviewGate()`
   drives the UI (`can-review` / `already-reviewed` / `not-purchased` / `signed-out`), but
   `createReview()` re-checks the purchase independently server-side — the UI gate is only a
   convenience, never the actual authorization boundary. A verified-purchase order with
   status `paid` or `shipped` containing this product is required either way. This is the
   "real" part that distinguishes it from the old fake static `ratings`/`ratingsCount` fields
   seeded from `product.json`.
3. **Rating rollup** ✅ — `recomputeProductRating()` re-aggregates `Product.ratings` (rounded
   to 1 decimal) and `Product.ratingsCount` from all of a product's reviews on every
   create/delete — an absolute recompute, not an incremental update, so it can't drift out of
   sync. The existing star display on `ProductCard`/detail page needed zero changes.
4. **UI** ✅ — `src/components/service/ProductReviews.jsx` on `/service/[id]`: review list,
   a 5-star picker + comment form when `can-review`, the reviewer's own review (with delete)
   when `already-reviewed`, and an explanatory message otherwise. Uses `router.refresh()`
   after a successful create/delete so the list and gate update immediately without a full
   page reload — the server action's `revalidatePath` invalidates the cache, `refresh()` is
   what actually re-fetches it into the already-mounted client tree.

## Phase 7 — Wishlist / Favorites ✅ done

1. **New model** ✅ `src/models/Wishlist.js` — `{user, product}` + denormalized display
   fields, compound unique index (same dedupe shape as `Cart`). Unlike `Cart`, `user` is
   required — no guest bucket, since "save for later" only makes sense tied to an account.
2. **Toggle** ✅ — `/api/wishlist` route (mirrors the `Cart` route's shape: session-scoped
   GET/POST/DELETE, `POST` rate-limited at 30/min same as cart-add). The add path uses an
   atomic `findOneAndUpdate(..., { upsert: true })` rather than find-then-create, so it can't
   race against the unique index the way a naive implementation would.
   `src/components/service/WishlistButton.jsx` (heart icon, optimistic local state) is on
   both `ProductCard` and the detail page. Initial filled/empty state comes from the server —
   `getWishlistedProductIds()` (`src/app/service/wishlist-actions.js`) runs once per page load
   and is passed down as a prop, rather than each card fetching its own status (which would
   be an N+1 request problem on a 12-product grid).
3. **`/wishlist` page** ✅ — `src/app/wishlist/page.jsx`, deliberately mirrors `/myProduct`
   (cart) page's client-fetch-on-mount structure for consistency rather than introducing a
   third data-loading pattern. Shows saved items with "Add to Cart" and "Remove."
4. **Nav** — added a "Wishlist" link to `Navbar.jsx`, visible only when signed in (new
   `authRequired` flag alongside the existing `roles` gate, since this item needs "any
   authenticated user" rather than a specific role).

## Phase 8 — Order Tracking + Email Notifications ✅ done

1. **Email service** ✅ — Resend (`src/lib/resend.js` for the client/config,
   `src/lib/email.js` for the two send functions) — simpler modern API than SMTP/Nodemailer,
   generous free tier, good for a demo. Default `EMAIL_FROM` is Resend's shared sandbox
   address, which only delivers to the Resend account's own email until a domain is
   verified — documented in `.env.example`/README rather than silently surprising whoever
   tests this. Every send is wrapped so a failure only logs — email is a side effect of order
   fulfillment, never a gate on it.
2. **Triggers** ✅ — `sendOrderConfirmationEmail` from the Stripe webhook handler (on `paid`,
   static import — that route's only job is order fulfillment, so no unrelated-coupling
   concern), and `sendShippingNotificationEmail` from `updateOrderStatus` on a genuine
   transition *into* `shipped` (guarded by `wasAlreadyShipped` so re-saving an already-shipped
   order doesn't re-send). The latter is a **dynamic** `import("@/lib/email")` — same reasoning
   as the Cloudinary dynamic import in Phase 5: `order-actions.js`'s other exports
   (`getOrders`/`getOrderStats`, read on every dashboard page load) shouldn't inherit a hard
   `RESEND_API_KEY` requirement. Verified with a build that omits `RESEND_API_KEY` entirely:
   it fails only on `/api/webhooks/stripe`, not on the dashboard.
3. **Customer-facing order history** ✅ — `/orders` (`src/app/orders/page.jsx` +
   `actions.js`'s `getMyOrders()`, auth-gated like `/checkout`) — distinct from the
   seller/admin-only `/dashboard/orders`, scoped to `session.user.id` instead of seller
   ownership. `src/components/orders/OrderTimeline.jsx` renders a simple 3-step
   pending→paid→shipped progress bar (or a red "Cancelled" state), not full carrier
   tracking-number integration. Linked from the navbar (`authRequired`, same pattern as
   the Wishlist link from Phase 7).

## Phase 9 — Refund / Cancel Order Flow ✅ done

1. **`Order.status` enum** ✅ gains `refunded` (`pending | paid | shipped | cancelled |
   refunded`), plus a new `cancellationRequested: Boolean` field — a *separate* flag from
   `status`, since a cancellation request on a `paid` order shouldn't itself change what the
   order's status says until a refund is actually processed.
2. **Seller/admin dashboard action** ✅ — `refundOrder()` in `order-actions.js`: validates the
   order is `paid` (and has a `paymentIntentId` on record) and the caller owns it (seller) or
   is admin, calls `stripe.refunds.create({ payment_intent })` (dynamically imported — same
   decoupling reasoning as the Cloudinary/email dynamic imports in Phases 5 and 8), then sets
   `status: "refunded"`. `OrdersTable.jsx` shows a "Refund" button only on `paid` rows, plus an
   "Cancellation requested" badge when the customer has asked.
   - **The one design decision that mattered here**: `updateOrderStatus()`'s generic status
     dropdown could previously set *any* status from *any* status — including manually flipping
     a `paid` order straight to `cancelled`, which would desync the database from what Stripe
     actually charged (the customer's money was never touched). Fixed by replacing the flat
     `VALID_STATUSES` list with an `ALLOWED_TRANSITIONS` map keyed by current status — `paid`
     can now only manually become `shipped`; reaching `cancelled`/`refunded` from `paid`
     requires going through `refundOrder()`, the only path that actually touches Stripe.
     `OrdersTable`'s status `<select>` mirrors the same restriction client-side (different
     dropdown options depending on the row's current status) so the seller isn't offered a
     choice the server would reject anyway.
3. **Customer-facing cancel request** ✅ — `requestCancelOrder()` in `src/app/orders/actions.js`
   + `src/components/orders/CancelOrderButton.jsx`: a `pending` order (never charged) cancels
   immediately; a `paid` order only sets `cancellationRequested = true` — actioning it is a
   seller/admin decision via the Refund button above, not one-click customer self-service.
   `OrderTimeline.jsx` also now renders a `refunded` terminal state.

---

## Bonus — Normalized Category & Brand Taxonomy ✅ done

Not part of the original 9-phase plan; added on request ("category/brand-এ ki add kora jai").
Two options were on the table: keep `category` as free text and just bolt `brand` on the same
way (fast, but doesn't fix the underlying issue), or normalize both as real entities with
admin-curated lists (chosen — "Option B").

- **New models** `src/models/Category.js` / `Brand.js` — both a minimal `{name, slug}`, unique
  on `slug`. `Product.category` and the new `Product.brand` became `ObjectId` refs instead of
  free-text strings — the actual fix for the original problem (typo-duplicate categories like
  "Men's Sneaker" vs "Mens Sneakers" were previously indistinguishable from the DB's
  perspective).
- **Admin-only management UI** — `/dashboard/categories` and `/dashboard/brands`
  (route-guarded: non-admins are redirected to `/dashboard`), both built on one shared
  `src/components/dashboard/TaxonomyManager.jsx` + `src/app/dashboard/taxonomy-actions.js`
  (generic `listAll`/`createEntry`/`deleteEntry` helpers parameterized by Mongoose model —
  Category and Brand are structurally identical, so this avoided writing near-duplicate CRUD
  code twice). Reading the list is public (no session check) — the storefront filter bar and
  every seller's product form need it, not just admins; only create/delete are admin-gated.
  Deleting a category/brand still referenced by a product is blocked.
- **Sellers pick from a dropdown, they don't type** — `CreateProductForm`/`EditProductDialog`
  now fetch `getCategories()`/`getBrands()` client-side and render `<select>`s instead of a
  free-text `<Input>`. Ripple effect: every place that read `product.category` as a plain
  string (`ProductCard`, the detail page, `ProductList`, the AI description prompt, the
  Cart/Wishlist "add" payloads) needed updating to read `product.category?.name` from the now-
  populated object, or `product.category?._id` specifically for the edit form's `<select>`
  value — the two are not interchangeable and mixing them up would have been a very easy bug
  to introduce silently.
- **Storefront filtering** — `getStorefrontProducts()` now filters by `category`/`brand`
  `_id` directly (simpler and more correct than matching by name), and only offers
  categories/brands that currently have at least one product (`Product.distinct(...)` first,
  then look up just those docs) — no point offering a filter guaranteed to return zero
  results. A brand filter dropdown was added to `ProductFilters.jsx` alongside category.
- **Bootstrap dependency, called out rather than hidden**: a seller literally cannot create a
  product until at least one Category and one Brand exist — `npm run seed:products` creates
  them from `product.json`'s distinct `category`/`seller` values (the JSON's `seller` field,
  e.g. `"Adidas"`, was already being used to mean brand, never the marketplace vendor account
  — see `getOrCreateSeedSeller()` — so mapping it to the new `Brand` model reflects what that
  field always actually meant), or an admin can add them by hand at `/dashboard/categories`
  and `/dashboard/brands`. Documented in the README rather than left as a confusing empty
  dropdown.

---

## Stretch Goal (post-launch, optional)

- **TypeScript migration** — large individual signal for "mid-level," but big effort; only
  worth it after Phases 1–4 are shipped and the project is already resume-ready. Could be
  done incrementally (start with models/lib, then components).
- Unit tests (Vitest) for server actions and Stripe webhook handler — a few well-chosen tests
  (product CRUD, order total calculation) demonstrate testing discipline without requiring
  full coverage.

---

## Suggested Order of Work (milestones)

| # | Milestone | Depends on |
|---|-----------|-----------|
| 1 | `Product` model + seed script + dashboard CRUD wired to it | — |
| 2 | Storefront reads from DB, not `product.json` | 1 |
| 3 | Cart fixed (quantity, product ref) | 1 |
| 4 | `Order` model + checkout page + Stripe integration | 1, 3 |
| 5 | Dashboard Orders page shows real orders | 4 |
| 6 | RBAC (roles, middleware, seller scoping) | 1, 4 |
| 7 | Image upload | 1 |
| 8 | Server-side pagination/search | 2 |
| 9 | Real analytics aggregation | 5 |
| 10 | README + deployment | all above |
| 11 | Rate limiting + Cloudinary cleanup + multi-image gallery (Phase 5) | 7 |
| 12 | Product reviews (Phase 6) | 4 |
| 13 | Wishlist (Phase 7) | 1 |
| 14 | Order tracking + email notifications (Phase 8) | 4, 5 |
| 15 | Refund/cancel flow (Phase 9) | 4, 14 |
| 16 (stretch) | TypeScript migration | all above |

Each milestone is independently demoable and commit-able — good for showing incremental
progress in the git history (another thing interviewers look at).
