# GiveLove Mock Ticketing Platform

> A charitable ticketing platform that enables artists to add charity uplifts to ticket sales
> Last Updated: 2025-09-24

## Platform Overview

GiveLove is a Next.js-based ticketing platform that allows artists to set charity uplifts on ticket sales. Artists can dynamically adjust the percentage uplift through their portal, and customers see real-time pricing that includes:

- **Face Value**: Base ticket price (what artist receives)
- **Charity Uplift**: Additional percentage on top of face value (goes to charity)
- **Platform Fee**: 2.5% + $1.69 per ticket (calculated on total sale price)

## Architecture

### Tech Stack
- **Framework**: Next.js 15.x with TypeScript
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **State Management**: React Context API (PricingContext)
- **Styling**: TailwindCSS with Framer Motion
- **Icons**: Lucide React

### Key Components

#### Pricing System
- **`/src/lib/db.ts`**: Prisma database client configuration
- **`/src/contexts/PricingContext.tsx`**: Global pricing state management
- **`/src/utils/ticketPricing.ts`**: Centralized pricing calculation utilities
- **`/src/components/artist/UpliftControl.tsx`**: Artist uplift control component with demand-based suggestions

#### Artist Portals
- **`/src/app/artist/[artist-name]/page.tsx`**: Individual artist portals
  - Taylor Swift (`/artist/taylor-swift`)
  - Lady Gaga (`/artist/lady-gaga`)
  - Dolly Parton (`/artist/dolly-parton`)
  - Garth Brooks (`/artist/garth-brooks`)

#### Event Pages (Customer-facing)
- **`/src/app/event/[artist-name]/page.tsx`**: Ticket purchasing pages
  - Uses same pricing logic as artist portals
  - Real-time pricing updates based on artist's uplift settings
  - Shopping cart with accurate total calculations

#### Checkout Flow
- **`/src/app/checkout/confirmation/page.tsx`**: Order confirmation with correct pricing

### Pricing Calculation Logic

```typescript
// Face value uplift calculation (NEW - CORRECT)
const charityAmount = basePrice * (upliftPercentage / 100);
const totalSalePrice = basePrice + charityAmount;
const platformFee = (totalSalePrice * 0.025) + 1.69;

// Revenue distribution
const artistRevenue = basePrice; // Artist gets full face value
const charityRevenue = charityAmount;
const platformRevenue = platformFee;
```

### Data Flow

```
Artist Portal → PricingContext → Event Page → Cart → Checkout → Confirmation

1. Artist sets uplift % in portal
2. PricingContext stores globally
3. Event page reads current uplift
4. Customer sees updated pricing
5. Cart/checkout use same calculations
6. Confirmation shows accurate totals
```

## Key Features

### Dynamic Pricing
- Artists can adjust charity uplift from 0-200%
- Real-time pricing updates across the platform
- Demand-based uplift suggestions using event sales data

### Charity Integration
- Each artist supports different charities:
  - Taylor Swift → Education for All
  - Lady Gaga → Mental Health Foundation
  - Dolly Parton → Imagination Library
  - Garth Brooks → Rural Education Foundation

### Revenue Transparency
- Clear breakdown of where money goes
- Visual progress bars showing revenue split
- Impact metrics showing charity contribution effects

## Recent Updates (Sept 2025)

### ✅ Completed Features
1. **Unified Pricing Logic**: All pages now use `calculateTicketPricing()` utility
2. **Fixed Checkout Flow**: Confirmation page shows correct uplift amounts
3. **Demand Algorithm**: AI-powered uplift suggestions based on ticket sales
4. **Artist Portal Updates**: All portals use new calculation logic
5. **End-to-End Consistency**: Complete pricing flow from artist → customer → confirmation

### 🔧 Core Files Updated
- `/src/utils/ticketPricing.ts` - Centralized pricing calculations
- `/src/components/artist/UpliftControl.tsx` - Updated with correct logic
- All artist portal pages - Use new uplift calculation
- All event pages - Use centralized pricing utility
- `/src/app/checkout/confirmation/page.tsx` - Dynamic pricing calculations

## Development Guidelines

### Adding New Artists
1. Create artist portal in `/src/app/artist/[name]/page.tsx`
2. Create event page in `/src/app/event/[name]/page.tsx`
3. Add artist to `PricingContext` with default pricing
4. Update checkout confirmation artist data mapping

### Pricing Changes
- All pricing logic should use utilities from `/src/utils/ticketPricing.ts`
- Never hardcode pricing calculations
- Always use `PricingContext` for artist-specific pricing

### Testing
- Verify uplift changes in artist portal reflect on event page
- Test complete purchase flow: portal → event → cart → checkout → confirmation
- Ensure platform fee calculation is correct: (subtotal * 0.025) + 1.69

## File Structure

```
src/
├── app/
│   ├── artist/[name]/page.tsx     # Artist portals
│   ├── event/[name]/page.tsx      # Customer ticket pages
│   └── checkout/
│       └── confirmation/page.tsx  # Order confirmation
├── components/
│   └── artist/
│       └── UpliftControl.tsx      # Uplift control component
├── contexts/
│   └── PricingContext.tsx         # Global pricing state
└── utils/
    ├── ticketPricing.ts           # Pricing calculations
    └── demandCalculator.ts        # Demand-based suggestions
```

---

*For questions about implementation or extending the platform, refer to the pricing utilities and context files.*
- Add to memory and update CLAUDE.md