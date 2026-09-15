# Manage Mart

A multi-vendor e-commerce marketplace built with Next.js (App Router) — a public storefront
(browse, search, cart, checkout) plus a role-gated seller dashboard (product CRUD, order
management, analytics). See [FEATURES.md](./FEATURES.md) for the full feature list, and
[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the build history and design decisions
behind them.

## Features

- **Storefront** — server-side search/filter/pagination, multi-image product galleries,
  verified-purchase reviews, wishlist
- **Checkout & payments** — Stripe Checkout Sessions, webhook-driven order fulfillment
- **Order tracking** — customer-facing order history (`/orders`) with a status timeline, plus
  order-confirmation and shipping-notification emails (Resend)
- **Seller dashboard** — product CRUD with Cloudinary image upload (and cleanup on removal),
  order status management (with a proper Stripe refund flow), real analytics (MongoDB
  aggregation: monthly revenue, top products, order/customer stats)
- **Categories & Brands** — normalized taxonomy (not free-text), admin-managed at
  `/dashboard/categories` and `/dashboard/brands`; sellers pick from a dropdown when creating
  a product, and the storefront filters by both
- **AI product descriptions** — "Generate with AI" button in the product form (Claude API)
- **Auth & roles** — NextAuth (Google + email/password), `customer`/`seller`/`admin` roles
  enforced via middleware, with per-seller data scoping
- **Rate limiting** — checkout, cart, wishlist, and AI generation endpoints are throttled
  per user

## Tech Stack

Next.js 15, React 18, MongoDB/Mongoose, NextAuth, Tailwind CSS + shadcn/ui, Stripe, Cloudinary,
Resend, Anthropic (Claude) API, Zod + react-hook-form.

## Getting Started

Install dependencies:

```bash
npm install
```

### Environment setup

Copy `.env.example` to `.env.local` and fill in:

- `MONGODB_URI` — MongoDB connection string (local or [Atlas](https://www.mongodb.com/atlas))
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev
- `STRIPE_SECRET_KEY` — test mode secret key from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys)
- `STRIPE_WEBHOOK_SECRET` — see [Testing checkout locally](#testing-checkout-locally-stripe) below
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from the [Cloudinary console](https://cloudinary.com/console) (free tier is enough)
- `ANTHROPIC_API_KEY` — from the [Anthropic console](https://console.anthropic.com/settings/keys), powers the "Generate with AI" product description button
- `RESEND_API_KEY` — from [Resend](https://resend.com/api-keys), sends order-confirmation and shipping-notification emails. The default `EMAIL_FROM` (Resend's sandbox address) only delivers to your own Resend account email — fine for testing, swap in a verified domain address for real delivery.

### Seed data

Imports `public/product.json` into MongoDB so the storefront isn't empty on first run
(safe to re-run — upserts by slug). This also creates the Category/Brand entries the
products reference:

```bash
npm run seed:products
```

Categories and Brands are admin-curated, not free text — if you skip seeding, a seller can't
create a product until an admin adds at least one of each at `/dashboard/categories` and
`/dashboard/brands`.

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roles

Accounts are `customer` (default), `seller` (check "I want to sell products" at signup — or
Google sign-in), or `admin`. Only `seller`/`admin` can reach `/dashboard`, enforced by
`src/middleware.js`. There's no self-service way to become an admin — promote an existing
account with:

```bash
npm run make-admin -- someone@example.com
```

(sign out and back in afterwards — the role is baked into the session JWT at sign-in.)

## Testing checkout locally (Stripe)

Order fulfillment (marking an order "paid") happens via a Stripe webhook, not the checkout
redirect itself — that's the correct pattern since a client-side redirect can be forged or
interrupted, but a signed webhook event can't. To receive webhooks locally, install the
[Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET` in `.env.local`, then use
[Stripe's test card](https://stripe.com/docs/testing) `4242 4242 4242 4242` (any future
expiry, any CVC) to complete a checkout.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Lint the codebase |
| `npm run seed:products` | Seed demo products into MongoDB |
| `npm run make-admin -- <email>` | Promote an existing user to `admin` |
