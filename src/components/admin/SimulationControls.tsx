'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSimulation } from '../../contexts/SimulationContext';

interface SimulationControlsProps {}

export default function SimulationControls({}: SimulationControlsProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [ticketsPerMinute, setTicketsPerMinute] = useState(5);

  const { resetAllPurchases, getTotalPurchasedSeats, purchaseSeats } = useSimulation();
  const totalPurchased = getTotalPurchasedSeats();


  // Check simulation state on mount
  useEffect(() => {
    checkSimulationState();

    // Poll for simulation state updates
    const interval = setInterval(checkSimulationState, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkSimulationState = async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const response = await fetch('/api/simulation?action=state');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setIsRunning(result.state.isRunning);
          setTicketsPerMinute(result.state.ticketsPerMinute || 5);
        }
      } else {
        console.warn('Failed to get simulation state:', response.status);
      }
    } catch (error) {
      console.error('Failed to check simulation state:', error);
    }
  };


  const startSimulation = async () => {
    if (isRunning) return;

    try {
      const response = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          ticketsPerMinute
        })
      });

      if (response.ok) {
        setIsRunning(true);
        console.log(`Started server-side simulation at ${ticketsPerMinute} tickets/min`);
      } else {
        console.error('Failed to start simulation');
      }
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  };

  const stopSimulation = async () => {
    if (!isRunning) return;

    try {
      const response = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stop'
        })
      });

      if (response.ok) {
        setIsRunning(false);
        console.log('Stopped server-side simulation');
      } else {
        console.error('Failed to stop simulation');
      }
    } catch (error) {
      console.error('Error stopping simulation:', error);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);

    // Stop simulation if running
    if (isRunning) {
      stopSimulation();
    }

    // Add a small delay for better UX
    setTimeout(async () => {
      try {
        await resetAllPurchases();
      } catch (error) {
        console.error('Reset failed:', error);
      } finally {
        setShowConfirmReset(false);
        setIsResetting(false);
      }
    }, 1000);
  };

  const getStatusColor = () => {
    if (isRunning) return 'text-green-400';
    return 'text-gray-400';
  };

  const getStatusBgColor = () => {
    if (isRunning) return 'bg-green-400/10 border-green-400/20';
    return 'bg-gray-400/10 border-gray-400/20';
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className={`p-6 rounded-xl border ${getStatusBgColor()}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${getStatusBgColor()}`}>
              <Zap className={`w-6 h-6 ${getStatusColor()}`} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Simulation Status</h3>
              <p className={`text-sm ${getStatusColor()}`}>
                {isRunning ? 'Running' : 'Stopped'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">{totalPurchased}</p>
            <p className="text-gray-400 text-sm">Simulated Purchases</p>
          </div>
        </div>

        {isRunning && (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Clock className="w-4 h-4" />
            <span>Purchasing {ticketsPerMinute} tickets per minute</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start/Stop Controls */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4">Simulation Controls</h4>

          {/* Speed Control */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2 text-sm">Tickets per Minute</label>
            <select
              value={ticketsPerMinute}
              onChange={(e) => setTicketsPerMinute(Number(e.target.value))}
              disabled={isRunning}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary disabled:opacity-50"
            >
              <option value={1}>1 per minute (Slow)</option>
              <option value={5}>5 per minute (Normal)</option>
              <option value={10}>10 per minute (Fast)</option>
              <option value={30}>30 per minute (Very Fast)</option>
            </select>
          </div>

          <div className="flex gap-3">
            {!isRunning ? (
              <motion.button
                onClick={startSimulation}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg p-3 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" />
                Start Simulation
              </motion.button>
            ) : (
              <motion.button
                onClick={stopSimulation}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg p-3 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Pause className="w-4 h-4" />
                Stop Simulation
              </motion.button>
            )}
          </div>
        </div>

        {/* Reset Controls */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4">Reset Data</h4>

          {totalPurchased === 0 ? (
            <div className="text-center py-4">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-semibold">All Clean</p>
              <p className="text-gray-400 text-sm">No simulated purchases to reset</p>
            </div>
          ) : !showConfirmReset ? (
            <div>
              <p className="text-gray-300 text-sm mb-4">
                {totalPurchased} simulated seat{totalPurchased !== 1 ? 's' : ''} purchased across all events
              </p>
              <motion.button
                onClick={() => setShowConfirmReset(true)}
                className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg p-3 text-red-400 font-semibold transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset All Purchases
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-400 font-semibold text-sm">Confirm Reset</p>
                    <p className="text-red-300/80 text-sm">
                      This will clear all {totalPurchased} simulated purchases.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={handleReset}
                  disabled={isResetting}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-semibold rounded-lg p-2 transition-colors flex items-center justify-center gap-2 text-sm"
                  whileHover={!isResetting ? { scale: 1.02 } : {}}
                  whileTap={!isResetting ? { scale: 0.98 } : {}}
                >
                  {isResetting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  {isResetting ? 'Resetting...' : 'Yes, Reset'}
                </motion.button>
                <motion.button
                  onClick={() => setShowConfirmReset(false)}
                  disabled={isResetting}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-600/50 text-white font-semibold rounded-lg p-2 transition-colors text-sm"
                  whileHover={!isResetting ? { scale: 1.02 } : {}}
                  whileTap={!isResetting ? { scale: 0.98 } : {}}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          How It Works
        </h4>
        <ul className="text-blue-300/80 text-sm space-y-1">
          <li>• Server-side simulation randomly purchases seats across all artist events</li>
          <li>• Purchased seats become unavailable on seat maps in real-time</li>
          <li>• Simulation continues running even when you navigate away from admin</li>
          <li>• Data persists in database across sessions and page reloads</li>
          <li>• Use Reset to clear all simulated data for fresh demonstrations</li>
        </ul>
      </div>
    </div>
  );
}