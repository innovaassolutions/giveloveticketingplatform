'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface ArtistPricing {
  basePrice: number;
  upliftPercentage: number;
  finalPrice: number;
  charityAmount: number;
}

interface PricingContextType {
  artistPricing: Record<string, ArtistPricing>;
  updateArtistPricing: (artistSlug: string, pricing: ArtistPricing) => void;
  getArtistPricing: (artistSlug: string) => ArtistPricing;
}

const defaultPricing: Record<string, ArtistPricing> = {
  'lady-gaga': {
    basePrice: 150,
    upliftPercentage: 5,
    finalPrice: 157.5,
    charityAmount: 7.5,
  },
  'garth-brooks': {
    basePrice: 125,
    upliftPercentage: 8,
    finalPrice: 135,
    charityAmount: 10,
  },
  'taylor-swift': {
    basePrice: 200,
    upliftPercentage: 12,
    finalPrice: 224,
    charityAmount: 24,
  },
  'dolly-parton': {
    basePrice: 110,
    upliftPercentage: 15,
    finalPrice: 126.5,
    charityAmount: 16.5,
  },
};

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const [artistPricing, setArtistPricing] = useState<Record<string, ArtistPricing>>(defaultPricing);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('artistPricing');
    if (saved) {
      try {
        setArtistPricing(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved pricing:', error);
      }
    }
  }, []);

  // Save to localStorage when pricing changes
  useEffect(() => {
    localStorage.setItem('artistPricing', JSON.stringify(artistPricing));
  }, [artistPricing]);

  const updateArtistPricing = (artistSlug: string, pricing: ArtistPricing) => {
    setArtistPricing(prev => ({
      ...prev,
      [artistSlug]: pricing,
    }));
  };

  const getArtistPricing = (artistSlug: string): ArtistPricing => {
    return artistPricing[artistSlug] || defaultPricing[artistSlug] || {
      basePrice: 100,
      upliftPercentage: 0,
      finalPrice: 100,
      charityAmount: 0,
    };
  };

  return (
    <PricingContext.Provider value={{
      artistPricing,
      updateArtistPricing,
      getArtistPricing,
    }}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
}