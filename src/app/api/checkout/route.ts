import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { calculateTicketPricing } from '../../../utils/ticketPricing';

interface CheckoutItem {
  ticketTypeId: string;
  quantity: number;
  seats: string[];
}

interface CheckoutRequest {
  eventId: string;
  items: CheckoutItem[];
  customerInfo: {
    email: string;
    name: string;
    phone?: string;
  };
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  available: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { eventId, items, customerInfo } = body;

    // Validate request
    if (!eventId || !items || items.length === 0 || !customerInfo?.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get artist data from database
    const artist = await db.artist.findUnique({
      where: { slug: eventId },
      include: {
        pricing: true,
        events: true
      }
    });

    if (!artist || !artist.pricing || !artist.events.length) {
      return NextResponse.json(
        { error: 'Artist or event not found' },
        { status: 404 }
      )
    }

    const event = artist.events[0];
    const basePrice = artist.pricing.basePrice;
    const upliftPercentage = artist.pricing.currentUplift;

    // Define ticket types with current pricing
    const ticketTypes: Record<string, TicketType> = {
      'ga': {
        id: 'ga',
        name: 'General Admission',
        price: basePrice,
        available: Math.max(0, event.totalTickets - event.soldTickets)
      },
      'vip': {
        id: 'vip',
        name: 'VIP Package',
        price: basePrice * 2.5,
        available: Math.max(0, Math.floor(event.totalTickets * 0.1) - Math.floor(event.soldTickets * 0.1))
      }
    };

    // Calculate total and validate availability
    let subtotal = 0;
    let totalCharityAmount = 0;
    let totalPlatformFees = 0;
    const orderItems = [];
    let totalTickets = 0;

    for (const item of items) {
      const ticketType = ticketTypes[item.ticketTypeId];

      if (!ticketType) {
        return NextResponse.json(
          { error: `Invalid ticket type: ${item.ticketTypeId}` },
          { status: 400 }
        );
      }

      if (item.quantity > ticketType.available) {
        return NextResponse.json(
          { error: `Not enough tickets available for ${ticketType.name}. Only ${ticketType.available} remaining.` },
          { status: 400 }
        );
      }

      // Calculate pricing with uplift for each ticket
      const ticketPricing = calculateTicketPricing(ticketType.price, upliftPercentage);
      const itemSubtotal = ticketPricing.subtotal * item.quantity;
      const itemCharityAmount = ticketPricing.charityAmount * item.quantity;
      const itemPlatformFees = ticketPricing.platformFee * item.quantity;
      const itemTotal = ticketPricing.totalPrice * item.quantity;

      subtotal += itemSubtotal;
      totalCharityAmount += itemCharityAmount;
      totalPlatformFees += itemPlatformFees;
      totalTickets += item.quantity;

      orderItems.push({
        ticketTypeId: item.ticketTypeId,
        ticketTypeName: ticketType.name,
        quantity: item.quantity,
        unitPrice: ticketType.price,
        finalPrice: ticketPricing.totalPrice,
        charityAmount: itemCharityAmount,
        platformFee: itemPlatformFees,
        total: itemTotal,
        seats: item.seats
      });
    }

    const total = orderItems.reduce((sum, item) => sum + item.total, 0);

    // Generate order ID and ticket hashes
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tickets = [];

    for (const item of orderItems) {
      for (let i = 0; i < item.quantity; i++) {
        const ticketHash = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
        tickets.push({
          id: ticketHash,
          orderId,
          ticketType: item.ticketTypeName,
          seat: item.seats[i] || null,
          qrCode: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/qr/${ticketHash}`,
          eventId
        });
      }
    }

    // Create customer if not exists
    let customer = await db.customer.findUnique({
      where: { email: customerInfo.email }
    });

    if (!customer) {
      const [firstName, ...lastNameParts] = customerInfo.name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      customer = await db.customer.create({
        data: {
          firstName,
          lastName,
          email: customerInfo.email,
          phone: customerInfo.phone || null
        }
      });
    }

    // Create order in database
    const dbOrder = await db.order.create({
      data: {
        customerId: customer.id,
        artistId: artist.id,
        eventId: event.id,
        basePrice: basePrice,
        charityUplift: upliftPercentage,
        charityAmount: totalCharityAmount,
        platformFee: totalPlatformFees,
        totalAmount: total,
        quantity: totalTickets,
        status: 'CONFIRMED'
      }
    });

    // Update event sold tickets count
    await db.event.update({
      where: { id: event.id },
      data: {
        soldTickets: {
          increment: totalTickets
        }
      }
    });

    // Simulate payment processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const orderResponse = {
      id: orderId,
      eventId,
      customerInfo,
      items: orderItems,
      total,
      subtotal,
      charityAmount: totalCharityAmount,
      platformFee: totalPlatformFees,
      tickets,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      paymentMethod: 'mock_payment',
      artistName: artist.name,
      charityName: artist.charityName
    };

    return NextResponse.json({
      success: true,
      order: orderResponse,
      message: 'Order processed successfully'
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}