'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface SimulationContextType {
  purchasedSeats: PurchasedSeat[];
  isPurchased: (seatId: string, artistSlug: string) => boolean;
  purchaseSeats: (seats: PurchasedSeat[]) => Promise<void>;
  resetAllPurchases: () => Promise<void>;
  getPurchasedSeatsByArtist: (artistSlug: string) => PurchasedSeat[];
  getTotalPurchasedSeats: () => number;
  refreshFromDatabase: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [purchasedSeats, setPurchasedSeats] = useState<PurchasedSeat[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from database via API on mount and set up polling
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      loadPurchasedSeats();

      // Poll database every 10 seconds to keep data fresh
      const interval = setInterval(loadPurchasedSeats, 10000);

      return () => clearInterval(interval);
    }
  }, []);

  const loadPurchasedSeats = async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Get all purchased seats from database for all artists via API
      const artists = ['taylor-swift', 'lady-gaga', 'dolly-parton', 'garth-brooks'];
      const allPurchasedSeats: PurchasedSeat[] = [];

      for (const artistSlug of artists) {
        try {
          const response = await fetch(`/api/simulation?action=byArtist&artistSlug=${artistSlug}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              allPurchasedSeats.push(...result.seats);
            }
          } else {
            console.warn(`Failed to load seats for ${artistSlug}: ${response.status}`);
          }
        } catch (fetchError) {
          console.warn(`Failed to fetch seats for ${artistSlug}:`, fetchError);
        }
      }

      setPurchasedSeats(allPurchasedSeats);
    } catch (error) {
      console.error('Error loading simulation data from database:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const isPurchased = (seatId: string, artistSlug: string): boolean => {
    return purchasedSeats.some(seat =>
      seat.id === seatId && seat.artistSlug === artistSlug
    );
  };

  const purchaseSeats = async (seats: PurchasedSeat[]) => {
    if (seats.length === 0) return;

    try {
      // Group seats by artist and purchase them via API
      const seatsByArtist = seats.reduce((acc, seat) => {
        if (!acc[seat.artistSlug]) {
          acc[seat.artistSlug] = [];
        }
        acc[seat.artistSlug].push(seat);
        return acc;
      }, {} as Record<string, PurchasedSeat[]>);

      // Purchase seats for each artist via API
      for (const [artistSlug, artistSeats] of Object.entries(seatsByArtist)) {
        const response = await fetch('/api/simulation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'purchase',
            artistSlug,
            seats: artistSeats
          })
        });

        if (!response.ok) {
          console.error(`Failed to purchase seats for ${artistSlug}`);
        }
      }

      // Refresh the local state from database
      await loadPurchasedSeats();
    } catch (error) {
      console.error('Error purchasing seats:', error);
    }
  };

  const resetAllPurchases = async () => {
    try {
      const response = await fetch('/api/simulation', {
        method: 'DELETE'
      });

      if (response.ok) {
        setPurchasedSeats([]);
      } else {
        console.error('Failed to reset simulation data');
      }
    } catch (error) {
      console.error('Error resetting purchases:', error);
    }
  };

  const getPurchasedSeatsByArtist = (artistSlug: string): PurchasedSeat[] => {
    return purchasedSeats.filter(seat => seat.artistSlug === artistSlug);
  };

  const getTotalPurchasedSeats = (): number => {
    return purchasedSeats.length;
  };

  const refreshFromDatabase = () => {
    loadPurchasedSeats();
  };

  const value: SimulationContextType = {
    purchasedSeats,
    isPurchased,
    purchaseSeats,
    resetAllPurchases,
    getPurchasedSeatsByArtist,
    getTotalPurchasedSeats,
    refreshFromDatabase,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}