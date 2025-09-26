import { NextRequest, NextResponse } from 'next/server';
import { persistentSimulation } from '../../../lib/persistentSimulation';
import { serverSimulation } from '../../../lib/serverSimulation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const artistSlug = searchParams.get('artistSlug');

    switch (action) {
      case 'state':
        // Get server-side simulation state
        const serverState = serverSimulation.getState();
        const total = await persistentSimulation.getTotalSimulatedPurchases();
        return NextResponse.json({
          success: true,
          state: {
            isRunning: serverState.isRunning,
            ticketsPerMinute: serverState.ticketsPerMinute,
            totalPurchased: total,
            lastActivity: serverState.lastPurchaseAt
          }
        });

      case 'total':
        const totalCount = await persistentSimulation.getTotalSimulatedPurchases();
        return NextResponse.json({ success: true, total: totalCount });

      case 'byArtist':
        if (!artistSlug) {
          return NextResponse.json({ success: false, error: 'artistSlug required' }, { status: 400 });
        }
        const seats = await persistentSimulation.getPurchasedSeatsByArtist(artistSlug);
        return NextResponse.json({ success: true, seats });

      case 'isPurchased':
        const seatId = searchParams.get('seatId');
        if (!seatId || !artistSlug) {
          return NextResponse.json({ success: false, error: 'seatId and artistSlug required' }, { status: 400 });
        }
        const purchased = await persistentSimulation.isSeatPurchased(seatId, artistSlug);
        return NextResponse.json({ success: true, purchased });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Simulation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, artistSlug, seats, ticketsPerMinute } = body;

    switch (action) {
      case 'start':
        if (!ticketsPerMinute) {
          return NextResponse.json({ success: false, error: 'ticketsPerMinute required' }, { status: 400 });
        }
        await serverSimulation.startSimulation(ticketsPerMinute);
        return NextResponse.json({ success: true });

      case 'stop':
        serverSimulation.stopSimulation();
        return NextResponse.json({ success: true });

      case 'purchase':
        if (!artistSlug || !seats) {
          return NextResponse.json({ success: false, error: 'artistSlug and seats required' }, { status: 400 });
        }
        await persistentSimulation.simulateSeatPurchases(artistSlug, seats);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Simulation API POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await serverSimulation.resetAllData();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Simulation reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset simulation data' },
      { status: 500 }
    );
  }
}