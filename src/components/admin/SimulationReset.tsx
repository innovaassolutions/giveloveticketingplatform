'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../../contexts/SimulationContext';

export default function SimulationReset() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { resetAllPurchases, getTotalPurchasedSeats } = useSimulation();

  const totalPurchased = getTotalPurchasedSeats();

  const handleReset = async () => {
    setIsResetting(true);

    // Add a small delay for better UX
    setTimeout(() => {
      resetAllPurchases();
      setShowConfirm(false);
      setIsResetting(false);
    }, 1000);
  };

  if (totalPurchased === 0) {
    return (
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Simulation Clean</h3>
            <p className="text-white/60 text-sm">No simulated purchases to reset</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Simulation Control</h3>
          <p className="text-white/60 text-sm">
            {totalPurchased} simulated seat{totalPurchased !== 1 ? 's' : ''} purchased across all events
          </p>
        </div>
        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
        </div>
      </div>

      {!showConfirm ? (
        <motion.button
          onClick={() => setShowConfirm(true)}
          className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl p-3 text-red-400 font-semibold transition-colors flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Simulated Purchases
        </motion.button>
      ) : (
        <div className="space-y-3">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-semibold text-sm">Confirm Reset</p>
                <p className="text-red-300/80 text-sm">
                  This will clear all {totalPurchased} simulated seat purchases across all events.
                  All seats will become available again.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={handleReset}
              disabled={isResetting}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-semibold rounded-xl p-3 transition-colors flex items-center justify-center gap-2"
              whileHover={!isResetting ? { scale: 1.02 } : {}}
              whileTap={!isResetting ? { scale: 0.98 } : {}}
            >
              {isResetting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              {isResetting ? 'Resetting...' : 'Yes, Reset All'}
            </motion.button>
            <motion.button
              onClick={() => setShowConfirm(false)}
              disabled={isResetting}
              className="flex-1 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white font-semibold rounded-xl p-3 transition-colors"
              whileHover={!isResetting ? { scale: 1.02 } : {}}
              whileTap={!isResetting ? { scale: 0.98 } : {}}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}