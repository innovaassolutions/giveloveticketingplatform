'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Clock, Users } from 'lucide-react';
import SeatMap from '@/components/seating/SeatMap';
import { useMerchandise, MerchandiseItem } from '../../../contexts/MerchandiseContext';
import { calculateTicketPricing, calculateCartTotal } from '@/utils/ticketPricing';

interface ArtistData {
  id: string;
  name: string;
  slug: string;
  charityName: string;
  charityDescription: string;
  pricing: {
    basePrice: number;
    currentUplift: number;
    maxUplift: number;
  };
  events: Array<{
    id: string;
    name: string;
    venue: string;
    date: string;
    totalTickets: number;
    soldTickets: number;
  }>;
  _count: {
    orders: number;
  };
}

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

export default function DynamicEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { addToCart: addMerchandiseToCart } = useMerchandise();
  const [artistSlug, setArtistSlug] = useState<string>('');
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [artistLoading, setArtistLoading] = useState(true);

  // Featured merchandise for upsell
  const featuredMerch: MerchandiseItem[] = [
    {
      id: 'tshirt-giveback-logo',
      name: 'GiveBack Logo T-Shirt',
      description: 'Official concert tee',
      price: 28.00,
      image: '/images/merch/tshirt-giveback-logo.jpg',
      category: 'apparel',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White']
    },
    {
      id: 'tote-bag-sustainable',
      name: 'Sustainable Canvas Tote',
      description: 'Eco-friendly concert bag',
      price: 18.00,
      image: '/images/merch/tote-bag-sustainable.jpg',
      category: 'accessories',
      colors: ['Natural', 'Black']
    }
  ];

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Resolve params and set artist slug
  useEffect(() => {
    params.then(resolvedParams => {
      setArtistSlug(resolvedParams.slug);
    });
  }, [params]);

  // Fetch artist data from database
  const fetchArtistData = async () => {
    if (!artistSlug) return;

    try {
      setArtistLoading(true);
      const response = await fetch(`/api/artists/${artistSlug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch artist data');
      }
      const data = await response.json();
      setArtistData(data);
    } catch (err) {
      console.error('Failed to load artist data:', err);
    } finally {
      setArtistLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistData();
  }, [artistSlug]);

  // Create event data using database pricing
  useEffect(() => {
    if (!artistData) return;

    const basePrice = artistData.pricing.basePrice;
    const event = artistData.events[0];
    const availableTickets = event ? event.totalTickets - event.soldTickets : 500;

    // Artist-specific event details
    const eventDetails = {
      'lady-gaga': {
        title: 'One Night in KL',
        venue: 'KLCC Arena, Kuala Lumpur',
        date: '2025-12-15',
        time: '20:00',
        description: 'Experience an unforgettable night with Lady Gaga in her exclusive Kuala Lumpur concert.',
        image: '/ladygaga.jpg'
      },
      'taylor-swift': {
        title: 'The Eras Tour',
        venue: 'MetLife Stadium, New Jersey',
        date: '2025-10-12',
        time: '19:00',
        description: 'Join Taylor Swift on her spectacular Eras Tour celebrating her entire musical journey.',
        image: '/TaylorSwift.webp'
      },
      'dolly-parton': {
        title: 'Pure & Simple Tour',
        venue: 'Grand Ole Opry, Nashville',
        date: '2025-09-28',
        time: '20:30',
        description: 'An intimate evening with the legendary Dolly Parton at the iconic Grand Ole Opry.',
        image: '/DollyParton.webp'
      },
      'garth-brooks': {
        title: 'Friends in Low Places Tour',
        venue: 'Nissan Stadium, Nashville',
        date: '2025-11-20',
        time: '19:30',
        description: 'Experience the energy of Garth Brooks in an unforgettable stadium concert.',
        image: '/GarthBrooks.jpg'
      }
    };

    const details = eventDetails[artistSlug as keyof typeof eventDetails] || eventDetails['lady-gaga'];

    setTimeout(() => {
      setEventData({
        id: artistSlug,
        title: details.title,
        artist: artistData.name,
        venue: event?.venue || details.venue,
        date: event?.date || details.date,
        time: details.time,
        description: details.description,
        image: details.image,
        ticketTypes: [
          {
            id: 'ga',
            name: 'General Admission',
            price: basePrice,
            available: availableTickets,
            total: event?.totalTickets || 500,
            description: 'Standing room with excellent view of the stage'
          },
          {
            id: 'vip',
            name: 'VIP Package',
            price: basePrice * 2.5,
            available: Math.floor(availableTickets * 0.1),
            total: Math.floor((event?.totalTickets || 500) * 0.1),
            description: 'Premium seating, meet & greet, exclusive merchandise'
          }
        ]
      });
      setLoading(false);
    }, 500);
  }, [artistData, artistSlug]);

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
    if (!eventData || !artistData) return 0;
    return calculateCartTotal(cart, eventData.ticketTypes, artistData.pricing.currentUplift);
  };

  const getCartQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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

  if (loading || artistLoading || !artistData) {
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

  const artistImages = {
    'lady-gaga': '/ladygaga.jpg',
    'taylor-swift': '/TaylorSwift.webp',
    'dolly-parton': '/DollyParton.webp',
    'garth-brooks': '/GarthBrooks.jpg'
  };

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
              src={artistImages[artistSlug as keyof typeof artistImages] || '/ladygaga.jpg'}
              alt={artistData.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
            />
          </div>
        </div>
      </header>

      {/* Event Hero */}
      <section className="relative">
        <div className="h-64 bg-gradient-to-r from-purple-700 to-pink-600 flex items-center">
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
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">
                          ${calculateTicketPricing(ticketType.price, artistData?.pricing.currentUplift || 0).totalPrice.toFixed(2)}
                        </span>
                        <div className="text-xs text-gray-400">
                          Face: ${ticketType.price} + {artistData?.pricing.currentUplift || 0}% uplift + fees
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{ticketType.description}</p>

                    {/* Pricing Breakdown */}
                    <div className="bg-gray-800 rounded-lg p-3 mb-3 text-sm">
                      {(() => {
                        const breakdown = calculateTicketPricing(ticketType.price, artistData?.pricing.currentUplift || 0);

                        return (
                          <>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-400">Face Value</span>
                              <span className="text-white">${breakdown.faceValue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-400">Charity Uplift ({artistData?.pricing.currentUplift || 0}%)</span>
                              <span className="text-green-400">${breakdown.charityAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-gray-400">Subtotal</span>
                              <span className="text-white">${breakdown.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-400">Platform Fee (2.5% + $1.69)</span>
                              <span className="text-yellow-400">${breakdown.platformFee.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-600 pt-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-white font-semibold">Total Price</span>
                                <span className="text-primary font-bold">${breakdown.totalPrice.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-green-300 font-semibold">Your Impact to Charity</span>
                                <span className="text-green-400 font-bold">${breakdown.charityAmount.toFixed(2)}</span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
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
                          <p className="font-bold">${(() => {
                            const breakdown = calculateTicketPricing(ticketType.price, artistData?.pricing.currentUplift || 0);
                            return (breakdown.totalPrice * item.quantity).toFixed(2);
                          })()}</p>
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