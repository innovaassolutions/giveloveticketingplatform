'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export type SeatStatus = 'available' | 'selected' | 'sold' | 'held';

export interface Seat {
  id: string;
  row: number;
  number: number;
  status: SeatStatus;
  price?: number;
  section?: string;
}

interface SeatMapProps {
  rows: number;
  cols: number;
  sold?: string[];
  held?: string[];
  selected?: string[];
  onSeatSelect?: (seatId: string, isSelected: boolean) => void;
  className?: string;
}

export default function SeatMap({
  rows = 10,
  cols = 20,
  sold = [],
  held = [],
  selected = [],
  onSeatSelect,
  className = ''
}: SeatMapProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const getSeatStatus = (seatId: string): SeatStatus => {
    if (sold.includes(seatId)) return 'sold';
    if (held.includes(seatId)) return 'held';
    if (selected.includes(seatId)) return 'selected';
    return 'available';
  };

  const getSeatColor = (status: SeatStatus, isHovered: boolean = false) => {
    switch (status) {
      case 'available':
        return isHovered
          ? 'bg-gray-400 border-gray-300'
          : 'bg-gray-600 border-gray-500 hover:bg-gray-500';
      case 'selected':
        return 'bg-primary border-primary-light';
      case 'sold':
        return 'bg-red-600 border-red-500 cursor-not-allowed';
      case 'held':
        return 'bg-yellow-500 border-yellow-400 cursor-not-allowed';
      default:
        return 'bg-gray-600 border-gray-500';
    }
  };

  const handleSeatClick = (seatId: string, status: SeatStatus) => {
    if (status === 'sold' || status === 'held') return;

    const isCurrentlySelected = status === 'selected';
    onSeatSelect?.(seatId, !isCurrentlySelected);
  };

  const generateSeatId = (row: number, col: number) => `R${row}C${col}`;

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      {/* Stage */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="w-full h-8 bg-gradient-to-r from-primary to-brand-400 rounded-lg mb-2
                        shadow-lg shadow-primary/25"></div>
        <p className="text-sm font-semibold text-gray-300 tracking-wider">STAGE</p>
      </motion.div>

      {/* Seating Grid */}
      <div className="flex flex-col items-center space-y-2 mb-6">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIndex * 0.05 }}
            className="flex items-center space-x-1"
          >
            {/* Row Label */}
            <div className="w-8 text-center text-sm font-semibold text-gray-400 mr-2">
              {String.fromCharCode(65 + rowIndex)}
            </div>

            {/* Seats in Row */}
            {Array.from({ length: cols }, (_, colIndex) => {
              const seatId = generateSeatId(rowIndex, colIndex);
              const status = getSeatStatus(seatId);
              const isHovered = hoveredSeat === seatId;

              return (
                <motion.button
                  key={seatId}
                  whileHover={{ scale: status !== 'sold' && status !== 'held' ? 1.1 : 1 }}
                  whileTap={{ scale: status !== 'sold' && status !== 'held' ? 0.95 : 1 }}
                  onClick={() => handleSeatClick(seatId, status)}
                  onMouseEnter={() => setHoveredSeat(seatId)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  className={`
                    w-8 h-8 rounded-md border-2 transition-all duration-200
                    flex items-center justify-center text-xs font-semibold
                    ${getSeatColor(status, isHovered)}
                    ${status === 'sold' || status === 'held' ? 'opacity-70' : ''}
                  `}
                  disabled={status === 'sold' || status === 'held'}
                  title={`Seat ${String.fromCharCode(65 + rowIndex)}${colIndex + 1} - ${status}`}
                >
                  {colIndex + 1}
                </motion.button>
              );
            })}

            {/* Row Label (Right Side) */}
            <div className="w-8 text-center text-sm font-semibold text-gray-400 ml-2">
              {String.fromCharCode(65 + rowIndex)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center space-x-6 text-sm"
      >
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-600 border-2 border-gray-500 rounded"></div>
          <span className="text-gray-300">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary border-2 border-primary-light rounded"></div>
          <span className="text-gray-300">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-600 border-2 border-red-500 rounded"></div>
          <span className="text-gray-300">Sold</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 border-2 border-yellow-400 rounded"></div>
          <span className="text-gray-300">On Hold</span>
        </div>
      </motion.div>

      {/* Selection Summary */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg text-center"
        >
          <p className="text-primary font-semibold">
            {selected.length} seat{selected.length !== 1 ? 's' : ''} selected
          </p>
          <p className="text-gray-300 text-sm mt-1">
            {selected.map(seatId => {
              const match = seatId.match(/R(\d+)C(\d+)/);
              if (match) {
                const row = String.fromCharCode(65 + parseInt(match[1]));
                const col = parseInt(match[2]) + 1;
                return `${row}${col}`;
              }
              return seatId;
            }).join(', ')}
          </p>
        </motion.div>
      )}
    </div>
  );
}