# Give Back Ticketing Platform - Development Status

> Last Updated: September 19, 2025
> Development Server: http://localhost:3005
> SurrealDB: http://localhost:8000

## Project Overview

A modern ticketing platform concept inspired by Ticketmaster, built with Next.js 15, SurrealDB, and Tailwind CSS. Features charity uplift functionality, seating maps, and real-time ticket sales tracking.

## ✅ Setup Complete

### Core Infrastructure
- **Next.js 15** with TypeScript and App Router
- **SurrealDB** running in Docker on port 8000
- **Tailwind CSS v4** with custom design tokens
- **Development server** running on port 3005

### Database & Backend
- SurrealDB schema with complete event/ticket data model
- Seeded with Lady Gaga demo event data
- Database client utilities configured
- Environment variables set up

### Design System
- Dark theme with Ticketmaster-inspired colors
- Primary blue: #026cdf (Ticketmaster blue)
- Brand teal palette for accents
- Inter font family
- Custom CSS variables and utilities

## 🏗️ Architecture

```
src/
  app/
    layout.tsx              # Root layout with dark theme
    page.tsx               # Landing page (Next.js default)
    globals.css            # Tailwind + custom design tokens
  lib/
    db.ts                  # SurrealDB client and query utilities
    utils.ts               # cn() utility for shadcn/ui
    format.ts              # Currency and date formatting
```

## 📊 Database Schema

Tables configured in SurrealDB:
- `organiser` - Event organizers (Innovaas Live)
- `venue` - Event venues (KLCC Arena)
- `event` - Events (Lady Gaga concert)
- `ticket_type` - Ticket categories (GA, VIP)
- `user` - Customer accounts
- `order` - Purchase orders
- `ticket` - Individual tickets with QR codes

## 🎨 Design Tokens

Inspired by Ticketmaster screenshots:

```css
/* Primary Colors */
--primary: #026cdf          /* Ticketmaster blue */
--primary-dark: #0052b3
--primary-light: #4285f4

/* Brand Palette */
--brand-400: #33b8aa        /* Teal accent */
--brand-500: #0b998c
--brand-600: #077a70

/* Background */
--background: #0b0d10       /* Dark theme */
--foreground: #ffffff
```

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start dev server (port 3005)
npm run build           # Build for production
npm run lint            # Run ESLint

# Database
npm run db:up           # Start SurrealDB container
npm run db:seed         # Seed with demo data
docker compose down     # Stop SurrealDB

# Testing (when implemented)
npm run e2e             # Run Playwright e2e tests
npm run ct              # Run component tests
```

## 🔧 Environment Variables

```env
SURREAL_URL=http://127.0.0.1:8000/rpc
SURREAL_USER=root
SURREAL_PASS=root
SURREAL_NS=demo
SURREAL_DB=organiser_1
```

## 📋 Next Steps (Detailed Implementation Plan)

### Phase 1: Core Pages & Navigation
1. **Landing Page** (`src/app/page.tsx`)
   - Hero with "Fair Tickets. Real Impact" headline
   - Role switcher buttons (Artist Portal, Fan Demo, Charity Dashboard)
   - Modern UI with Framer Motion animations

2. **App Layout** (`src/app/layout.tsx`)
   - Dark theme with brand colors
   - Navigation structure
   - Responsive design

### Phase 2: Fan Experience
3. **Fan Event Page** (`src/app/(fan)/event/[id]/page.tsx`)
   - Event details (Lady Gaga - One Night in KL)
   - Interactive seating map component
   - Ticket type selection (GA, VIP)
   - Shopping cart and checkout flow

### Phase 3: Artist Portal
4. **Artist Dashboard** (`src/app/(artist)/artist/page.tsx`)
   - Sales metrics and charts (Recharts)
   - Revenue split visualization (PieChart)
   - Charity uplift slider control
   - Event management interface

### Phase 4: Charity Dashboard
5. **Charity Dashboard** (`src/app/(charity)/charity/page.tsx`)
   - Funds raised tracking
   - Impact metrics visualization
   - Top contributing events list
   - Real-time updates from uplift percentage

### Phase 5: API & Backend
6. **API Routes**
   - `/api/checkout` - Mock payment processing
   - `/api/qr/[hash]` - QR code PNG generation
   - `/api/db` - Database proxy for server actions

## 🏷️ Key Components to Build

### Required Components (from extended specs)

#### **1. Seating Map Component** (`src/components/seating/SeatMap.tsx`)
- **Features**: Interactive SVG grid with clickable seats
- **Props**: `rows`, `cols`, `sold[]`, `held[]`, `onChange`
- **Status tracking**: available | held | sold
- **Visual**: Green (available), Blue (selected), Red (sold), Yellow (held)
- **Integration**: Fan event page seat selection

#### **2. Charity Uplift Slider** (`src/components/artist/UpliftSlider.tsx`)
- **Features**: Revenue split control (0-25%)
- **Output**: `Split { platform, artist, charity }`
- **Real-time**: Updates pie chart visualization
- **UI**: Slider with percentage breakdown display
- **Integration**: Artist portal dashboard

#### **3. shadcn/ui Components** (Install as needed)
```bash
npx shadcn@latest add button card input slider dialog badge avatar progress toast
```

#### **4. Chart Components** (using Recharts)
- **PieChart**: Revenue split visualization
- **LineChart**: Sales tracking over time
- **BarChart**: Event comparison metrics

### API Implementation

#### **Checkout Flow** (`/api/checkout/route.ts`)
- Create user if not exists
- Calculate total from ticket types
- Generate order record
- Issue tickets with unique QR hashes
- Update quantity_sold counters

#### **QR Code Generation** (`/api/qr/[hash]/route.ts`)
- Generate QR PNG from ticket hash
- 512px width, optimized for mobile scanning
- Return as image/png response

### Demo Flow (Extended Specs)
- **Fan Journey**: Browse event → Select seats via SeatingMap → Choose ticket types → Checkout (mock)
- **Artist Control**: Adjust charity uplift % → See real-time revenue split chart updates
- **Charity Impact**: View funds raised dashboard tied to artist uplift settings

### Playwright Testing
- **E2E Happy Path**: Fan selects seats + tickets → Checkout → Success
- **Visual Regression**: Component screenshots for design consistency
- **Artist Flow**: Uplift slider interaction + chart updates

## 📁 File Structure Reference

```
ticketing-concept/
├── docker-compose.yml     # SurrealDB container
├── db/schema.surql        # Database schema + seed data
├── scripts/seed.mjs       # Database seeding script
├── src/
│   ├── app/              # Next.js App Router
│   ├── lib/              # Utilities and database client
│   └── components/       # React components (to be added)
├── .env.local            # Environment variables
└── package.json          # Dependencies and scripts
```

## 🔗 Useful Links

- Development: http://localhost:3005
- SurrealDB Admin: http://localhost:8000
- Specs: `1_Give Back Ticketing Platform SurrealDB Setup.md`
- Extended Specs: `2_Give Back Ticketing Platform SurrealDB Setup.md`
- Screenshots: `screenshots/` (design inspiration)

---

**Status**: Setup complete ✅ | Ready for feature development 🚀