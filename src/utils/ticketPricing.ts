/**
 * Utility functions for ticket pricing calculations across the platform
 * Centralizes the uplift and platform fee logic used in both artist portals and event pages
 */

export interface PricingBreakdown {
  faceValue: number;
  charityAmount: number;
  subtotal: number;
  platformFee: number;
  totalPrice: number;
}

export interface TicketType {
  id: string;
  name: string;
  price: number; // This is the face value
  available: number;
  total: number;
  description: string;
}

export interface ArtistPricing {
  basePrice: number;
  upliftPercentage: number;
  finalPrice: number;
  charityAmount: number;
}

/**
 * Calculate the complete pricing breakdown for a ticket
 * @param faceValue - The face value of the ticket (what artist gets)
 * @param upliftPercentage - The charity uplift percentage
 * @returns Complete pricing breakdown
 */
export function calculateTicketPricing(
  faceValue: number,
  upliftPercentage: number
): PricingBreakdown {
  // Calculate charity uplift amount
  const charityAmount = faceValue * (upliftPercentage / 100);

  // Calculate subtotal (face value + charity)
  const subtotal = faceValue + charityAmount;

  // Platform fee is 2.5% + $1.69 per ticket (calculated on subtotal)
  const platformFee = (subtotal * 0.025) + 1.69;

  // Total price customer pays
  const totalPrice = subtotal + platformFee;

  return {
    faceValue,
    charityAmount,
    subtotal,
    platformFee,
    totalPrice
  };
}

/**
 * Calculate total cart value with proper pricing
 * @param cart - Array of cart items
 * @param ticketTypes - Array of available ticket types
 * @param upliftPercentage - The charity uplift percentage
 * @returns Total cart value
 */
export function calculateCartTotal(
  cart: { ticketTypeId: string; quantity: number }[],
  ticketTypes: TicketType[],
  upliftPercentage: number
): number {
  return cart.reduce((total, item) => {
    const ticketType = ticketTypes.find(t => t.id === item.ticketTypeId);
    if (!ticketType) return total;

    const pricing = calculateTicketPricing(ticketType.price, upliftPercentage);
    return total + (pricing.totalPrice * item.quantity);
  }, 0);
}

/**
 * Calculate the total charity impact from a cart
 * @param cart - Array of cart items
 * @param ticketTypes - Array of available ticket types
 * @param upliftPercentage - The charity uplift percentage
 * @returns Total charity amount
 */
export function calculateCharityImpact(
  cart: { ticketTypeId: string; quantity: number }[],
  ticketTypes: TicketType[],
  upliftPercentage: number
): number {
  return cart.reduce((total, item) => {
    const ticketType = ticketTypes.find(t => t.id === item.ticketTypeId);
    if (!ticketType) return total;

    const pricing = calculateTicketPricing(ticketType.price, upliftPercentage);
    return total + (pricing.charityAmount * item.quantity);
  }, 0);
}