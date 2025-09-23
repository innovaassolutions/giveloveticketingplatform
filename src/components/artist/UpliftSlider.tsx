'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface Split {
  platform: number;
  artist: number;
  charity: number;
}

interface UpliftSliderProps {
  initialValue?: number;
  onChange?: (percentage: number, split: Split) => void;
  className?: string;
}

export default function UpliftSlider({
  initialValue = 5,
  onChange,
  className = ''
}: UpliftSliderProps) {
  const [percentage, setPercentage] = useState(initialValue);

  const calculateSplit = (upliftPercentage: number): Split => {
    const platformFee = 8; // Fixed 8% platform fee
    const charity = upliftPercentage;
    const artist = 100 - platformFee - charity;

    return {
      platform: platformFee,
      artist,
      charity
    };
  };

  const handleChange = (value: number) => {
    setPercentage(value);
    const split = calculateSplit(value);
    onChange?.(value, split);
  };

  const split = calculateSplit(percentage);

  return (
    <div className={`bg-gray-900 rounded-xl p-6 ${className}`}>
      <h3 className="text-2xl font-bold mb-6">Revenue Split Control</h3>

      {/* Charity Uplift Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-semibold">Charity Uplift Percentage</label>
          <span className="text-2xl font-bold text-brand-400">{percentage}%</span>
        </div>

        <div className="relative">
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={percentage}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #33b8aa 0%, #33b8aa ${(percentage / 25) * 100}%, #374151 ${(percentage / 25) * 100}%, #374151 100%)`
            }}
          />

          {/* Slider thumb styling */}
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #33b8aa;
              cursor: pointer;
              border: 2px solid #ffffff;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            }

            .slider::-moz-range-thumb {
              height: 20px;
              width: 20px;
              border-radius: 50%;
              background: #33b8aa;
              cursor: pointer;
              border: 2px solid #ffffff;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            }
          `}</style>

          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>0%</span>
            <span>12.5%</span>
            <span>25%</span>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-3">
          Adjust how much of ticket revenue goes to charity causes
        </p>
      </div>

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
            ℹ️ No charity uplift currently active. Move the slider to start making an impact!
          </p>
        </motion.div>
      )}
    </div>
  );
}