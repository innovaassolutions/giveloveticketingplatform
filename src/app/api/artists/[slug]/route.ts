import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const artist = await db.artist.findUnique({
      where: { slug },
      include: {
        pricing: true,
        events: true,
        _count: {
          select: {
            orders: {
              where: {
                status: 'CONFIRMED'
              }
            }
          }
        }
      }
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json(artist);
  } catch (error) {
    console.error('Error fetching artist:', error);
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { currentUplift } = body;

    if (typeof currentUplift !== 'number' || currentUplift < 0 || currentUplift > 200) {
      return NextResponse.json({ error: 'Invalid uplift percentage' }, { status: 400 });
    }

    const artist = await db.artist.findUnique({
      where: { slug },
      include: { pricing: true }
    });

    if (!artist || !artist.pricing) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const updatedPricing = await db.artistPricing.update({
      where: { id: artist.pricing.id },
      data: {
        currentUplift,
        lastUpdated: new Date()
      }
    });

    return NextResponse.json(updatedPricing);
  } catch (error) {
    console.error('Error updating artist pricing:', error);
    return NextResponse.json({ error: 'Failed to update pricing' }, { status: 500 });
  }
}