'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../../contexts/SimulationContext';

interface Seat {
  id: string;
  row: string;
  number: number;
  section: string;
  status: 'available' | 'selected' | 'unavailable';
  ticketTypeId: string;
}

interface SeatMapProps {
  venueLayout: string;
  artistSlug: string;
  ticketTypes: Array<{
    id: string;
    name: string;
    available: number;
  }>;
  onSeatSelection: (seats: Seat[]) => void;
  maxSeats?: number;
}

// Simplified venue layout - single section with VIP front rows and GA back rows
const VENUE_LAYOUTS = {
  'madison-square-garden': {
    name: 'Madison Square Garden',
    sections: [
      { id: 'main', name: 'Main Section', rows: 20, seatsPerRow: 24, ticketTypeId: 'mixed', startRow: 1 }
    ]
  },
  'metlife-stadium': {
    name: 'MetLife Stadium',
    sections: [
      { id: 'main', name: 'Main Section', rows: 20, seatsPerRow: 28, ticketTypeId: 'mixed', startRow: 1 }
    ]
  },
  'klcc-arena': {
    name: 'KLCC Arena',
    sections: [
      { id: 'main', name: 'Main Section', rows: 15, seatsPerRow: 20, ticketTypeId: 'mixed', startRow: 1 }
    ]
  },
  'grand-ole-opry': {
    name: 'Grand Ole Opry House',
    sections: [
      { id: 'main', name: 'Main Section', rows: 18, seatsPerRow: 22, ticketTypeId: 'mixed', startRow: 1 }
    ]
  }
};

export default function SeatMap({ venueLayout, artistSlug, ticketTypes, onSeatSelection, maxSeats = 8 }: SeatMapProps) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const { isPurchased } = useSimulation();

  useEffect(() => {
    // Generate seats based on venue layout
    const layout = VENUE_LAYOUTS[venueLayout as keyof typeof VENUE_LAYOUTS];
    if (!layout) return;

    const generatedSeats: Seat[] = [];

    layout.sections.forEach(section => {
      if (section.ticketTypeId === 'mixed') {
        // For mixed sections: rows 1-3 are VIP, rest are GA
        const vipTicketType = ticketTypes.find(tt => tt.id === 'vip');
        const gaTicketType = ticketTypes.find(tt => tt.id === 'ga');

        let vipSeatsGenerated = 0;
        let gaSeatsGenerated = 0;

        for (let row = section.startRow; row < section.startRow + section.rows; row++) {
          for (let seatNum = 1; seatNum <= section.seatsPerRow; seatNum++) {
            const seatId = `${section.id}-${row}-${seatNum}`;
            const isVipRow = row <= 3;

            let status: 'available' | 'selected' | 'unavailable';
            let ticketTypeId: string;

            // Check if this specific seat was purchased globally first
            if (isPurchased(seatId, artistSlug)) {
              status = 'unavailable';
              ticketTypeId = isVipRow ? 'vip' : 'ga';
            } else if (isVipRow && vipTicketType) {
              ticketTypeId = 'vip';
              status = vipSeatsGenerated < vipTicketType.available ? 'available' : 'unavailable';
              if (status === 'available') vipSeatsGenerated++;
            } else if (gaTicketType) {
              ticketTypeId = 'ga';
              status = gaSeatsGenerated < gaTicketType.available ? 'available' : 'unavailable';
              if (status === 'available') gaSeatsGenerated++;
            } else {
              ticketTypeId = 'ga';
              status = 'unavailable';
            }

            generatedSeats.push({
              id: seatId,
              row: `${row}`,
              number: seatNum,
              section: section.name,
              status,
              ticketTypeId
            });
          }
        }
      } else {
        // Regular single ticket type sections
        const ticketType = ticketTypes.find(tt => tt.id === section.ticketTypeId);
        const availableSeats = ticketType?.available || 0;
        let seatsGenerated = 0;

        for (let row = section.startRow; row < section.startRow + section.rows; row++) {
          for (let seatNum = 1; seatNum <= section.seatsPerRow; seatNum++) {
            const seatId = `${section.id}-${row}-${seatNum}`;

            // Check if this specific seat was purchased globally first
            let status: 'available' | 'selected' | 'unavailable';
            if (isPurchased(seatId, artistSlug)) {
              status = 'unavailable';
            } else {
              status = seatsGenerated < availableSeats ? 'available' : 'unavailable';
              if (status === 'available') seatsGenerated++;
            }

            generatedSeats.push({
              id: seatId,
              row: `${row}`,
              number: seatNum,
              section: section.name,
              status,
              ticketTypeId: section.ticketTypeId
            });
          }
        }
      }
    });

    setSeats(generatedSeats);
  }, [venueLayout, ticketTypes, artistSlug, isPurchased]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'unavailable') return;

    if (seat.status === 'selected') {
      // Deselect seat
      const newSelectedSeats = selectedSeats.filter(s => s.id !== seat.id);
      setSelectedSeats(newSelectedSeats);
      setSeats(seats.map(s =>
        s.id === seat.id ? { ...s, status: 'available' } : s
      ));
      onSeatSelection(newSelectedSeats);
    } else if (selectedSeats.length < maxSeats) {
      // Select seat
      const newSelectedSeats = [...selectedSeats, { ...seat, status: 'selected' }];
      setSelectedSeats(newSelectedSeats);
      setSeats(seats.map(s =>
        s.id === seat.id ? { ...s, status: 'selected' } : s
      ));
      onSeatSelection(newSelectedSeats);
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.status === 'selected') {
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    }
    if (seat.status === 'unavailable') {
      return 'bg-gray-400 cursor-not-allowed text-gray-600';
    }
    // Available seats - color by ticket type
    if (seat.ticketTypeId === 'vip') {
      return 'bg-yellow-500 hover:bg-yellow-600 text-black font-semibold';
    }
    return 'bg-green-500 hover:bg-green-600 text-white';
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.section]) {
      acc[seat.section] = {};
    }
    if (!acc[seat.section][seat.row]) {
      acc[seat.section][seat.row] = [];
    }
    acc[seat.section][seat.row].push(seat);
    return acc;
  }, {} as Record<string, Record<string, Seat[]>>);

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Select Your Seats</h3>
        <div className="text-white/60 text-sm">
          {selectedSeats.length} of {maxSeats} seats selected
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-white/80">VIP Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-white/80">GA Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-white/80">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded"></div>
          <span className="text-white/80">Unavailable</span>
        </div>
      </div>

      {/* Stage indicator */}
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-2 rounded-full font-bold">
          STAGE
        </div>
      </div>

      {/* Seat sections */}
      <div className="space-y-8">
        {Object.entries(groupedSeats).map(([sectionName, rows]) => (
          <div key={sectionName} className="space-y-2">
            <h4 className="text-lg font-semibold text-white/90 text-center">
              {sectionName}
            </h4>

            <div className="space-y-1">
              {Object.entries(rows).map(([rowName, rowSeats]) => {
                const rowNum = parseInt(rowName);
                const isVipRow = rowNum <= 3;
                const showSectionLabel = rowNum === 1 || rowNum === 4;

                return (
                  <div key={rowName}>
                    {showSectionLabel && (
                      <div className="text-center py-2">
                        <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold ${
                          isVipRow
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                          {isVipRow ? 'VIP SECTION' : 'GENERAL ADMISSION'}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-8 text-center text-white/60 text-sm font-medium">
                        {rowName}
                      </div>
                      <div className="flex gap-1">
                        {rowSeats.map((seat) => (
                          <motion.button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            className={`w-6 h-6 rounded text-xs transition-colors ${getSeatColor(seat)}`}
                            whileHover={{ scale: seat.status !== 'unavailable' ? 1.1 : 1 }}
                            whileTap={{ scale: seat.status !== 'unavailable' ? 0.95 : 1 }}
                            disabled={seat.status === 'unavailable'}
                            title={`${seat.section} - Row ${seat.row}, Seat ${seat.number} ${seat.ticketTypeId === 'vip' ? '(VIP)' : '(GA)'}`}
                          >
                            {seat.number}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected seats summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <h4 className="text-white font-semibold mb-2">Selected Seats:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {selectedSeats.map((seat) => (
              <div key={seat.id} className="text-white/80">
                {seat.section} - Row {seat.row}, Seat {seat.number}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}