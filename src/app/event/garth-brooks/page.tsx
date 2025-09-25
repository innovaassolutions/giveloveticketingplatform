'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Clock, Plus, Minus } from 'lucide-react';
import { calculateTicketPricing } from '../../../utils/ticketPricing';
import SeatMap from '../../../components/venue/SeatMap';

interface TicketType {
  id: string;
  name: string;
  price: number;
  available: number;
  description: string;
}

interface CartItem {
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  price: number;
  seats: string[];
}

interface SelectedSeat {
  id: string;
  row: string;
  number: number;
  section: string;
  status: 'available' | 'selected' | 'unavailable';
  ticketTypeId: string;
}

export default function GarthBrooksEventPage() {
  const router = useRouter();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [showSeatMap, setShowSeatMap] = useState(false);

  const artistSlug = 'garth-brooks';

  // Event data - this could be dynamic
  const eventData = {
    title: 'Friends in Low Places Tour',
    venue: 'Madison Square Garden, New York',
    date: '2025-11-20',
    time: '8:00 PM',
    description: 'Experience Garth Brooks\' legendary country performance.',
    totalTickets: 20000,
    soldTickets: 12000
  };

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await fetch(`/api/artists/${artistSlug}`);
        if (!response.ok) throw new Error('Failed to fetch artist data');
        const data = await response.json();
        setArtist(data);
      } catch (error) {
        console.error('Error fetching artist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, []);

  const getTicketTypes = (): TicketType[] => {
    if (!artist || !artist.pricing) return [];

    const availableTickets = Math.max(0, eventData.totalTickets - eventData.soldTickets);

    return [
      {
        id: 'ga',
        name: 'General Admission',
        price: artist.pricing.basePrice,
        available: Math.max(0, Math.floor(availableTickets * 0.8)),
        description: 'Standing room access to the main floor'
      },
      {
        id: 'vip',
        name: 'VIP Package',
        price: artist.pricing.basePrice * 2.5,
        available: Math.max(0, Math.floor(availableTickets * 0.2)),
        description: 'Premium seating, meet & greet, exclusive merchandise'
      }
    ];
  };

  const addToCart = (ticketTypeId: string) => {
    const ticketType = getTicketTypes().find(t => t.id === ticketTypeId);
    if (!ticketType) return;

    const existingItem = cart.find(item => item.ticketTypeId === ticketTypeId);
    if (existingItem) {
      if (existingItem.quantity < ticketType.available) {
        setCart(cart.map(item =>
          item.ticketTypeId === ticketTypeId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, {
        ticketTypeId,
        ticketTypeName: ticketType.name,
        quantity: 1,
        price: ticketType.price,
        seats: []
      }]);
    }
  };

  const removeFromCart = (ticketTypeId: string) => {
    const existingItem = cart.find(item => item.ticketTypeId === ticketTypeId);
    if (!existingItem) return;

    if (existingItem.quantity === 1) {
      setCart(cart.filter(item => item.ticketTypeId !== ticketTypeId));
    } else {
      setCart(cart.map(item =>
        item.ticketTypeId === ticketTypeId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    if (!artist?.pricing) return 0;

    return cart.reduce((total, item) => {
      const pricing = calculateTicketPricing(item.price, artist.pricing.currentUplift);
      return total + (pricing.totalPrice * item.quantity);
    }, 0);
  };

  const handleSeatSelection = (seats: SelectedSeat[]) => {
    setSelectedSeats(seats);

    // Group seats by ticket type
    const seatsByType = seats.reduce((acc, seat) => {
      if (!acc[seat.ticketTypeId]) {
        acc[seat.ticketTypeId] = [];
      }
      acc[seat.ticketTypeId].push(`${seat.section} - Row ${seat.row}, Seat ${seat.number}`);
      return acc;
    }, {} as Record<string, string[]>);

    // Update cart with seat selections
    const newCart: CartItem[] = [];
    Object.entries(seatsByType).forEach(([ticketTypeId, seatList]) => {
      const ticketType = getTicketTypes().find(t => t.id === ticketTypeId);
      if (ticketType) {
        newCart.push({
          ticketTypeId,
          ticketTypeName: ticketType.name,
          quantity: seatList.length,
          price: ticketType.price,
          seats: seatList
        });
      }
    });

    setCart(newCart);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setCheckoutLoading(true);

    try {
      const checkoutData = {
        eventId: artistSlug,
        items: cart.map(item => ({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          seats: item.seats
        })),
        customerInfo: {
          email: 'fan@example.com',
          name: 'Test Customer',
          phone: '+1-555-123-4567'
        }
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      });

      const result = await response.json();

      if (result.success) {
        // Store order data in sessionStorage for confirmation page
        sessionStorage.setItem('orderData', JSON.stringify(result.order));

        // Redirect to confirmation page with basic params
        router.push(`/checkout/confirmation?artist=${artistSlug}&orderId=${result.order.id}`);
      } else {
        alert(`Checkout failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading event details...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Event not found</div>
      </div>
    );
  }

  const ticketTypes = getTicketTypes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden">
              <Image
                src="/GarthBrooks.jpg"
                alt="Garth Brooks"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{eventData.title}</h1>
              <p className="text-2xl text-amber-200 mb-4">{artist.name}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{eventData.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{eventData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{eventData.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Select Tickets</h2>

            <div className="space-y-4">
              {ticketTypes.map((ticketType) => {
                const cartItem = cart.find(item => item.ticketTypeId === ticketType.id);
                const pricing = calculateTicketPricing(ticketType.price, artist.pricing.currentUplift);

                return (
                  <div key={ticketType.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{ticketType.name}</h3>
                        <p className="text-white/60 text-sm">{ticketType.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          ${pricing.totalPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-white/60">
                          Base: ${pricing.faceValue.toFixed(2)} + Charity: ${pricing.charityAmount.toFixed(2)} + Platform: ${pricing.platformFee.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-white/60">{ticketType.available} available</span>

                      {cartItem ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => removeFromCart(ticketType.id)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white font-medium w-8 text-center">{cartItem.quantity}</span>
                          <button
                            onClick={() => addToCart(ticketType.id)}
                            disabled={cartItem.quantity >= ticketType.available}
                            className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-700 disabled:bg-white/10 flex items-center justify-center text-white transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(ticketType.id)}
                          disabled={ticketType.available === 0}
                          className="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-white/10 text-white rounded-lg font-medium transition-colors"
                        >
                          {ticketType.available === 0 ? 'Sold Out' : 'Add to Cart'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seat Map */}
          <SeatMap
            venueLayout="madison-square-garden"
            ticketTypes={ticketTypes}
            onSeatSelection={handleSeatSelection}
            maxSeats={8}
          />
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 sticky top-8">
            <h2 className="text-xl font-bold text-white mb-4">Cart Summary</h2>

            {cart.length === 0 ? (
              <p className="text-white/60">No tickets selected</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const pricing = calculateTicketPricing(item.price, artist.pricing.currentUplift);
                  return (
                    <div key={item.ticketTypeId} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-white">{item.quantity}x {item.ticketTypeName}</div>
                          <div className="text-white/60 text-sm">${pricing.totalPrice.toFixed(2)} each</div>
                        </div>
                        <div className="text-white font-medium">
                          ${(pricing.totalPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      {item.seats.length > 0 && (
                        <div className="text-white/60 text-xs ml-2">
                          <div className="font-medium">Selected Seats:</div>
                          {item.seats.map((seat, index) => (
                            <div key={index}>{seat}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <p className="text-white/60 text-sm mt-1">
                    Supporting {artist.charityName}
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-bold rounded-lg transition-colors"
                >
                  {checkoutLoading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}