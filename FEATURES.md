# Manage Mart — Feature List

## 🛍️ Storefront (Customer-facing)

- Product browsing with **server-side search, filter, and pagination** (not client-side — the DB does the work)
- Filter by **category**, **brand**, and **price range**
- Multi-image product galleries with thumbnail selector
- **Verified-purchase reviews** — only customers who actually bought the product can review it; star ratings are computed live from real reviews, not seed data
- **Wishlist** — save products for later, heart-icon toggle
- Shopping cart — works for guests and logged-in users, quantity-aware (no duplicate rows for the same item)
- **Checkout via Stripe** (hosted Checkout Session)
- **Order history & tracking** (`/orders`) — status timeline (pending → paid → shipped)
- Cancel/refund requests on your own orders
- Email notifications — order confirmation and shipping updates (Resend)

## 🏪 Seller Dashboard

- Full product CRUD (create, edit, delete)
- **AI-generated product descriptions** — one click, powered by Claude
- Product image upload (Cloudinary, signed uploads — no exposed API secrets), with automatic cleanup of removed images
- Order management — view orders, update status, issue Stripe refunds
- **Real analytics** — monthly revenue, top products, order/customer stats, all computed via MongoDB aggregation (not mock data)
- Per-seller data scoping — a seller only ever sees their own products and orders

## 🛠️ Admin

- Everything a seller can do, across **all** sellers
- **Category & Brand management** — curated lists (not free-text typing), sellers pick from a dropdown
- Promote any user to admin via a CLI script (no self-service admin signup)

## 🔐 Auth & Security

- NextAuth — Google OAuth **and** email/password, unified under one role system
- Role-based access control: `customer` / `seller` / `admin`
- Route protection via middleware — unauthorized users never see a protected page render
- Rate limiting on checkout, cart, wishlist, and AI-generation endpoints
- Signature-verified Stripe webhooks (the actual source of truth for payment state — not the browser redirect)

## 💳 Payments

- Stripe Checkout Sessions
- Webhook-driven order fulfillment (idempotent — safe against retried webhook deliveries)
- Proper refund flow — refunds only ever happen through a real Stripe API call, never a raw database status edit

---

**Tech stack**: Next.js 15 (App Router), React 18, MongoDB/Mongoose, NextAuth, Tailwind CSS + shadcn/ui, Stripe, Cloudinary, Resend, Anthropic (Claude) API, Zod + react-hook-form.

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the full build history, design decisions, and known limitations behind each feature above.
