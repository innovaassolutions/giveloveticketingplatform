import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const artists = await db.artist.findMany({
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

    return NextResponse.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
}