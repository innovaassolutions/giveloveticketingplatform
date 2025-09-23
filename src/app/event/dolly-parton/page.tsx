'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Clock, Users } from 'lucide-react';
import SeatMap from '@/components/seating/SeatMap';
import { usePricing } from '../../../contexts/PricingContext';

interface EventData {
  id: string;
  title: string;
  artist: string;
  venue: string;
  date: string;
  time: string;
  description: string;
  image: string;
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    available: number;
    total: number;
    description: string;
  }[];
}

interface CartItem {
  ticketTypeId: string;
  quantity: number;
  seats: string[];
}

export default function DollyPartonEventPage() {
  const router = useRouter();
  const { getArtistPricing } = usePricing();
  const artistSlug = 'dolly-parton';
  const pricing = getArtistPricing(artistSlug);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Mock event data for Dolly Parton
  useEffect(() => {
    setTimeout(() => {
      setEventData({
        id: 'dolly-parton',
        title: 'Pure & Simple Tour',
        artist: 'Dolly Parton',
        venue: 'Grand Ole Opry, Nashville',
        date: '2025-09-25',
        time: '20:30',
        description: 'Join the legendary Dolly Parton for an intimate evening of timeless classics and heartfelt storytelling. Experience the warmth and charm of country music\'s beloved icon in this special acoustic performance.',
        image: '/DollyParton.webp',
        ticketTypes: [
          {
            id: 'ga',
            name: 'General Admission',
            price: 85.00,
            available: 267,
            total: 450,
            description: 'Traditional Grand Ole Opry seating with great acoustics'
          },
          {
            id: 'vip',
            name: 'VIP Package',
            price: 225.00,
            available: 24,
            total: 60,
            description: 'Front row seating, meet & greet, signed merchandise'
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  const addToCart = (ticketTypeId: string, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.ticketTypeId === ticketTypeId);
      if (existing) {
        return prev.map(item =>
          item.ticketTypeId === ticketTypeId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ticketTypeId, quantity, seats: [] }];
    });
  };

  const removeFromCart = (ticketTypeId: string) => {
    setCart(prev => prev.filter(item => item.ticketTypeId !== ticketTypeId));
  };

  const getCartTotal = () => {
    if (!eventData) return 0;
    return cart.reduce((total, item) => {
      const ticketType = eventData.ticketTypes.find(t => t.id === item.ticketTypeId);
      return total + (ticketType?.price || 0) * item.quantity;
    }, 0);
  };

  const getCartQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setCheckoutLoading(true);

    try {
      const checkoutData = {
        eventId: 'dolly-parton',
        items: cart.map(item => ({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          seats: selectedSeats.slice(0, item.quantity)
        })),
        customerInfo: {
          email: 'demo@example.com',
          name: 'Demo Customer',
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
        // Redirect to confirmation page with artist parameter
        router.push('/checkout/confirmation?artist=dolly-parton&event=pure-and-simple');
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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Event Not Found</h1>
          <Link href="/" className="text-primary hover:text-primary-light">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Artist Image - Top Right */}
          <div className="flex items-center gap-4">
            <img
              src="/DollyParton.webp"
              alt="Dolly Parton"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
            />
          </div>
        </div>
      </header>

      {/* Event Hero */}
      <section className="relative">
        <div className="h-64 bg-gradient-to-r from-yellow-500 to-orange-400 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-2">{eventData.artist}</h1>
              <h2 className="text-2xl md:text-3xl font-light mb-4">{eventData.title}</h2>

              <div className="flex flex-wrap gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{eventData.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(eventData.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{eventData.time}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details & Seating */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-900 rounded-xl p-6"
            >
              <h3 className="text-2xl font-bold mb-4">About This Event</h3>
              <p className="text-gray-300 leading-relaxed">{eventData.description}</p>
            </motion.section>

            {/* Interactive Seating Map */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900 rounded-xl p-6"
            >
              <h3 className="text-2xl font-bold mb-4">Select Your Seats</h3>
              <SeatMap
                rows={12}
                cols={16}
                sold={['R0C0', 'R0C1', 'R1C5', 'R2C3', 'R3C8', 'R4C12', 'R5C2', 'R6C9', 'R7C15', 'R8C6']}
                held={['R1C1', 'R2C2', 'R3C3']}
                selected={selectedSeats}
                onSeatSelect={(seatId, isSelected) => {
                  setSelectedSeats(prev =>
                    isSelected
                      ? [...prev, seatId]
                      : prev.filter(s => s !== seatId)
                  );
                }}
                className="w-full"
              />
            </motion.section>
          </div>

          {/* Right Column - Ticket Selection & Cart */}
          <div className="space-y-6">
            {/* Ticket Types */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-900 rounded-xl p-6"
            >
              <h3 className="text-2xl font-bold mb-6">Ticket Types</h3>
              <div className="space-y-4">
                {eventData.ticketTypes.map((ticketType) => (
                  <div key={ticketType.id} className="border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold">{ticketType.name}</h4>
                      <span className="text-2xl font-bold text-primary">
                        ${ticketType.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{ticketType.description}</p>

                    {/* Pricing Breakdown */}
                    <div className="bg-gray-800 rounded-lg p-3 mb-3 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400">Face Value</span>
                        <span className="text-white">${(ticketType.price / (1 + pricing.upliftPercentage / 100)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400">Charity Uplift ({pricing.upliftPercentage}%)</span>
                        <span className="text-green-400">${(ticketType.price - (ticketType.price / (1 + pricing.upliftPercentage / 100))).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Platform Fee (2.5% + $1.69)</span>
                        <span className="text-yellow-400">${(ticketType.price * 0.025 + 1.69).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold">Your Impact to Charity</span>
                          <span className="text-green-400 font-bold">${(ticketType.price - (ticketType.price / (1 + pricing.upliftPercentage / 100))).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" />
                        <span className="text-gray-400">
                          {ticketType.available} of {ticketType.total} available
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(ticketType.id)}
                        disabled={ticketType.available === 0}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark
                                 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                      >
                        {ticketType.available === 0 ? 'Sold Out' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Shopping Cart */}
            {cart.length > 0 && (
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gray-900 rounded-xl p-6"
              >
                <h3 className="text-2xl font-bold mb-6">Your Cart</h3>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => {
                    const ticketType = eventData.ticketTypes.find(t => t.id === item.ticketTypeId);
                    if (!ticketType) return null;

                    return (
                      <div key={item.ticketTypeId} className="flex justify-between items-center border-b border-gray-700 pb-4">
                        <div>
                          <h4 className="font-semibold">{ticketType.name}</h4>
                          <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${(ticketType.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.ticketTypeId)}
                            className="text-red-400 text-sm hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={getCartQuantity() === 0 || checkoutLoading}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold
                             hover:bg-primary-dark transition-colors disabled:bg-gray-600
                             disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {checkoutLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      `Proceed to Checkout (${getCartQuantity()} ticket${getCartQuantity() !== 1 ? 's' : ''})`
                    )}
                  </button>
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}