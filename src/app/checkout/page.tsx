'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Ticket, ShoppingBag, CreditCard, MapPin, Calendar, Clock, Trash2, Plus, Minus } from 'lucide-react';
import { useUnifiedCart } from '../../contexts/UnifiedCartContext';

interface CustomerInfo {
  email: string;
  name: string;
  phone: string;
}

export default function CheckoutPage() {
  const {
    cartItems,
    getCartTotal,
    getCartItemCount,
    getMerchandiseItems,
    getTicketItems,
    getMerchandiseTotal,
    getTicketTotal,
    getMerchandiseCount,
    getTicketCount,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useUnifiedCart();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: 'demo@example.com',
    name: 'Demo Customer',
    phone: '+60123456789'
  });

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const merchandiseItems = getMerchandiseItems();
  const ticketItems = getTicketItems();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setCheckoutLoading(true);

    try {
      const checkoutData = {
        items: cartItems,
        customerInfo,
        totals: {
          merchandise: getMerchandiseTotal(),
          tickets: getTicketTotal(),
          total: getCartTotal()
        }
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = {
        success: true,
        order: {
          id: `ORD-${Date.now()}`,
          customerInfo,
          items: cartItems,
          total: getCartTotal(),
          timestamp: new Date().toISOString()
        }
      };

      if (result.success) {
        setOrderData(result.order);
        setOrderComplete(true);
        clearCart();
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

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
            <p className="text-xl text-gray-300">Your order has been successfully processed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-xl p-6 mb-6"
          >
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Order ID</h3>
                <p className="text-white font-mono">{orderData.id}</p>
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
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Items</h3>
                <p className="text-white">{orderData.items.length} item{orderData.items.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orderData.items.filter((item: any) => item.type === 'ticket').length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" />
                  Your Tickets
                </h2>
                <div className="space-y-3">
                  {orderData.items.filter((item: any) => item.type === 'ticket').map((ticket: any) => (
                    <div key={ticket.cartItemId} className="border border-gray-700 rounded-lg p-3">
                      <h3 className="font-semibold">{ticket.ticketTypeName}</h3>
                      <p className="text-gray-400 text-sm">{ticket.eventName}</p>
                      <p className="text-gray-400 text-sm">Quantity: {ticket.quantity}</p>
                      <p className="text-sm text-primary font-bold">${(ticket.price * ticket.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {orderData.items.filter((item: any) => item.type === 'merchandise').length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-900 rounded-xl p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-500" />
                  Your Merchandise
                </h2>
                <div className="space-y-3">
                  {orderData.items.filter((item: any) => item.type === 'merchandise').map((item: any) => (
                    <div key={item.cartItemId} className="border border-gray-700 rounded-lg p-3">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.selectedSize && <p className="text-gray-400 text-sm">Size: {item.selectedSize}</p>}
                      {item.selectedColor && <p className="text-gray-400 text-sm">Color: {item.selectedColor}</p>}
                      <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      <p className="text-sm text-brand-500 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg"
          >
            <p className="text-blue-300 text-sm">
              📧 A confirmation email with your order details has been sent to {orderData.customerInfo.email}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Combined Cart</h2>
                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''} total
                  </div>
                  <div className="text-lg font-bold text-primary">
                    ${getCartTotal().toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Cart Benefits */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-blue-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">
                    Combined checkout - tickets and merchandise together!
                  </span>
                </div>
                <div className="text-sm text-blue-200 mt-1">
                  One payment, one confirmation, delivered together where possible.
                </div>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some tickets or merchandise to get started</p>
                  <div className="flex gap-4 justify-center">
                    <Link
                      href="/shop"
                      className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Shop Merchandise
                    </Link>
                    <Link
                      href="/"
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Browse Events
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Ticket Items */}
                  {ticketItems.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-primary" />
                        Event Tickets ({getTicketCount()})
                      </h3>
                      <div className="space-y-4">
                        {ticketItems.map((item) => (
                          <div key={item.cartItemId} className="border border-gray-700 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{item.ticketTypeName}</h4>
                                <p className="text-gray-400 mb-2">{item.eventName}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    KLCC Arena
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Dec 15, 2025
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    8:00 PM
                                  </span>
                                </div>
                                {item.seats.length > 0 && (
                                  <p className="text-sm text-gray-400 mt-2">
                                    Seats: {item.seats.join(', ')}
                                  </p>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-2xl font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                                <p className="text-gray-400 text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                    className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                    className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => removeFromCart(item.cartItemId)}
                                    className="w-8 h-8 bg-red-600 rounded flex items-center justify-center hover:bg-red-700 ml-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Merchandise Items */}
                  {merchandiseItems.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-brand-500" />
                        Merchandise ({getMerchandiseCount()})
                      </h3>
                      <div className="space-y-4">
                        {merchandiseItems.map((item) => (
                          <div key={item.cartItemId} className="border border-gray-700 rounded-lg p-4">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 relative flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg">{item.name}</h4>
                                <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                                {item.selectedSize && (
                                  <p className="text-sm text-gray-400">Size: {item.selectedSize}</p>
                                )}
                                {item.selectedColor && (
                                  <p className="text-sm text-gray-400">Color: {item.selectedColor}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-brand-500">${(item.price * item.quantity).toFixed(2)}</p>
                                <p className="text-gray-400 text-sm">${item.price.toFixed(2)} × {item.quantity}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                    className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                    className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center hover:bg-gray-600"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => removeFromCart(item.cartItemId)}
                                    className="w-8 h-8 bg-red-600 rounded flex items-center justify-center hover:bg-red-700 ml-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Order Summary & Checkout */}
          <div className="space-y-6">
            {cartItems.length > 0 && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-900 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                  <div className="space-y-4">
                    {ticketItems.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Tickets ({getTicketCount()})</span>
                        <span className="font-semibold">${getTicketTotal().toFixed(2)}</span>
                      </div>
                    )}

                    {merchandiseItems.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Merchandise ({getMerchandiseCount()})</span>
                        <span className="font-semibold">${getMerchandiseTotal().toFixed(2)}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center text-xl">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary">${getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-900 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Checkout
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || !customerInfo.email || !customerInfo.name}
                    className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg
                             hover:bg-primary-dark transition-colors disabled:bg-gray-600
                             disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {checkoutLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      `Complete Order • $${getCartTotal().toFixed(2)}`
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    This is a demo checkout. No real payment will be processed.
                  </p>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}