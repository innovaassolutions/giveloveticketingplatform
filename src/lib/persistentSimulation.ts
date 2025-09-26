import { db } from './db';

interface PurchasedSeat {
  id: string;
  artistSlug: string;
  venueLayout: string;
  section: string;
  row: string;
  number: number;
  ticketTypeId: string;
  purchaseTimestamp: number;
}

interface SimulationState {
  isRunning: boolean;
  ticketsPerMinute: number;
  lastActivity: Date;
}

export class PersistentSimulation {
  private static readonly SIMULATION_TAG = '[SIMULATION]';

  /**
   * Start the simulation with database persistence
   */
  async startSimulation(ticketsPerMinute: number): Promise<void> {
    console.log(`${PersistentSimulation.SIMULATION_TAG} Started with ${ticketsPerMinute} tickets/min`);
  }

  /**
   * Stop the simulation
   */
  async stopSimulation(): Promise<void> {
    console.log(`${PersistentSimulation.SIMULATION_TAG} Stopped`);
  }

  /**
   * Get current simulation state by checking recent activity
   */
  async getSimulationState(): Promise<SimulationState | null> {
    try {
      const recentSimOrders = await db.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
          },
          customer: {
            email: {
              contains: 'simulation-'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      });

      const isRunning = recentSimOrders.length > 0;

      return {
        isRunning,
        ticketsPerMinute: 5,
        lastActivity: recentSimOrders[0]?.createdAt || new Date()
      };
    } catch (error) {
      console.error('Error getting simulation state:', error);
      return null;
    }
  }

  /**
   * Simulate purchasing specific seats and create database records
   */
  async simulateSeatPurchases(artistSlug: string, seats: PurchasedSeat[]): Promise<void> {
    if (seats.length === 0) return;

    try {
      // Get the artist and their active events
      const artist = await db.artist.findFirst({
        where: { slug: artistSlug },
        include: {
          events: {
            where: { status: 'ACTIVE' },
            orderBy: { date: 'asc' }
          },
          pricing: true
        }
      });

      if (!artist || !artist.events.length || !artist.pricing) {
        console.log(`${PersistentSimulation.SIMULATION_TAG} No active events found for ${artistSlug}`);
        return;
      }

      const event = artist.events[0]; // Use first active event

      // Check if event still has available tickets
      if (event.soldTickets >= event.totalTickets) {
        console.log(`${PersistentSimulation.SIMULATION_TAG} Event ${event.name} is sold out`);
        return;
      }

      // Create a simulation customer for this purchase
      const simulationCustomer = await this.createSimulationCustomer();

      // Calculate pricing using the same logic as the real system
      const basePrice = artist.pricing.basePrice;
      const charityUplift = artist.pricing.currentUplift;
      const charityAmount = basePrice * (charityUplift / 100);
      const totalSalePrice = basePrice + charityAmount;
      const platformFee = (totalSalePrice * 0.025) + 1.69;
      const finalPrice = totalSalePrice + platformFee;

      // Create the order with seat information stored in a JSON field
      // We'll store the seat details as metadata since the current schema doesn't have a seats table
      const seatMetadata = seats.map(seat => ({
        seatId: seat.id,
        section: seat.section,
        row: seat.row,
        number: seat.number,
        ticketType: seat.ticketTypeId
      }));

      const order = await db.order.create({
        data: {
          customerId: simulationCustomer.id,
          artistId: artist.id,
          eventId: event.id,
          basePrice,
          charityUplift,
          charityAmount,
          platformFee,
          totalAmount: finalPrice,
          quantity: seats.length,
          status: 'CONFIRMED',
          // Store seat information in a way that can be retrieved later
          // In the future, we might add a dedicated seats table, but for now we'll use the payment intent field
          paymentIntentId: `SIM_SEATS_${JSON.stringify(seatMetadata)}`
        }
      });

      // Update event sold tickets
      await db.event.update({
        where: { id: event.id },
        data: {
          soldTickets: {
            increment: seats.length
          }
        }
      });

      console.log(`${PersistentSimulation.SIMULATION_TAG} Purchased ${seats.length} seats for ${artist.name}: ${seats.map(s => s.id).join(', ')}`);

    } catch (error) {
      console.error(`${PersistentSimulation.SIMULATION_TAG} Seat purchase failed:`, error);
    }
  }

  /**
   * Get all purchased seats for a specific artist (from database)
   */
  async getPurchasedSeatsByArtist(artistSlug: string): Promise<PurchasedSeat[]> {
    try {
      const orders = await db.order.findMany({
        where: {
          artist: { slug: artistSlug },
          customer: {
            email: { contains: 'simulation-' }
          },
          status: 'CONFIRMED',
          paymentIntentId: { startsWith: 'SIM_SEATS_' }
        },
        include: {
          customer: true
        }
      });

      const purchasedSeats: PurchasedSeat[] = [];

      for (const order of orders) {
        if (order.paymentIntentId?.startsWith('SIM_SEATS_')) {
          try {
            const seatDataJson = order.paymentIntentId.replace('SIM_SEATS_', '');
            const seatMetadata = JSON.parse(seatDataJson);

            for (const seatInfo of seatMetadata) {
              purchasedSeats.push({
                id: seatInfo.seatId,
                artistSlug,
                venueLayout: this.getVenueLayoutForArtist(artistSlug),
                section: seatInfo.section,
                row: seatInfo.row,
                number: seatInfo.number,
                ticketTypeId: seatInfo.ticketType,
                purchaseTimestamp: order.createdAt.getTime()
              });
            }
          } catch (parseError) {
            console.error('Error parsing seat metadata:', parseError);
          }
        }
      }

      return purchasedSeats;
    } catch (error) {
      console.error(`Error getting purchased seats for ${artistSlug}:`, error);
      return [];
    }
  }

  /**
   * Check if a specific seat is purchased for an artist
   */
  async isSeatPurchased(seatId: string, artistSlug: string): Promise<boolean> {
    const purchasedSeats = await this.getPurchasedSeatsByArtist(artistSlug);
    return purchasedSeats.some(seat => seat.id === seatId);
  }

  /**
   * Get total number of simulated purchases across all artists
   */
  async getTotalSimulatedPurchases(): Promise<number> {
    try {
      const count = await db.order.count({
        where: {
          customer: {
            email: { contains: 'simulation-' }
          },
          status: 'CONFIRMED'
        }
      });

      return count;
    } catch (error) {
      console.error('Error getting total simulated purchases:', error);
      return 0;
    }
  }

  /**
   * Reset all simulation data from the database
   */
  async resetAllSimulationData(): Promise<void> {
    try {
      // Find all simulation customers
      const simulationCustomers = await db.customer.findMany({
        where: {
          email: { contains: 'simulation-' }
        }
      });

      if (simulationCustomers.length === 0) {
        console.log(`${PersistentSimulation.SIMULATION_TAG} No simulation data to reset`);
        return;
      }

      const customerIds = simulationCustomers.map(c => c.id);

      // Get orders to calculate ticket quantities to subtract
      const orders = await db.order.findMany({
        where: {
          customerId: { in: customerIds },
          status: 'CONFIRMED'
        },
        include: {
          event: true
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
        where: {
          customerId: { in: customerIds }
        }
      });

      // Update event sold tickets by subtracting the simulation tickets
      for (const [eventId, ticketCount] of eventTicketCounts.entries()) {
        await db.event.update({
          where: { id: eventId },
          data: {
            soldTickets: {
              decrement: ticketCount
            }
          }
        });
      }

      // Delete simulation customers
      await db.customer.deleteMany({
        where: {
          id: { in: customerIds }
        }
      });

      console.log(`${PersistentSimulation.SIMULATION_TAG} Reset complete. Deleted ${deletedOrders.count} orders and ${simulationCustomers.length} customers`);

    } catch (error) {
      console.error(`${PersistentSimulation.SIMULATION_TAG} Reset failed:`, error);
      throw error;
    }
  }

  /**
   * Generate random seat purchases for simulation
   */
  generateRandomSeats(artistSlug: string, count: number): PurchasedSeat[] {
    const venueLayout = this.getVenueLayoutForArtist(artistSlug);
    const seats: PurchasedSeat[] = [];

    for (let i = 0; i < count; i++) {
      // Generate random seat in main section
      const row = Math.floor(Math.random() * 20) + 1;
      const seatNum = Math.floor(Math.random() * 24) + 1;
      const seatId = `main-${row}-${seatNum}`;

      seats.push({
        id: seatId,
        artistSlug,
        venueLayout,
        section: 'Main Section',
        row: row.toString(),
        number: seatNum,
        ticketTypeId: row <= 3 ? 'vip' : 'ga',
        purchaseTimestamp: Date.now()
      });
    }

    return seats;
  }

  /**
   * Private: Create a simulation customer
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
   * Private: Get venue layout for artist
   */
  private getVenueLayoutForArtist(artistSlug: string): string {
    const venueMap: Record<string, string> = {
      'taylor-swift': 'metlife-stadium',
      'lady-gaga': 'klcc-arena',
      'dolly-parton': 'grand-ole-opry',
      'garth-brooks': 'madison-square-garden'
    };

    return venueMap[artistSlug] || 'general-venue';
  }

  /**
   * Private: Generate realistic customer name
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
   * Private: Generate phone number
   */
  private generatePhoneNumber(): string {
    const area = Math.floor(Math.random() * 800) + 200;
    const exchange = Math.floor(Math.random() * 800) + 200;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `(${area}) ${exchange}-${number}`;
  }
}

// Export singleton instance
export const persistentSimulation = new PersistentSimulation();