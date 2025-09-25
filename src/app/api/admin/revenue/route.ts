import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

interface RevenueData {
  totalRevenue: number;
  artistRevenue: number;
  charityRevenue: number;
  platformRevenue: number;
  ticketsSold: number;
  ordersCompleted: number;
}

interface ArtistRevenueData {
  artistName: string;
  slug: string;
  totalRevenue: number;
  artistRevenue: number;
  charityRevenue: number;
  platformRevenue: number;
  ticketsSold: number;
  ordersCount: number;
  upliftPercentage: number;
  charityName: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause for date filtering
    const whereClause: any = {
      status: 'CONFIRMED'
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    // Get all confirmed orders with related data
    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        artist: {
          include: {
            pricing: true
          }
        }
      }
    });

    // Calculate overall revenue metrics
    const overallRevenue: RevenueData = {
      totalRevenue: 0,
      artistRevenue: 0,
      charityRevenue: 0,
      platformRevenue: 0,
      ticketsSold: 0,
      ordersCompleted: orders.length
    };

    // Calculate artist-specific revenue data
    const artistRevenueMap = new Map<string, {
      artist: any;
      totalRevenue: number;
      artistRevenue: number;
      charityRevenue: number;
      platformRevenue: number;
      ticketsSold: number;
      ordersCount: number;
    }>();

    for (const order of orders) {
      // Add to overall totals
      overallRevenue.totalRevenue += order.totalAmount;
      overallRevenue.artistRevenue += order.basePrice * order.quantity; // Artist gets full base price
      overallRevenue.charityRevenue += order.charityAmount;
      overallRevenue.platformRevenue += order.platformFee;
      overallRevenue.ticketsSold += order.quantity;

      // Add to artist-specific data
      const artistSlug = order.artist.slug;
      if (!artistRevenueMap.has(artistSlug)) {
        artistRevenueMap.set(artistSlug, {
          artist: order.artist,
          totalRevenue: 0,
          artistRevenue: 0,
          charityRevenue: 0,
          platformRevenue: 0,
          ticketsSold: 0,
          ordersCount: 0
        });
      }

      const artistData = artistRevenueMap.get(artistSlug)!;
      artistData.totalRevenue += order.totalAmount;
      artistData.artistRevenue += order.basePrice * order.quantity;
      artistData.charityRevenue += order.charityAmount;
      artistData.platformRevenue += order.platformFee;
      artistData.ticketsSold += order.quantity;
      artistData.ordersCount++;
    }

    // Transform artist data for response
    const artistRevenue: ArtistRevenueData[] = Array.from(artistRevenueMap.entries()).map(([slug, data]) => ({
      artistName: data.artist.name,
      slug: data.artist.slug,
      totalRevenue: data.totalRevenue,
      artistRevenue: data.artistRevenue,
      charityRevenue: data.charityRevenue,
      platformRevenue: data.platformRevenue,
      ticketsSold: data.ticketsSold,
      ordersCount: data.ordersCount,
      upliftPercentage: data.artist.pricing?.currentUplift || 0,
      charityName: data.artist.charityName
    })).sort((a, b) => b.totalRevenue - a.totalRevenue); // Sort by total revenue descending

    return NextResponse.json({
      success: true,
      data: {
        overall: overallRevenue,
        byArtist: artistRevenue,
        dateRange: {
          start: startDate,
          end: endDate
        }
      }
    });

  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue analytics' },
      { status: 500 }
    );
  }
}

// Get revenue metrics by time period
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { period, artistId } = body; // period: 'daily', 'weekly', 'monthly'

    let groupBy: string;
    let dateFormat: string;

    switch (period) {
      case 'daily':
        groupBy = 'DATE(created_at)';
        dateFormat = '%Y-%m-%d';
        break;
      case 'weekly':
        groupBy = 'YEARWEEK(created_at)';
        dateFormat = '%x-W%v';
        break;
      case 'monthly':
        groupBy = 'DATE_FORMAT(created_at, "%Y-%m")';
        dateFormat = '%Y-%m';
        break;
      default:
        groupBy = 'DATE(created_at)';
        dateFormat = '%Y-%m-%d';
    }

    // This would be a complex raw SQL query for grouping by time periods
    // For now, we'll return a simplified response
    const whereClause: any = {
      status: 'CONFIRMED'
    };

    if (artistId) {
      whereClause.artistId = artistId;
    }

    const orders = await db.order.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: 30 // Last 30 records for demo
    });

    // Group by day for simplification
    const dailyRevenue = new Map<string, {
      date: string;
      totalRevenue: number;
      artistRevenue: number;
      charityRevenue: number;
      platformRevenue: number;
      ordersCount: number;
    }>();

    for (const order of orders) {
      const date = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!dailyRevenue.has(date)) {
        dailyRevenue.set(date, {
          date,
          totalRevenue: 0,
          artistRevenue: 0,
          charityRevenue: 0,
          platformRevenue: 0,
          ordersCount: 0
        });
      }

      const dayData = dailyRevenue.get(date)!;
      dayData.totalRevenue += order.totalAmount;
      dayData.artistRevenue += order.basePrice * order.quantity;
      dayData.charityRevenue += order.charityAmount;
      dayData.platformRevenue += order.platformFee;
      dayData.ordersCount++;
    }

    const timeSeriesData = Array.from(dailyRevenue.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({
      success: true,
      data: timeSeriesData,
      period,
      artistId
    });

  } catch (error) {
    console.error('Error fetching time series revenue data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time series revenue data' },
      { status: 500 }
    );
  }
}