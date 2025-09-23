import { NextRequest, NextResponse } from 'next/server';

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

// Mock ticket types (in real app, this would come from SurrealDB)
const mockTicketTypes: Record<string, TicketType> = {
  'ga': {
    id: 'ga',
    name: 'General Admission',
    price: 125.00,
    available: 234
  },
  'vip': {
    id: 'vip',
    name: 'VIP Package',
    price: 350.00,
    available: 12
  }
};

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

    // Calculate total and validate availability
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const ticketType = mockTicketTypes[item.ticketTypeId];

      if (!ticketType) {
        return NextResponse.json(
          { error: `Invalid ticket type: ${item.ticketTypeId}` },
          { status: 400 }
        );
      }

      if (item.quantity > ticketType.available) {
        return NextResponse.json(
          { error: `Not enough tickets available for ${ticketType.name}` },
          { status: 400 }
        );
      }

      const itemTotal = ticketType.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        ticketTypeId: item.ticketTypeId,
        ticketTypeName: ticketType.name,
        quantity: item.quantity,
        unitPrice: ticketType.price,
        total: itemTotal,
        seats: item.seats
      });
    }

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

    // Mock successful payment processing
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time

    // In a real application, you would:
    // 1. Create user if not exists in SurrealDB
    // 2. Create order record in SurrealDB
    // 3. Generate tickets with QR codes in SurrealDB
    // 4. Update ticket availability in SurrealDB
    // 5. Send confirmation email

    const order = {
      id: orderId,
      eventId,
      customerInfo,
      items: orderItems,
      total,
      tickets,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      paymentMethod: 'mock_payment'
    };

    return NextResponse.json({
      success: true,
      order,
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