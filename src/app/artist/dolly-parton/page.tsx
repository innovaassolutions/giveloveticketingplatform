'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AdminPasswordProtection from '../../../components/AdminPasswordProtection';

export default function DollyPartonArtistPortal() {
  const [upliftPercentage, setUpliftPercentage] = useState(15);
  const [basePrice, setBasePrice] = useState(110);
  const [totalRevenue, setTotalRevenue] = useState(89500);
  const [ticketsSold, setTicketsSold] = useState(813);

  // Calculate dynamic pricing
  const finalPrice = basePrice * (1 + upliftPercentage / 100);
  const charityAmount = finalPrice - basePrice;
  const artistRevenue = basePrice * 0.85; // 85% after platform fees
  const platformFee = basePrice * 0.15;

  // Revenue breakdown
  const totalCharityRaised = ticketsSold * charityAmount;
  const totalArtistEarnings = ticketsSold * artistRevenue;
  const totalPlatformFees = ticketsSold * platformFee;

  return (
    <AdminPasswordProtection>
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-6">
            <Image
              src="/DollyParton.webp"
              alt="Dolly Parton"
              width={120}
              height={120}
              className="rounded-2xl border-2 border-white/20 shadow-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">Dolly Parton</h1>
              <p className="text-white/70">Artist Portal - Grand Ole Opry</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Charity Uplift Control */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">Charity Uplift Settings</h2>

              {/* Charity Selection */}
              <div className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Selected Charity
                </label>
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">I</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Imagination Library</p>
                      <p className="text-white/60 text-xs">Books for children worldwide</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uplift Slider */}
              <div className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Charity Uplift: {upliftPercentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={upliftPercentage}
                  onChange={(e) => setUpliftPercentage(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <h3 className="text-white font-medium">Price Breakdown (Per Ticket)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/80">
                    <span>Base Price:</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-yellow-300">
                    <span>Charity Uplift:</span>
                    <span>+${charityAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-medium border-t border-white/20 pt-2">
                    <span>Final Price:</span>
                    <span>${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Revenue Split */}
              <div className="space-y-3">
                <h3 className="text-white font-medium">Revenue Split (Per Ticket)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-green-300">
                    <span>Artist Earnings:</span>
                    <span>${artistRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-yellow-300">
                    <span>Charity Donation:</span>
                    <span>${charityAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-blue-300">
                    <span>Platform Fee:</span>
                    <span>${platformFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
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
                <p className="text-green-400 text-sm mt-1">↗ 22% from last event</p>
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
                <p className="text-blue-400 text-sm mt-1">of 900 available</p>
              </motion.div>

              {/* Charity Raised */}
              <motion.div
                className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-white/80 text-sm font-medium mb-2">Charity Raised</h3>
                <p className="text-3xl font-bold text-yellow-300">${totalCharityRaised.toLocaleString()}</p>
                <p className="text-yellow-400 text-sm mt-1">Current uplift: {upliftPercentage}%</p>
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
                    <span className="text-yellow-300">Charity Donations</span>
                    <span className="text-white">${totalCharityRaised.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
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
              <p className="text-2xl font-bold text-yellow-300">{Math.round(totalCharityRaised / 20)}</p>
              <p className="text-white/60 text-sm">Books mailed to children</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-300">{Math.round(totalCharityRaised / 100)}</p>
              <p className="text-white/60 text-sm">Children reached monthly</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-300">{Math.round(totalCharityRaised / 500)}</p>
              <p className="text-white/60 text-sm">Libraries supported</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-300">{ticketsSold}</p>
              <p className="text-white/60 text-sm">Fans contributing</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .slider {
          background: linear-gradient(to right, #eab308 0%, #eab308 ${upliftPercentage}%, rgba(255,255,255,0.2) ${upliftPercentage}%, rgba(255,255,255,0.2) 100%);
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #eab308, #ea580c);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #eab308, #ea580c);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
      `}</style>
    </div>
    </AdminPasswordProtection>
  );
}