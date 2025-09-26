import { db } from './db';

interface SimulationState {
  isRunning: boolean;
  ticketsPerMinute: number;
  startedAt: Date;
  lastPurchaseAt: Date;
}

class ServerSimulation {
  private static instance: ServerSimulation;
  private intervalId: NodeJS.Timeout | null = null;
  private state: SimulationState = {
    isRunning: false,
    ticketsPerMinute: 5,
    startedAt: new Date(),
    lastPurchaseAt: new Date()
  };

  private constructor() {}

  static getInstance(): ServerSimulation {
    if (!ServerSimulation.instance) {
      ServerSimulation.instance = new ServerSimulation();
    }
    return ServerSimulation.instance;
  }

  /**
   * Start server-side simulation
   */
  async startSimulation(ticketsPerMinute: number = 5): Promise<void> {
    if (this.state.isRunning) {
      console.log('[SERVER-SIM] Already running');
      return;
    }

    this.state = {
      isRunning: true,
      ticketsPerMinute,
      startedAt: new Date(),
      lastPurchaseAt: new Date()
    };

    const intervalMs = (60 / ticketsPerMinute) * 1000;

    this.intervalId = setInterval(async () => {
      try {
        await this.simulateRandomPurchase();
        this.state.lastPurchaseAt = new Date();
      } catch (error) {
        console.error('[SERVER-SIM] Purchase failed:', error);
      }
    }, intervalMs);

    console.log(`[SERVER-SIM] Started - ${ticketsPerMinute} tickets/min`);
  }

  /**
   * Stop server-side simulation
   */
  stopSimulation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.state.isRunning = false;
    console.log('[SERVER-SIM] Stopped');
  }

  /**
   * Get current simulation state
   */
  getState(): SimulationState {
    return { ...this.state };
  }

  /**
   * Simulate a random purchase
   */
  private async simulateRandomPurchase(): Promise<void> {
    try {
      // Get active events
      const events = await db.event.findMany({
        where: {
          status: 'ACTIVE',
          soldTickets: {
            lt: db.event.fields.totalTickets // Still has available tickets
          }
        },
        include: {
          artist: {
            include: {
              pricing: true
            }
          }
        }
      });

      if (events.length === 0) {
        console.log('[SERVER-SIM] No available events');
        return;
      }

      // Pick random event
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const artist = randomEvent.artist;

      if (!artist.pricing) {
        console.log(`[SERVER-SIM] No pricing for ${artist.name}`);
        return;
      }

      // Check if event still has tickets
      if (randomEvent.soldTickets >= randomEvent.totalTickets) {
        console.log(`[SERVER-SIM] Event ${randomEvent.name} sold out`);
        return;
      }

      // Generate 1-3 random seats
      const ticketCount = Math.floor(Math.random() * 3) + 1;
      const availableTickets = randomEvent.totalTickets - randomEvent.soldTickets;
      const actualTicketCount = Math.min(ticketCount, availableTickets);

      // Generate seat data
      const seats = this.generateRandomSeats(artist.slug, actualTicketCount);

      // Create simulation customer
      const simulationCustomer = await this.createSimulationCustomer();

      // Calculate pricing
      const basePrice = artist.pricing.basePrice;
      const charityUplift = artist.pricing.currentUplift;
      const charityAmount = basePrice * (charityUplift / 100);
      const totalSalePrice = basePrice + charityAmount;
      const platformFee = (totalSalePrice * 0.025) + 1.69;
      const finalPrice = totalSalePrice + platformFee;

      // Create order with seat metadata
      await db.order.create({
        data: {
          customerId: simulationCustomer.id,
          artistId: artist.id,
          eventId: randomEvent.id,
          basePrice,
          charityUplift,
          charityAmount,
          platformFee,
          totalAmount: finalPrice,
          quantity: actualTicketCount,
          status: 'CONFIRMED',
          paymentIntentId: `SIM_SEATS_${JSON.stringify(seats)}`
        }
      });

      // Update event sold tickets
      await db.event.update({
        where: { id: randomEvent.id },
        data: {
          soldTickets: {
            increment: actualTicketCount
          }
        }
      });

      console.log(`[SERVER-SIM] Purchased ${actualTicketCount} seats for ${artist.name}`);

    } catch (error) {
      console.error('[SERVER-SIM] Random purchase failed:', error);
    }
  }

  /**
   * Generate random seat data
   */
  private generateRandomSeats(artistSlug: string, count: number) {
    const venueMap: Record<string, string> = {
      'taylor-swift': 'metlife-stadium',
      'lady-gaga': 'klcc-arena',
      'dolly-parton': 'grand-ole-opry',
      'garth-brooks': 'madison-square-garden'
    };

    const seats = [];
    for (let i = 0; i < count; i++) {
      const row = Math.floor(Math.random() * 20) + 1;
      const seatNum = Math.floor(Math.random() * 24) + 1;
      const seatId = `main-${row}-${seatNum}`;

      seats.push({
        seatId,
        section: 'Main Section',
        row: row.toString(),
        number: seatNum,
        ticketType: row <= 3 ? 'vip' : 'ga'
      });
    }
    return seats;
  }

  /**
   * Create simulation customer
   */
  private async createSimulationCustomer() {
    const timestamp = Date.now();
    const customerName = this.generateCustomerName();

    return await db.customer.create({
      data: {
        email: `simulation-${timestamp}@givelove-demo.com`,
        firstName: customerName.first,
        lastName: customerName.last,
        phone: this.generatePhoneNumber()
      }
    });
  }

  /**
   * Generate customer name
   */
  private generateCustomerName(): { first: string; last: string } {
    const firstNames = [
      'Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Avery', 'Blake', 'Cameron',
      'Drew', 'Ellis', 'Finley', 'Gray', 'Harper', 'Indigo', 'Jade', 'Kennedy'
    ];

    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'
    ];

    return {
      first: firstNames[Math.floor(Math.random() * firstNames.length)],
      last: lastNames[Math.floor(Math.random() * lastNames.length)]
    };
  }

  /**
   * Generate phone number
   */
  private generatePhoneNumber(): string {
    const area = Math.floor(Math.random() * 800) + 200;
    const exchange = Math.floor(Math.random() * 800) + 200;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `(${area}) ${exchange}-${number}`;
  }

  /**
   * Reset all simulation data
   */
  async resetAllData(): Promise<void> {
    try {
      // Stop simulation first
      this.stopSimulation();

      // Find all simulation customers
      const simulationCustomers = await db.customer.findMany({
        where: {
          email: { contains: 'simulation-' }
        }
      });

      if (simulationCustomers.length === 0) {
        console.log('[SERVER-SIM] No data to reset');
        return;
      }

      const customerIds = simulationCustomers.map(c => c.id);

      // Get orders to calculate ticket quantities to subtract
      const orders = await db.order.findMany({
        where: {
          customerId: { in: customerIds },
          status: 'CONFIRMED'
        }
      });

      // Group orders by event to calculate tickets to subtract
      const eventTicketCounts = new Map<string, number>();
      for (const order of orders) {
        const currentCount = eventTicketCounts.get(order.eventId) || 0;
        eventTicketCounts.set(order.eventId, currentCount + order.quantity);
      }

      // Delete simulation orders
      const deletedOrders = await db.order.deleteMany({
        where: { customerId: { in: customerIds } }
      });

      // Update event sold tickets
      for (const [eventId, ticketCount] of eventTicketCounts.entries()) {
        await db.event.update({
          where: { id: eventId },
          data: {
            soldTickets: { decrement: ticketCount }
          }
        });
      }

      // Delete simulation customers
      await db.customer.deleteMany({
        where: { id: { in: customerIds } }
      });

      console.log(`[SERVER-SIM] Reset complete - removed ${deletedOrders.count} orders`);

    } catch (error) {
      console.error('[SERVER-SIM] Reset failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const serverSimulation = ServerSimulation.getInstance();