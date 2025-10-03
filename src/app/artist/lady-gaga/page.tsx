'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AdminPasswordProtection from '../../../components/AdminPasswordProtection';
import UpliftControl from '../../../components/artist/UpliftControl';

interface ArtistData {
  id: string;
  name: string;
  slug: string;
  charityName: string;
  charityDescription: string;
  pricing: {
    basePrice: number;
    currentUplift: number;
    maxUplift: number;
  };
  events: Array<{
    id: string;
    name: string;
    venue: string;
    date: string;
    totalTickets: number;
    soldTickets: number;
  }>;
  _count: {
    orders: number;
  };
}

export default function LadyGagaArtistPortal() {
  const artistSlug = 'lady-gaga';
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch artist data from database
  useEffect(() => {
    fetchArtistData();
  }, []);

  const fetchArtistData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/artists/${artistSlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch artist data');
      }
      const data = await response.json();
      setArtistData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artist data');
    } finally {
      setLoading(false);
    }
  };


  // Handle uplift changes
  const handleUpliftChange = async (newUpliftPercentage: number) => {
    try {
      // Optimistically update local state first for instant UI feedback
      if (artistData) {
        setArtistData({
          ...artistData,
          pricing: {
            ...artistData.pricing,
            currentUplift: newUpliftPercentage
          }
        });
      }

      // Then sync to database in background
      const response = await fetch(`/api/artists/${artistSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUplift: newUpliftPercentage
        })
      });

      if (!response.ok) {
        // If API call fails, revert to original data
        await fetchArtistData();
      }
    } catch (error) {
      console.error('Failed to update uplift:', error);
      // Revert to original data on error
      await fetchArtistData();
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading artist data...</div>
      </div>
    );
  }

  // Show error state
  if (error || !artistData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error || 'Artist not found'}</div>
      </div>
    );
  }

  // Calculate pricing using database values
  const basePrice = artistData.pricing.basePrice;
  const upliftPercentage = artistData.pricing.currentUplift;
  const charityAmount = basePrice * (upliftPercentage / 100);
  const finalPrice = basePrice + charityAmount;
  const platformFeeAmount = (finalPrice * 0.025) + 1.69;
  const artistRevenue = basePrice;

  // Use actual event data from database
  const event = artistData.events[0];
  const ticketsSold = event ? event.soldTickets : 0;
  const totalTickets = event ? event.totalTickets : 1000;

  // Revenue breakdown using actual data
  const totalCharityRaised = ticketsSold * charityAmount;
  const totalArtistEarnings = ticketsSold * artistRevenue;
  const totalPlatformFees = ticketsSold * platformFeeAmount;
  const totalRevenue = totalCharityRaised + totalArtistEarnings + totalPlatformFees;

  // Mock event data for demand calculation (using real data where available)
  const eventData = {
    ticketTypes: [
      {
        id: 'ga',
        name: 'General Admission',
        price: basePrice,
        available: totalTickets - ticketsSold,
        total: totalTickets,
        description: 'Standing room with incredible stage views'
      }
    ],
    venue: event?.venue || 'Madison Square Garden',
    date: event?.date || '2025-08-15',
    startTime: '8:00 PM EST'
  };

  return (
    <AdminPasswordProtection>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-6">
            <Image
              src="/ladygaga.jpg"
              alt="Lady Gaga"
              width={120}
              height={120}
              className="rounded-2xl border-2 border-white/20 shadow-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">Lady Gaga</h1>
              <p className="text-white/70">Artist Portal - One Night in KL</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Charity Uplift Control */}
          <div className="lg:col-span-1">
            {/* Charity Selection */}
            <motion.div
              className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Selected Charity</h2>
              <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Mental Health Foundation</p>
                    <p className="text-white/60 text-xs">Supports mental health awareness</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* UpliftControl Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <UpliftControl
                initialValue={upliftPercentage}
                eventData={eventData}
                ticketPrice={basePrice}
                onChange={(newPercentage) => {
                  handleUpliftChange(newPercentage);
                }}
                className="bg-black/30 backdrop-blur-md border-white/10 text-white"
              />
            </motion.div>
          </div>

          {/* Statistics Dashboard */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

              {/* Total Revenue */}
              <motion.div
                className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-white/80 text-sm font-medium mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-1">↗ 12% from last event</p>
              </motion.div>

              {/* Tickets Sold */}
              <motion.div
                className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-white/80 text-sm font-medium mb-2">Tickets Sold</h3>
                <p className="text-3xl font-bold text-white">{ticketsSold}</p>
                <p className="text-blue-400 text-sm mt-1">of 1,000 available</p>
              </motion.div>

              {/* Charity Raised */}
              <motion.div
                className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-white/80 text-sm font-medium mb-2">Charity Raised</h3>
                <p className="text-3xl font-bold text-purple-300">${totalCharityRaised.toLocaleString()}</p>
                <p className="text-purple-400 text-sm mt-1">Current uplift: {upliftPercentage}%</p>
              </motion.div>
            </div>

            {/* Revenue Chart */}
            <motion.div
              className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-white font-medium mb-6">Revenue Breakdown</h3>

              {/* Visual Breakdown */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-300">Artist Earnings</span>
                    <span className="text-white">${totalArtistEarnings.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(totalArtistEarnings / (totalArtistEarnings + totalCharityRaised + totalPlatformFees)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Charity Donations</span>
                    <span className="text-white">${totalCharityRaised.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(totalCharityRaised / (totalArtistEarnings + totalCharityRaised + totalPlatformFees)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Platform Fees</span>
                    <span className="text-white">${totalPlatformFees.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(totalPlatformFees / (totalArtistEarnings + totalCharityRaised + totalPlatformFees)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Impact Metrics */}
        <motion.div
          className="mt-8 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-white font-medium mb-4">Impact Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-300">{Math.round(totalCharityRaised / 50)}</p>
              <p className="text-white/60 text-sm">Therapy sessions funded</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-300">{Math.round(totalCharityRaised / 200)}</p>
              <p className="text-white/60 text-sm">Mental health resources</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-300">{Math.round(totalCharityRaised / 25)}</p>
              <p className="text-white/60 text-sm">Support group meetings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-300">{ticketsSold}</p>
              <p className="text-white/60 text-sm">Fans contributing</p>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
    </AdminPasswordProtection>
  );
}