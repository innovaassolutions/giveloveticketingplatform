'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateDemandMultiplier, getDemandLevelColor, getDemandLevelBg, type DemandMetrics } from '@/utils/demandCalculator';

export interface Split {
  platform: number;
  artist: number;
  charity: number;
}

interface UpliftControlProps {
  initialValue?: number;
  onChange?: (percentage: number, split: Split) => void;
  className?: string;
  eventData?: any; // Event data for demand calculation
  ticketPrice?: number; // Ticket price for platform fee calculation
}

export default function UpliftControl({
  initialValue = 5,
  onChange,
  className = '',
  eventData,
  ticketPrice = 100
}: UpliftControlProps) {
  const [percentage, setPercentage] = useState(initialValue);

  const calculateSplit = (upliftPercentage: number, ticketPrice: number = 100): Split => {
    // Calculate uplift amount and total sale price
    const upliftAmount = ticketPrice * (upliftPercentage / 100);
    const totalSalePrice = ticketPrice + upliftAmount;

    // Platform fee is 2.5% + $1.69 per ticket (calculated on total sale price)
    const platformFeeAmount = (totalSalePrice * 0.025) + 1.69;

    // Revenue distribution
    const artistRevenue = ticketPrice; // Artist gets full face value
    const charityRevenue = upliftAmount;

    // Calculate percentages of total sale price
    const platformPercentage = (platformFeeAmount / totalSalePrice) * 100;
    const artistPercentage = (artistRevenue / totalSalePrice) * 100;
    const charityPercentage = (charityRevenue / totalSalePrice) * 100;

    return {
      platform: platformPercentage,
      artist: artistPercentage,
      charity: charityPercentage
    };
  };

  const handleChange = (value: number) => {
    setPercentage(value);
    const split = calculateSplit(value, ticketPrice);
    onChange?.(value, split);
  };

  const split = calculateSplit(percentage, ticketPrice);

  // Calculate demand-based suggestion if event data is available
  const demandMetrics: DemandMetrics | null = eventData
    ? calculateDemandMultiplier(eventData, percentage || 5)
    : null;

  const handleApplySuggestion = () => {
    if (demandMetrics) {
      handleChange(demandMetrics.suggestedUplift);
    }
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-6 ${className}`}>
      <h3 className="text-2xl font-bold mb-6">Revenue Split Control</h3>

      {/* Charity Uplift Input */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="charity-uplift" className="text-lg font-semibold">Charity Uplift Percentage</label>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                id="charity-uplift"
                type="number"
                min="0"
                max="200"
                step="1"
                value={percentage}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg font-semibold focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 focus:outline-none transition-colors"
                placeholder="Enter percentage"
              />
            </div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-brand-400 min-w-[60px]">{percentage}%</span>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>Common values: 5%, 12%, 25%, 50%, 100%+</span>
            <span>Max: 200%</span>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-3">
          Set the percentage of ticket revenue that goes to charity causes. Higher percentages create more impact!
        </p>
      </div>

      {/* Demand-Based Suggestion */}
      {demandMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg border ${getDemandLevelBg(demandMetrics.demandLevel)}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Current Demand:</span>
                <span className={`font-bold ${getDemandLevelColor(demandMetrics.demandLevel)}`}>
                  {demandMetrics.demandLevel}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                ({demandMetrics.sellThroughRate}% sold)
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm mb-2">
                <span className="font-semibold text-brand-400">AI Suggested Uplift:</span>{' '}
                <span className="font-bold text-xl">{demandMetrics.suggestedUplift}%</span>
              </p>
              <p className="text-xs text-gray-400">
                Based on {demandMetrics.multiplier}x demand multiplier
              </p>
            </div>
            <button
              onClick={handleApplySuggestion}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-semibold"
            >
              Apply Suggestion
            </button>
          </div>
        </motion.div>
      )}

      {/* Split Breakdown */}
      <motion.div
        key={percentage}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <motion.div
          className="flex justify-between items-center p-3 bg-gray-800 rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="font-semibold">Artist Revenue</span>
          <span className="text-primary font-bold">{split.artist.toFixed(1)}%</span>
        </motion.div>

        <motion.div
          className="flex justify-between items-center p-3 bg-gray-800 rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="font-semibold">Charity Impact</span>
          <span className="text-brand-400 font-bold">{split.charity.toFixed(1)}%</span>
        </motion.div>

        <motion.div
          className="flex justify-between items-center p-3 bg-gray-800 rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="font-semibold">Platform Fee</span>
          <span className="text-gray-400 font-bold">{split.platform.toFixed(1)}%</span>
        </motion.div>
      </motion.div>

      {/* Impact Message */}
      {percentage > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-brand-500/10 border border-brand-400/30 rounded-lg"
        >
          <p className="text-brand-300 text-sm">
            💖 With {percentage}% charity uplift, every $100 in ticket sales will donate ${percentage} to causes you support
          </p>
        </motion.div>
      )}

      {percentage === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-gray-800 border border-gray-600 rounded-lg"
        >
          <p className="text-gray-400 text-sm">
            ℹ️ No charity uplift currently active. Set a percentage to start making an impact!
          </p>
        </motion.div>
      )}
    </div>
  );
}