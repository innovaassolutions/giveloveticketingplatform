import { simulator } from './simulation';
import { db } from './db';

export class ScheduledSimulation {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Start continuous simulation for demo purposes
   */
  startContinuousSimulation(intervalMinutes: number = 10): void {
    if (this.isRunning) {
      console.log('Simulation already running');
      return;
    }

    console.log(`🎯 Starting continuous simulation (every ${intervalMinutes} minutes)`);
    this.isRunning = true;

    // Run immediate simulation
    this.runSingleRound();

    // Schedule recurring simulations
    this.intervalId = setInterval(() => {
      this.runSingleRound();
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Stop continuous simulation
   */
  stopContinuousSimulation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🛑 Simulation stopped');
  }

  /**
   * Run a single round of simulation
   */
  private async runSingleRound(): Promise<void> {
    try {
      console.log(`🎭 Running simulation round at ${new Date().toLocaleTimeString()}`);

      const artists = await db.artist.findMany({
        include: {
          events: {
            where: {
              status: 'ACTIVE'
            }
          },
          pricing: true
        }
      });

      for (const artist of artists) {
        if (artist.events.length > 0 && artist.pricing) {
          // Random simulation duration between 5-15 minutes
          const simulationMinutes = Math.floor(Math.random() * 10) + 5;

          for (const event of artist.events) {
            // Check if event still has tickets
            if (event.soldTickets < event.totalTickets) {
              await simulator.simulatePurchases(artist.id, event.id, simulationMinutes);
            }
          }
        }
      }

      // Occasionally adjust artist uplifts based on performance
      await this.adjustArtistUplifts();

      console.log(`✅ Simulation round completed`);
    } catch (error) {
      console.error('❌ Simulation round failed:', error);
    }
  }

  /**
   * Adjust artist uplifts based on recent performance
   */
  private async adjustArtistUplifts(): Promise<void> {
    // Only adjust every few rounds (about 30% chance)
    if (Math.random() > 0.3) return;

    const artists = await db.artist.findMany({
      include: {
        pricing: {
          include: {
            demandSuggestions: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 3
            }
          }
        }
      }
    });

    for (const artist of artists) {
      if (artist.pricing && artist.pricing.demandSuggestions.length > 0) {
        const latestSuggestion = artist.pricing.demandSuggestions[0];
        const currentUplift = artist.pricing.currentUplift;

        // Gradually move toward suggested uplift (conservative approach)
        const targetUplift = latestSuggestion.suggestedUplift;
        const difference = targetUplift - currentUplift;
        const adjustment = difference * 0.2; // Move 20% toward target

        const newUplift = Math.max(0, Math.min(200, currentUplift + adjustment));

        // Only update if change is meaningful (>5%)
        if (Math.abs(adjustment) > 5) {
          await db.artistPricing.update({
            where: { id: artist.pricing.id },
            data: {
              currentUplift: Math.round(newUplift * 10) / 10, // Round to 1 decimal
              lastUpdated: new Date()
            }
          });

          console.log(`🎚️  Adjusted ${artist.name} uplift: ${currentUplift.toFixed(1)}% → ${newUplift.toFixed(1)}%`);
        }
      }
    }
  }

  /**
   * Generate summary stats for dashboard
   */
  async generateDashboardStats(): Promise<any> {
    const stats = await db.$transaction([
      // Total orders
      db.order.count({
        where: { status: 'CONFIRMED' }
      }),

      // Total revenue
      db.order.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: {
          totalAmount: true,
          charityAmount: true,
          platformFee: true
        }
      }),

      // Recent orders (last hour)
      db.order.count({
        where: {
          status: 'CONFIRMED',
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000)
          }
        }
      }),

      // Artist performance
      db.artist.findMany({
        include: {
          _count: {
            select: {
              orders: {
                where: { status: 'CONFIRMED' }
              }
            }
          },
          orders: {
            where: { status: 'CONFIRMED' },
            select: {
              totalAmount: true,
              charityAmount: true
            }
          },
          pricing: true
        }
      })
    ]);

    return {
      totalOrders: stats[0],
      revenue: {
        total: stats[1]._sum.totalAmount || 0,
        charity: stats[1]._sum.charityAmount || 0,
        platform: stats[1]._sum.platformFee || 0
      },
      recentOrders: stats[2],
      artists: stats[3].map(artist => ({
        name: artist.name,
        ordersCount: artist._count.orders,
        totalRevenue: artist.orders.reduce((sum, order) => sum + order.totalAmount, 0),
        charityRevenue: artist.orders.reduce((sum, order) => sum + order.charityAmount, 0),
        currentUplift: artist.pricing?.currentUplift || 0
      }))
    };
  }
}

// Export singleton instance
export const scheduledSimulation = new ScheduledSimulation();