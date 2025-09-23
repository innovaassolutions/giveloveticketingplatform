'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Plus, Minus } from 'lucide-react';
import SeatMap from '@/components/seating/SeatMap';
import { useUnifiedCart } from '@/contexts/UnifiedCartContext';

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

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { addTicketToCart, getCartItemCount } = useUnifiedCart();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  // Mock event data - in real app, this would come from SurrealDB
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEventData({
        id: 'lady-gaga-kl',
        title: 'One Night in KL',
        artist: 'Lady Gaga',
        venue: 'KLCC Arena, Kuala Lumpur',
        date: '2025-12-15',
        time: '20:00',
        description: 'Experience an unforgettable night with Lady Gaga in her exclusive Kuala Lumpur concert. A spectacular show featuring her greatest hits and brand new songs.',
        image: '/api/placeholder/800/400',
        ticketTypes: [
          {
            id: 'ga',
            name: 'General Admission',
            price: 125.00,
            available: 234,
            total: 500,
            description: 'Standing room with great view of the stage'
          },
          {
            id: 'vip',
            name: 'VIP Package',
            price: 350.00,
            available: 12,
            total: 50,
            description: 'Premium seating, meet & greet, exclusive merchandise'
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, [resolvedParams.id]);

  const getTicketQuantity = (ticketTypeId: string) => {
    return ticketQuantities[ticketTypeId] || 1;
  };

  const updateTicketQuantity = (ticketTypeId: string, quantity: number) => {
    setTicketQuantities(prev => ({
      ...prev,
      [ticketTypeId]: Math.max(1, quantity)
    }));
  };

  const addToCart = (ticketTypeId: string, quantity?: number) => {
    if (!eventData) return;

    const ticketType = eventData.ticketTypes.find(t => t.id === ticketTypeId);
    if (!ticketType) return;

    const finalQuantity = quantity || getTicketQuantity(ticketTypeId);

    // Add to local cart state
    setCart(prev => {
      const existing = prev.find(item => item.ticketTypeId === ticketTypeId);
      if (existing) {
        return prev.map(item =>
          item.ticketTypeId === ticketTypeId
            ? { ...item, quantity: item.quantity + finalQuantity }
            : item
        );
      }
      return [...prev, { ticketTypeId, quantity: finalQuantity, seats: [] }];
    });

    // Add to unified cart
    addTicketToCart(
      ticketType,
      finalQuantity,
      resolvedParams.id,
      `${eventData.artist} - ${eventData.title}`,
      selectedSeats.slice(0, finalQuantity)
    );

    // Reset quantity to 1 after adding
    setTicketQuantities(prev => ({
      ...prev,
      [ticketTypeId]: 1
    }));
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
        eventId: resolvedParams.id,
        items: cart.map(item => ({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          seats: selectedSeats.slice(0, item.quantity) // Assign selected seats
        })),
        customerInfo: {
          email: 'demo@example.com',
          name: 'Demo Customer',
          phone: '+60123456789'
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
        setOrderData(result.order);
        setOrderComplete(true);
        setCart([]);
        setSelectedSeats([]);
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

  // Order Complete Screen
  if (orderComplete && orderData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-green-400 mb-2">Order Confirmed!</h1>
            <p className="text-xl text-gray-300">Your tickets have been successfully purchased</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-xl p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Order ID</h3>
                <p className="text-white font-mono">{orderData.id}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Event</h3>
                <p className="text-white">{eventData.artist} - {eventData.title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Customer</h3>
                <p className="text-white">{orderData.customerInfo.name}</p>
                <p className="text-gray-400">{orderData.customerInfo.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Total Paid</h3>
                <p className="text-2xl font-bold text-primary">${orderData.total.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Your Tickets</h2>
            <div className="space-y-4">
              {orderData.tickets.map((ticket: any, index: number) => (
                <div key={ticket.id} className="border border-gray-700 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{ticket.ticketType}</h3>
                    {ticket.seat && <p className="text-gray-400">Seat: {ticket.seat}</p>}
                    <p className="text-sm text-gray-500 font-mono">{ticket.id}</p>
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-16 bg-white rounded border-2 border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-black font-mono">QR</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm">
                📧 A confirmation email with your tickets has been sent to {orderData.customerInfo.email}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/shop"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Shop Merchandise
              </Link>
              <Link
                href="/checkout"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cart ({getCartItemCount()})
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Event Hero */}
      <section className="relative">
        <div className="h-64 bg-gradient-to-r from-primary-dark to-brand-500 flex items-center">
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

                    <div className="flex items-center gap-2 text-sm mb-3">
                      <Users className="w-4 h-4" />
                      <span className="text-gray-400">
                        {ticketType.available} of {ticketType.total} available
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-300">Qty:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateTicketQuantity(ticketType.id, getTicketQuantity(ticketType.id) - 1)}
                            className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{getTicketQuantity(ticketType.id)}</span>
                          <button
                            onClick={() => updateTicketQuantity(ticketType.id, getTicketQuantity(ticketType.id) + 1)}
                            disabled={getTicketQuantity(ticketType.id) >= ticketType.available}
                            className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(ticketType.id)}
                        disabled={ticketType.available === 0}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark
                                 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                      >
                        {ticketType.available === 0 ? 'Sold Out' : `Add ${getTicketQuantity(ticketType.id)} to Cart`}
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

            {/* Related Merchandise Section */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-brand-500/10 to-purple-600/10 border border-brand-500/20 rounded-xl p-6"
            >
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-brand-400">🛍️ Complete Your Experience</h3>
                <p className="text-gray-300 mb-4">
                  Don't miss out on exclusive event merchandise!
                  <br />
                  <span className="text-brand-400 font-medium">Shop official gear and add to your cart</span>
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-brand-400 font-semibold">✨ Event T-Shirts</div>
                    <div className="text-gray-400">From $28</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-brand-400 font-semibold">🎭 Collectibles</div>
                    <div className="text-gray-400">From $15</div>
                  </div>
                </div>

                <Link
                  href="/shop"
                  className="inline-block bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white px-8 py-3 rounded-lg transition-all font-medium shadow-lg hover:shadow-brand-500/25"
                >
                  Shop Merchandise →
                </Link>

                <p className="text-xs text-gray-400 mt-2">
                  Items will be added to your current cart for combined checkout
                </p>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}