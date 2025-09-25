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
  purchaseSeats: (seats: PurchasedSeat[]) => void;
  resetAllPurchases: () => void;
  getPurchasedSeatsByArtist: (artistSlug: string) => PurchasedSeat[];
  getTotalPurchasedSeats: () => number;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const STORAGE_KEY = 'givelove-simulation-purchases';

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [purchasedSeats, setPurchasedSeats] = useState<PurchasedSeat[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPurchasedSeats(parsed);
      }
    } catch (error) {
      console.error('Error loading simulation data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever purchasedSeats changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(purchasedSeats));
      } catch (error) {
        console.error('Error saving simulation data:', error);
      }
    }
  }, [purchasedSeats, isLoaded]);

  const isPurchased = (seatId: string, artistSlug: string): boolean => {
    return purchasedSeats.some(seat =>
      seat.id === seatId && seat.artistSlug === artistSlug
    );
  };

  const purchaseSeats = (seats: PurchasedSeat[]) => {
    setPurchasedSeats(prev => {
      // Remove any existing seats with same ID and artist to prevent duplicates
      const filtered = prev.filter(existing =>
        !seats.some(newSeat =>
          existing.id === newSeat.id && existing.artistSlug === newSeat.artistSlug
        )
      );
      return [...filtered, ...seats];
    });
  };

  const resetAllPurchases = () => {
    setPurchasedSeats([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getPurchasedSeatsByArtist = (artistSlug: string): PurchasedSeat[] => {
    return purchasedSeats.filter(seat => seat.artistSlug === artistSlug);
  };

  const getTotalPurchasedSeats = (): number => {
    return purchasedSeats.length;
  };

  const value: SimulationContextType = {
    purchasedSeats,
    isPurchased,
    purchaseSeats,
    resetAllPurchases,
    getPurchasedSeatsByArtist,
    getTotalPurchasedSeats,
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