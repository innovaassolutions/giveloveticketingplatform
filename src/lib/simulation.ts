import { db } from './db';
import { PrismaClient } from '../generated/prisma';

interface CustomerPersona {
  name: string;
  ageRange: string;
  charityMotivation: number; // 0-1 scale
  priceElasticity: number;   // 0-1 scale (higher = more price sensitive)
  fanLoyalty: number;        // 0-1 scale
  purchaseProbability: number;
}

interface PurchaseSimulation {
  customerId: string;
  artistId: string;
  eventId: string;
  willBuy: boolean;
  maxPrice: number;
  timeToDecision: number; // minutes
}

// Customer personas based on real concert-goer demographics
const CUSTOMER_PERSONAS: CustomerPersona[] = [
  {
    name: "Young Superfan",
    ageRange: "16-25",
    charityMotivation: 0.9,
    priceElasticity: 0.3,
    fanLoyalty: 0.95,
    purchaseProbability: 0.85
  },
  {
    name: "Professional Millennial",
    ageRange: "26-35",
    charityMotivation: 0.8,
    priceElasticity: 0.5,
    fanLoyalty: 0.7,
    purchaseProbability: 0.6
  },
  {
    name: "Family-Oriented Gen X",
    ageRange: "36-50",
    charityMotivation: 0.75,
    priceElasticity: 0.7,
    fanLoyalty: 0.6,
    purchaseProbability: 0.45
  },
  {
    name: "Affluent Boomer",
    ageRange: "51-65",
    charityMotivation: 0.85,
    priceElasticity: 0.2,
    fanLoyalty: 0.8,
    purchaseProbability: 0.7
  },
  {
    name: "Price-Conscious Student",
    ageRange: "18-24",
    charityMotivation: 0.6,
    priceElasticity: 0.9,
    fanLoyalty: 0.8,
    purchaseProbability: 0.3
  }
];

export class BuyingSimulator {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = db;
  }

  /**
   * Generate realistic customers based on personas
   */
  async generateCustomers(count: number = 1000): Promise<string[]> {
    const customers: any[] = [];
    const names = [
      "Alex", "Jordan", "Taylor", "Casey", "Riley", "Avery", "Blake", "Cameron",
      "Drew", "Ellis", "Finley", "Gray", "Harper", "Indigo", "Jade", "Kennedy",
      "Lane", "Morgan", "Noel", "Ocean", "Parker", "Quinn", "River", "Sage"
    ];

    for (let i = 0; i < count; i++) {
      const persona = CUSTOMER_PERSONAS[Math.floor(Math.random() * CUSTOMER_PERSONAS.length)];
      const firstName = names[Math.floor(Math.random() * names.length)];
      const lastName = `Customer${i.toString().padStart(4, '0')}`;

      customers.push({
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        firstName,
        lastName,
        phone: this.generatePhoneNumber()
      });
    }

    const result = await this.prisma.customer.createMany({
      data: customers,
      skipDuplicates: true
    });

    // Return customer IDs for use in simulations
    const createdCustomers = await this.prisma.customer.findMany({
      select: { id: true }
    });

    return createdCustomers.map(c => c.id);
  }

  /**
   * Simulate buying behavior based on current pricing
   */
  async simulatePurchases(artistId: string, eventId: string, simulationMinutes: number = 60): Promise<void> {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
      include: { pricing: true }
    });

    const event = await this.prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!artist || !artist.pricing || !event) {
      throw new Error('Artist, pricing, or event not found');
    }

    const customers = await this.prisma.customer.findMany();
    const availableTickets = event.totalTickets - event.soldTickets;

    if (availableTickets <= 0) {
      return; // Event sold out
    }

    // Calculate current ticket price with charity uplift
    const basePrice = artist.pricing.basePrice;
    const charityUplift = artist.pricing.currentUplift;
    const charityAmount = basePrice * (charityUplift / 100);
    const totalSalePrice = basePrice + charityAmount;
    const platformFee = (totalSalePrice * 0.025) + 1.69;
    const finalPrice = totalSalePrice + platformFee;

    // Simulate purchases over time
    const purchasesPerMinute = this.calculateDemandRate(artist.pricing.currentUplift);
    const totalPurchases = Math.min(
      Math.floor(purchasesPerMinute * simulationMinutes),
      availableTickets,
      customers.length
    );

    console.log(`Simulating ${totalPurchases} purchases for ${artist.name} over ${simulationMinutes} minutes`);

    for (let i = 0; i < totalPurchases; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const persona = this.assignPersona(customer);

      // Determine if customer will buy at current price
      const willBuy = this.determineWillBuy(persona, finalPrice, charityUplift);

      if (willBuy) {
        // Create order
        await this.prisma.order.create({
          data: {
            customerId: customer.id,
            artistId: artist.id,
            eventId: event.id,
            basePrice: basePrice,
            charityUplift: charityUplift,
            charityAmount: charityAmount,
            platformFee: platformFee,
            totalAmount: finalPrice,
            quantity: 1,
            status: 'CONFIRMED'
          }
        });

        // Update event sold tickets
        await this.prisma.event.update({
          where: { id: event.id },
          data: {
            soldTickets: {
              increment: 1
            }
          }
        });
      }

      // Add small delay to simulate real-time purchases
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Generate demand suggestion based on simulation results
    await this.generateDemandSuggestion(artist.pricing.id, totalPurchases, simulationMinutes);
  }

  /**
   * Calculate demand rate based on charity uplift percentage
   */
  private calculateDemandRate(upliftPercent: number): number {
    // Base demand rate (purchases per minute)
    let baseRate = 2.5;

    // Adjust based on charity uplift - higher uplift reduces demand
    if (upliftPercent > 200) {
      baseRate *= 0.1; // Very high uplift drastically reduces demand
    } else if (upliftPercent > 150) {
      baseRate *= 0.3;
    } else if (upliftPercent > 100) {
      baseRate *= 0.6;
    } else if (upliftPercent > 50) {
      baseRate *= 0.8;
    }
    // Sweet spot around 25-50% uplift maintains good demand

    return Math.max(0.1, baseRate); // Minimum 0.1 purchases per minute
  }

  /**
   * Assign a persona to a customer for purchase decision
   */
  private assignPersona(customer: any): CustomerPersona {
    return CUSTOMER_PERSONAS[Math.floor(Math.random() * CUSTOMER_PERSONAS.length)];
  }

  /**
   * Determine if customer will buy based on persona and pricing
   */
  private determineWillBuy(persona: CustomerPersona, totalPrice: number, charityUplift: number): boolean {
    // Base willingness to buy from persona
    let willingness = persona.purchaseProbability;

    // Adjust for charity motivation (higher uplift appeals to charity-minded customers)
    const charityBonus = (charityUplift / 200) * persona.charityMotivation * 0.3;
    willingness += charityBonus;

    // Adjust for price sensitivity
    const priceThreshold = 150 * (1 - persona.priceElasticity); // Base price comfort
    if (totalPrice > priceThreshold) {
      const priceOverage = (totalPrice - priceThreshold) / priceThreshold;
      willingness -= priceOverage * persona.priceElasticity * 0.5;
    }

    // Random factor
    const randomFactor = (Math.random() - 0.5) * 0.2;
    willingness += randomFactor;

    return Math.random() < Math.max(0, Math.min(1, willingness));
  }

  /**
   * Generate AI demand suggestion based on simulation results
   */
  private async generateDemandSuggestion(pricingId: string, purchasesMade: number, timeMinutes: number): Promise<void> {
    const purchasesPerMinute = purchasesMade / timeMinutes;
    const demandScore = Math.min(100, purchasesPerMinute * 20); // Scale to 0-100

    let suggestedUplift: number;
    let reason: string;

    if (demandScore > 80) {
      suggestedUplift = 175; // High demand, can increase uplift
      reason = "Extremely high demand detected. Consider increasing charity uplift to maximize impact.";
    } else if (demandScore > 60) {
      suggestedUplift = 150; // Good demand, maintain or slight increase
      reason = "Strong demand allows for generous charity contribution while maintaining sales velocity.";
    } else if (demandScore > 40) {
      suggestedUplift = 125; // Moderate demand
      reason = "Moderate demand suggests current pricing is near optimal balance point.";
    } else if (demandScore > 20) {
      suggestedUplift = 100; // Lower demand, reduce uplift
      reason = "Lower demand indicates price sensitivity. Consider reducing uplift to increase accessibility.";
    } else {
      suggestedUplift = 75; // Very low demand
      reason = "Low demand suggests significant price sensitivity. Lower uplift recommended to boost sales.";
    }

    await this.prisma.demandSuggestion.create({
      data: {
        artistPricingId: pricingId,
        suggestedUplift,
        reason,
        ticketsSold: purchasesMade,
        totalRevenue: purchasesMade * 200, // Approximate revenue
        demandScore
      }
    });
  }

  /**
   * Run complete simulation for all artists
   */
  async runFullSimulation(): Promise<void> {
    console.log('Starting full GiveLove platform simulation...');

    // Generate customers if none exist
    const existingCustomers = await this.prisma.customer.count();
    if (existingCustomers === 0) {
      console.log('Generating customers...');
      await this.generateCustomers(1000);
    }

    // Get all artists and their events
    const artists = await this.prisma.artist.findMany({
      include: {
        events: true,
        pricing: true
      }
    });

    for (const artist of artists) {
      if (artist.events.length > 0 && artist.pricing) {
        console.log(`Simulating purchases for ${artist.name}...`);

        for (const event of artist.events) {
          await this.simulatePurchases(artist.id, event.id, 120); // 2 hour simulation
        }
      }
    }

    console.log('Simulation complete!');
  }

  private generatePhoneNumber(): string {
    const area = Math.floor(Math.random() * 800) + 200;
    const exchange = Math.floor(Math.random() * 800) + 200;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `(${area}) ${exchange}-${number}`;
  }
}

// Export singleton instance
export const simulator = new BuyingSimulator();