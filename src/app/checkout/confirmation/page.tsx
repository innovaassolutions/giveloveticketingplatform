'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Download, Receipt, Heart, ArrowLeft } from 'lucide-react';
import { CartItem } from '../../../contexts/MerchandiseContext';

interface OrderItem {
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  basePrice: number;
  finalPrice: number;
  charityAmount: number;
  seats?: string[];
}

interface OrderData {
  id: string;
  artistSlug: string;
  artistName: string;
  eventTitle: string;
  items: OrderItem[];
  merchandiseItems: CartItem[];
  totalAmount: number;
  totalCharityAmount: number;
  merchandiseTotal: number;
  customerEmail: string;
  orderDate: string;
  charityName: string;
}

function CheckoutConfirmationContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  // Artist-specific data mapping
  const artistData = {
      'lady-gaga': {
        artistName: 'Lady Gaga',
        eventTitle: 'One Night in KL',
        charityName: 'Mental Health Foundation',
        venue: 'KLCC Arena, Kuala Lumpur',
        date: '2025-12-15',
        charityImpact: {
          therapy: 50,
          support: 25,
          resources: 200
        }
      },
      'taylor-swift': {
        artistName: 'Taylor Swift',
        eventTitle: 'The Eras Tour',
        charityName: 'Education Foundation',
        venue: 'MetLife Stadium, New Jersey',
        date: '2025-10-12',
        charityImpact: {
          therapy: 75,
          support: 35,
          resources: 150
        }
      },
      'garth-brooks': {
        artistName: 'Garth Brooks',
        eventTitle: 'Friends in Low Places Tour',
        charityName: 'Rural Community Support',
        venue: 'Madison Square Garden, New York',
        date: '2025-11-20',
        charityImpact: {
          therapy: 60,
          support: 30,
          resources: 180
        }
      },
      'dolly-parton': {
        artistName: 'Dolly Parton',
        eventTitle: 'Pure & Simple Tour',
        charityName: 'Literacy Foundation',
        venue: 'Grand Ole Opry, Nashville',
        date: '2025-09-28',
        charityImpact: {
          therapy: 45,
          support: 20,
          resources: 250
        }
      }
    };

  useEffect(() => {
    // Skip if data is already loaded to prevent re-runs from clearing session storage
    if (orderData) return;

    const loadData = async () => {
      try {
        // Get order data from sessionStorage (stored during checkout)
        const storedOrderData = sessionStorage.getItem('orderData');
        if (!storedOrderData) {
          console.error('No order data found in session storage');
          setLoading(false);
          return;
        }

        const checkoutOrderData = JSON.parse(storedOrderData);
        const artistSlug = searchParams.get('artist') || checkoutOrderData.eventId;
        const currentArtist = artistData[artistSlug as keyof typeof artistData] || artistData['lady-gaga'];

        // Transform checkout API response to match OrderData interface
        const transformedOrder: OrderData = {
          id: checkoutOrderData.id,
          artistSlug: artistSlug,
          artistName: checkoutOrderData.artistName,
          eventTitle: currentArtist.eventTitle,
          items: checkoutOrderData.items.map((item: any) => ({
            ticketTypeId: item.ticketTypeId,
            ticketTypeName: item.ticketTypeName,
            quantity: item.quantity,
            basePrice: item.unitPrice,
            finalPrice: item.finalPrice,
            charityAmount: item.charityAmount / item.quantity, // API returns total, we need per-ticket
          })),
          merchandiseItems: [],
          totalAmount: checkoutOrderData.total,
          totalCharityAmount: checkoutOrderData.charityAmount,
          merchandiseTotal: 0,
          customerEmail: checkoutOrderData.customerInfo.email,
          orderDate: checkoutOrderData.createdAt,
          charityName: checkoutOrderData.charityName,
        };

        setOrderData(transformedOrder);
        setLoading(false);

        // Clear the session storage only after successfully loading the data
        // Delay slightly to ensure this effect doesn't run again immediately
        setTimeout(() => {
          sessionStorage.removeItem('orderData');
        }, 100);
      } catch (error) {
        console.error('Error loading order data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams, orderData]);

  const downloadTaxReceipt = () => {
    if (!orderData) return;

    // Create tax receipt content
    const receiptContent = `
TAX DEDUCTIBLE DONATION RECEIPT

Order ID: ${orderData.id}
Date: ${new Date(orderData.orderDate).toLocaleDateString()}

Donor Information:
Email: ${orderData.customerEmail}

Event: ${orderData.eventTitle} - ${orderData.artistName}

Donation Breakdown:
${orderData.items.map(item =>
  `${item.quantity}x ${item.ticketTypeName}: $${(item.charityAmount * item.quantity).toFixed(2)}`
).join('\n')}

Total Tax Deductible Amount: $${orderData.totalCharityAmount.toFixed(2)}

Beneficiary: ${orderData.charityName}

This receipt serves as proof of your charitable contribution.
The donation portion of your ticket purchase is tax deductible
to the extent allowed by law.

Thank you for making a difference!

Give Back Ticketing Platform
---
Generated on ${new Date().toISOString()}
    `.trim();

    // Create and download the receipt
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-receipt-${orderData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadTickets = () => {
    if (!orderData) return;

    // Create ticket content
    const ticketContent = `
DIGITAL TICKET

${orderData.eventTitle}
${orderData.artistName}

Date: December 15, 2025
Time: 8:00 PM
Venue: KLCC Arena, Kuala Lumpur

Order ID: ${orderData.id}
Customer: ${orderData.customerEmail}

Tickets:
${orderData.items.map(item => {
  let ticketInfo = `${item.quantity}x ${item.ticketTypeName} - $${item.finalPrice.toFixed(2)} each`;
  if (item.seats && item.seats.length > 0) {
    ticketInfo += `\nSeats: ${item.seats.join(', ')}`;
  }
  return ticketInfo;
}).join('\n\n')}

Total Paid: $${orderData.totalAmount.toFixed(2)}
Charity Contribution: $${orderData.totalCharityAmount.toFixed(2)}

QR Code: [QR-${orderData.id}]

Present this ticket at the venue for entry.
Thank you for supporting ${orderData.charityName}!
    `.trim();

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets-${orderData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Processing your order...</div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-white/80 text-lg">
            Thank you for your purchase and your contribution to {orderData.charityName}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Order Summary */}
          <motion.div
            className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-white/80">
                <span>Order ID:</span>
                <span className="font-mono">{orderData.id}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Date:</span>
                <span>{new Date(orderData.orderDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Email:</span>
                <span>{orderData.customerEmail}</span>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {orderData.eventTitle} - {orderData.artistName}
              </h3>

              {orderData.items.map((item, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <div className="flex justify-between text-white">
                    <span>{item.quantity}x {item.ticketTypeName}</span>
                    <span>${(item.finalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-white/60 ml-4">
                    Base: ${(item.basePrice * item.quantity).toFixed(2)} +
                    Charity: ${(item.charityAmount * item.quantity).toFixed(2)}
                  </div>
                  {item.seats && item.seats.length > 0 && (
                    <div className="text-sm text-white/60 ml-4">
                      <div className="font-medium">Seats:</div>
                      {item.seats.map((seat, seatIndex) => (
                        <div key={seatIndex} className="ml-2">{seat}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {orderData.merchandiseItems.length > 0 && (
              <div className="border-t border-white/20 pt-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Merchandise
                </h3>

                {orderData.merchandiseItems.map((item, index) => (
                  <div key={index} className="space-y-2 mb-4">
                    <div className="flex justify-between text-white">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {(item.selectedSize || item.selectedColor) && (
                      <div className="text-sm text-white/60 ml-4">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && ' • '}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-white/20 pt-4 space-y-2">
              {orderData.merchandiseItems.length > 0 && (
                <>
                  <div className="flex justify-between text-white/80">
                    <span>Tickets Subtotal:</span>
                    <span>${(orderData.totalAmount - orderData.merchandiseTotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Merchandise Subtotal:</span>
                    <span>${orderData.merchandiseTotal.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-lg font-semibold text-white">
                <span>Total Paid:</span>
                <span>${orderData.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-purple-300">
                <span>Charity Contribution:</span>
                <span>${orderData.totalCharityAmount.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Charity Impact */}
          <motion.div
            className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-white">Your Impact</h2>
            </div>

            <div className="space-y-6">
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-3xl font-bold text-purple-300 mb-2">
                  ${orderData.totalCharityAmount.toFixed(2)}
                </div>
                <div className="text-white/80">
                  Donated to {orderData.charityName}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">This contribution helps fund:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>{Math.round(orderData.totalCharityAmount / (artistData[orderData.artistSlug as keyof typeof artistData]?.charityImpact.therapy || 50))} therapy sessions</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>{Math.round(orderData.totalCharityAmount / (artistData[orderData.artistSlug as keyof typeof artistData]?.charityImpact.support || 25))} support group meetings</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>{Math.round(orderData.totalCharityAmount / (artistData[orderData.artistSlug as keyof typeof artistData]?.charityImpact.resources || 200))} mental health resources</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-white/60 text-sm">
                You're part of a community making real change in mental health support.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Download Actions */}
        <motion.div
          className="mt-8 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">Download Your Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={downloadTickets}
              className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Tickets
            </button>

            <button
              onClick={downloadTaxReceipt}
              className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-colors"
            >
              <Receipt className="w-5 h-5" />
              Download Tax Receipt
            </button>
          </div>

          <div className="mt-4 text-sm text-white/60 text-center">
            Save these documents for your records. The tax receipt can be used for tax deduction purposes.
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">What's Next?</h2>
          <div className="space-y-2 text-white/80">
            <p>• You'll receive a confirmation email shortly</p>
            <p>• Check-in opens 2 hours before the event</p>
            <p>• Bring a valid ID and your digital tickets</p>
            <p>• Follow us for event updates and exclusive content</p>
          </div>

          <div className="mt-6">
            <Link
              href={`/artist/${orderData.artistSlug}`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
            >
              View Artist Portal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutConfirmation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading confirmation...</div>
      </div>
    }>
      <CheckoutConfirmationContent />
    </Suspense>
  );
}