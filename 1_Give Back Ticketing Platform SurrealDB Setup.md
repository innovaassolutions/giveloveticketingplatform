# Next.js + SurrealDB Concept Mock Build — Modern UI + Playwright

A production‑quality *concept demo* you can open in Cursor/VS Code and run end‑to‑end. Focused on a uniquely modern UI and a believable flow for Artist → Fan → Charity. Includes Playwright for visual/UX confidence and demo automation.

---

## 0) Goals & Scope
- **Goal:** Ship a *conceptually functional* mock in 1–2 days that feels real: create event, set ticket tiers, fan queue, checkout (test), ticket QR, charity uplift viz.
- **Tech:** Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui (Radix primitives), Framer Motion, Recharts, SurrealDB (single node), Playwright (e2e + visual snapshots).
- **Outcomes:** Live demo site + scripted Playwright run that auto‑demonstrates the product, generates screenshots, and validates core UX.

---

## 1) Prereqs
- Node ≥ 20, pnpm ≥ 9 (or npm/yarn)
- Docker Desktop (for SurrealDB)
- Stripe test account (optional; we’ll mock by default)

---

## 2) Repo Bootstrap
```bash
# Create app
pnpm dlx create-next-app@latest ticketing-concept \
  --typescript --app --eslint --tailwind --src-dir --import-alias "@/*" --use-pnpm
cd ticketing-concept

# UI & charts
pnpm add class-variance-authority clsx tailwind-merge framer-motion recharts lucide-react

# shadcn/ui (component system)
pnpm dlx shadcn-ui@latest init -y
pnpm dlx shadcn-ui@latest add button card input textarea select dialog sheet dropdown-menu \
  badge avatar progress toast navigation-menu tooltip tabs skeleton separator \
  accordion calendar form sonner

# SurrealDB client
pnpm add surrealdb.js zod

# QR + misc
pnpm add qrcode react-hook-form date-fns

# Playwright (e2e + component testing)
pnpm dlx playwright@latest install --with-deps
pnpm dlx playwright@latest codegen --help # sanity (optional)

# Testing utils
pnpm add -D @playwright/test @playwright/experimental-ct-react @testing-library/react @testing-library/jest-dom

# Lint/format
pnpm add -D prettier prettier-plugin-tailwindcss
```

> **Tip:** If you prefer Storybook for component dev, you can add it later. Playwright Component Testing is leaner and doubles as snapshot testing.

---

## 3) SurrealDB: Local Dev Setup

### 3.1 Docker Compose
Create `docker-compose.yml` at repo root:
```yaml
version: '3.8'
services:
  surrealdb:
    image: surrealdb/surrealdb:latest
    command: start --log debug --user root --pass root memory
    ports:
      - "8000:8000"
    environment:
      SURREAL_LOG: debug
```
> For persistent storage replace `memory` with `file:/data/surreal.db` and add a volume.

### 3.2 Seed SQL
Create `db/schema.surql`:
```sql
USE NS demo DB organiser_1;

DEFINE TABLE organiser SCHEMAFULL; DEFINE FIELD name ON organiser TYPE string;
DEFINE TABLE user SCHEMAFULL; DEFINE FIELD email ON user TYPE string; DEFINE FIELD name ON user TYPE string;
DEFINE TABLE venue SCHEMAFULL; DEFINE FIELD name ON venue TYPE string; DEFINE FIELD address ON venue TYPE object;
DEFINE TABLE event SCHEMAFULL;
  DEFINE FIELD organiser_id ON event TYPE record(organiser);
  DEFINE FIELD venue_id ON event TYPE record(venue);
  DEFINE FIELD name ON event TYPE string;
  DEFINE FIELD start_time ON event TYPE datetime;
  DEFINE FIELD end_time ON event TYPE datetime;
  DEFINE FIELD status ON event TYPE string DEFAULT 'published';
DEFINE TABLE ticket_type SCHEMAFULL;
  DEFINE FIELD event_id ON ticket_type TYPE record(event);
  DEFINE FIELD name ON ticket_type TYPE string;
  DEFINE FIELD price_cents ON ticket_type TYPE number;
  DEFINE FIELD currency ON ticket_type TYPE string;
  DEFINE FIELD quantity_total ON ticket_type TYPE number;
  DEFINE FIELD quantity_sold ON ticket_type TYPE number DEFAULT 0;
DEFINE TABLE order SCHEMAFULL;
  DEFINE FIELD user_id ON order TYPE record(user);
  DEFINE FIELD tickets ON order TYPE array;
  DEFINE FIELD total_cents ON order TYPE number;
  DEFINE FIELD status ON order TYPE string DEFAULT 'pending';
DEFINE TABLE ticket SCHEMAFULL;
  DEFINE FIELD ticket_type_id ON ticket TYPE record(ticket_type);
  DEFINE FIELD owner_user_id ON ticket TYPE record(user);
  DEFINE FIELD status ON ticket TYPE string DEFAULT 'sold';
  DEFINE FIELD qr_hash ON ticket TYPE string;
DEFINE INDEX idx_ticket_qr ON TABLE ticket COLUMNS qr_hash UNIQUE;

-- seed: organiser, venue, event, ticket types
CREATE organiser:innovaas SET name = 'Innovaas Live';
CREATE venue:klcc SET name = 'KLCC Arena', address = { city: 'Kuala Lumpur', country: 'MY' };
CREATE event:gaga SET organiser_id = organiser:innovaas, venue_id = venue:klcc,
  name = 'Lady Gaga — One Night in KL', start_time = time::now(), end_time = time::add(time::now(), 3h), status = 'published';
CREATE ticket_type:ga SET event_id = event:gaga, name = 'GA', price_cents = 10000, currency = 'MYR', quantity_total = 1000;
CREATE ticket_type:vip SET event_id = event:gaga, name = 'VIP', price_cents = 25000, currency = 'MYR', quantity_total = 100;
```

### 3.3 One‑liner to apply schema
Create `scripts/seed.mjs`:
```js
import { Surreal } from 'surrealdb.js';
const db = new Surreal('http://127.0.0.1:8000/rpc');
await db.signin({ user: 'root', pass: 'root' });
await db.use({ ns: 'demo', db: 'organiser_1' });
const fs = await import('node:fs/promises');
const sql = await fs.readFile('./db/schema.surql', 'utf8');
await db.query(sql);
console.log('SurrealDB seeded.');
process.exit(0);
```

Run:
```bash
docker compose up -d surrealdb
pnpm node scripts/seed.mjs
```

---

## 4) Environment Config
Create `.env.local`:
```env
SURREAL_URL=http://127.0.0.1:8000/rpc
SURREAL_USER=root
SURREAL_PASS=root
SURREAL_NS=demo
SURREAL_DB=organiser_1
# STRIPE_SECRET_KEY=sk_test_xxx   # optional if you wire Stripe later
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

---

## 5) Project Structure (App Router)
```
src/
  app/
    layout.tsx
    page.tsx                      # Landing (role switch)
    (artist)/artist/
      page.tsx                    # Artist dashboard (sales + uplifts)
      new-event/page.tsx          # Event wizard
    (fan)/event/[id]/page.tsx     # Event page → queue → seats → checkout
    (charity)/charity/page.tsx    # Charity dashboard
    api/
      db/route.ts                 # tiny DB proxy (server actions)
      checkout/route.ts           # mock checkout → creates order + tickets
      qr/[hash]/route.ts          # serve QR PNG
  components/
    ui/*                          # shadcn components
    charts/*                      # Recharts wrappers
    shells/*                      # Layout shells + nav
  lib/
    db.ts                         # Surreal client + helpers
    format.ts                     # currency/date utils
  styles/
    globals.css
  tests/
    e2e/*                         # Playwright specs
    ct/*                          # Component tests
playwright.config.ts
```

---

## 6) Tailwind + Design System

### 6.1 Tailwind config tokens (`tailwind.config.ts`)
```ts
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2fbfb', 100: '#d2f4f1', 200: '#a7e7e0', 300: '#70d4c9',
          400: '#33b8aa', 500: '#0b998c', 600: '#077a70', 700: '#065f59',
          800: '#054c47', 900: '#043f3b'
        },
        ink: '#111418',
        paper: '#0b0d10'
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans]
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.12)'
      }
    }
  }
}
export default config
```

### 6.2 Aesthetic guidance
- **Glass + cards** on dark background, high contrast, generous white space, rounded `2xl`, subtle shadows, micro‑interactions with Framer Motion.
- **Motion:** fade/slide on route changes, spring hover on primary CTA, confetti on successful purchase/charity contribution.
- **Typography:** Inter/SF for modern feel, large display on hero (`text-5xl md:text-7xl`).

---

## 7) Surreal Client (`src/lib/db.ts`)
```ts
import { Surreal } from 'surrealdb.js'

let db: Surreal | null = null

export async function getDB() {
  if (db) return db
  db = new Surreal(process.env.SURREAL_URL!)
  await db.signin({ user: process.env.SURREAL_USER!, pass: process.env.SURREAL_PASS! })
  await db.use({ ns: process.env.SURREAL_NS!, db: process.env.SURREAL_DB! })
  return db
}

export async function q(sql: string, vars?: Record<string, unknown>) {
  const conn = await getDB()
  const res = await conn.query(sql, vars)
  return res
}
```

---

## 8) API: Checkout (mock) (`src/app/api/checkout/route.ts`)
```ts
import { NextResponse } from 'next/server'
import { q } from '@/lib/db'
import crypto from 'node:crypto'

export async function POST(req: Request) {
  const body = await req.json()
  const { userEmail, name, items } = body as {
    userEmail: string; name: string;
    items: { ticketTypeId: string; qty: number }[]
  }

  // Ensure user
  const [{ result: [user] }] = await q(`
    SELECT * FROM user WHERE email = $email;
  `, { email: userEmail })
  const userId = user?.id ?? (await q(`CREATE user SET email = $email, name = $name;`, { email: userEmail, name })).at(-1)?.result?.[0]?.id

  // Compute total & create order
  const prices = (await Promise.all(items.map(async (it) => {
    const [{ result: [tt] }] = await q(`SELECT * FROM ticket_type WHERE id = $id;`, { id: it.ticketTypeId })
    return tt?.price_cents * it.qty
  }))).reduce((a,b)=>a+b,0)

  const orderRes = await q(`CREATE order SET user_id = $userId, total_cents = $total, status = 'completed';`, { userId, total: prices })
  const orderId = orderRes.at(-1)?.result?.[0]?.id

  // Issue tickets with QR hashes
  for (const it of items) {
    for (let i=0;i<it.qty;i++) {
      const hash = crypto.createHash('sha256').update(`${orderId}-${it.ticketTypeId}-${i}-${Date.now()}`).digest('hex')
      await q(`CREATE ticket SET ticket_type_id = $tt, owner_user_id = $uid, status = 'sold', qr_hash = $h;`, { tt: it.ticketTypeId, uid: userId, h: hash })
      await q(`UPDATE $tt SET quantity_sold += 1;`, { tt: it.ticketTypeId })
    }
  }

  return NextResponse.json({ ok: true, orderId })
}
```

---

## 9) API: QR PNG (`src/app/api/qr/[hash]/route.ts`)
```ts
import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(_: Request, { params }: { params: { hash: string } }) {
  const png = await QRCode.toBuffer(params.hash, { width: 512, margin: 1 })
  return new NextResponse(png, { headers: { 'Content-Type': 'image/png' } })
}
```

---

## 10) Pages & Shells (high‑impact UI)

### 10.1 Root layout (`src/app/layout.tsx`)
```tsx
import './globals.css'
import { Suspense } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-paper text-white antialiased">
        <div className="min-h-screen">
          <Suspense>
            {children}
          </Suspense>
        </div>
      </body>
    </html>
  )
}
```

### 10.2 Landing (`src/app/page.tsx`)
A bold, modern hero with role switch.
```tsx
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="px-6 md:px-10 py-24">
      <motion.h1 initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.6}}
        className="max-w-5xl text-5xl md:text-7xl font-semibold tracking-tight">
        Fair Tickets. <span className="text-brand-400">Real Impact</span>.
      </motion.h1>
      <p className="mt-6 max-w-2xl text-zinc-300">A concept demo showing how secondary market uplift funds charities globally.</p>
      <div className="mt-10 flex gap-4">
        <Button asChild size="lg" className="rounded-2xl">
          <Link href="/artist">Artist Portal</Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="rounded-2xl">
          <Link href="/event/gaga">Fan Demo</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-2xl">
          <Link href="/charity">Charity Dashboard</Link>
        </Button>
      </div>
    </main>
  )
}
```

### 10.3 Fan Event Page (`src/app/(fan)/event/[id]/page.tsx`)
Seat/tiers, checkout, animated transitions. (Simplified for brevity.)
```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function EventPage() {
  const [items, setItems] = useState<{ ticketTypeId: string; qty: number }[]>([])
  const add = (id: string) => setItems((p) => { const i=p.find(x=>x.ticketTypeId===id); return i? p.map(x=>x.ticketTypeId===id?{...x,qty:x.qty+1}:x):[...p,{ticketTypeId:id,qty:1}] })

  const checkout = async () => {
    const res = await fetch('/api/checkout', { method:'POST', body: JSON.stringify({ userEmail:'demo+fan@innovaas.co', name:'Demo Fan', items }), headers:{'Content-Type':'application/json'} })
    const j = await res.json(); alert('Order '+j.orderId+' completed. (Mock)')
  }

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold">Lady Gaga — One Night in KL</h2>
        <p className="text-zinc-400">KLCC Arena · Tonight</p>
        <div className="mt-6 grid gap-3">
          <div className="flex items-center justify-between">
            <span>GA — MYR 100</span>
            <Button onClick={()=>add('ticket_type:ga')}>Add</Button>
          </div>
          <div className="flex items-center justify-between">
            <span>VIP — MYR 250</span>
            <Button onClick={()=>add('ticket_type:vip')}>Add</Button>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-xl font-medium">Your Order</h3>
        <pre className="mt-4 bg-black/30 rounded-xl p-4 text-sm">{JSON.stringify(items, null, 2)}</pre>
        <Button className="mt-6 w-full rounded-2xl" disabled={!items.length} onClick={checkout}>Checkout (Mock)</Button>
      </Card>
    </div>
  )
}
```

### 10.4 Artist + Charity pages
- Artist: show cards for sales, uplift %, quick create new event (nonfunctional form is fine).
- Charity: Recharts line/bar of “Funds Raised”, list top contributing events.

---

## 11) Playwright: E2E + Visual Diffs

### 11.1 Config (`playwright.config.ts`)
```ts
import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './src/tests/e2e',
  timeout: 30_000,
  expect: { toMatchSnapshot: { threshold: 0.2 } },
  reporter: [['list'], ['html']],
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ]
})
```

### 11.2 E2E happy path (`src/tests/e2e/happy.spec.ts`)
```ts
import { test, expect } from '@playwright/test'

test('fan buys GA and VIP, sees order confirmation', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('text=Fair Tickets')).toBeVisible()
  await page.getByRole('link', { name: 'Fan Demo' }).click()
  await page.getByRole('button', { name: 'Add' }).first().click()
  await page.getByRole('button', { name: 'Add' }).nth(1).click()
  await page.getByRole('button', { name: 'Checkout (Mock)' }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'src/tests/e2e/__screens__/checkout.png', fullPage: true })
})
```

### 11.3 Component testing & visual snapshots
Create `src/tests/ct/button.spec.tsx` for shadcn Button snapshot:
```tsx
import { test, expect } from '@playwright/experimental-ct-react'
import { Button } from '@/components/ui/button'

test.use({ viewport: { width: 600, height: 200 } })

test('primary button looks on-brand', async ({ mount }) => {
  const cmp = await mount(<div className="p-6 bg-paper"><Button>Buy Now</Button></div>)
  await expect(cmp).toHaveScreenshot('button.png')
})
```

> **Why Playwright here?**
> - **Demo automation:** record a smooth scripted run you can replay on calls.
> - **Visual regression:** ensure your distinctive styling stays pixel‑perfect.
> - **Component testing:** iterate on look/feel without full app runtime.

---

## 12) Scripts (package.json)
Add/merge:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:up": "docker compose up -d surrealdb",
    "db:seed": "node scripts/seed.mjs",
    "e2e": "playwright test",
    "ct": "PLAYWRIGHT_CT_COMPONENT_NAME=react playwright test -c playwright-ct.config.ts"
  }
}
```
Create `playwright-ct.config.ts`:
```ts
import { defineConfig } from '@playwright/experimental-ct-react'
export default defineConfig({ testDir: './src/tests/ct' })
```

---

## 13) Running Locally
```bash
pnpm install
pnpm db:up && pnpm db:seed
pnpm dev # open http://localhost:3000

# Run the demo script (captures screenshots + a trace)
pnpm e2e && npx playwright show-report
```

---

## 14) Optional Enhancements (fast wins)
- **Queue visual:** add a fake “queue token” step with animated progress.
- **Wallet pass mock:** render Apple/Google pass style card; link to `/api/qr/:hash` image.
- **Uplift logic:** add a slider (0–10%) on artist page; show charity cut on checkout review.
- **Live updates:** add SurrealDB `LIVE SELECT` via server action stream for real‑time sales card.
- **Brand mode:** a toggle that switches to *artist branded* colors for white‑label demo.

---

## 15) Deployment
- **Vercel** for Next.js front‑end; host SurrealDB on a small VM (or Docker on Fly.io/Render). Update `.env` accordingly.
- Enable Playwright in CI (GitHub Actions) to publish HTML reports and golden snapshots for every commit to the demo branch.

---

## 16) Design Language Cheatsheet
- **Shapes:** Rounded‑2xl cards, thin borders, soft shadows; use `bg-white/5` over dark surfaces.
- **Motion:** `duration-300` hover, Framer Motion `spring` on primary CTAs, page `opacity` fade.
- **Color:** Teal/seafoam brand with charcoal/dark base; accents on actionable elements only.
- **Density:** Embrace whitespace; use `grid` + `gap-6/8` for relaxed rhythm.

---

## 17) Troubleshooting
- **Surreal auth error:** confirm `.env.local` and that Docker is running on `8000`.
- **Playwright binaries:** re‑run `pnpm dlx playwright install --with-deps`.
- **Tailwind not applying:** ensure `content` globs include `src/**/*.{ts,tsx}`.

---

### You now have:
- A runnable Next.js + SurrealDB concept with striking modern UI.
- Playwright flows that double as a live demo generator and visual guardrail.
- Clear hooks to extend into seating maps, queueing, resale, and charity uplift.

