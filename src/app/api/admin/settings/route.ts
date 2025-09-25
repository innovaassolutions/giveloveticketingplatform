import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get or create platform settings
    let settings = await db.platformSettings.findFirst();

    if (!settings) {
      settings = await db.platformSettings.create({
        data: {
          platformFeePercentage: 2.5,
          platformFeeFixed: 1.69,
          allowCustomFees: false,
          minFeePercentage: 1.0,
          maxFeePercentage: 10.0,
          platformName: 'GiveLove',
          supportEmail: 'support@givelove.com'
        }
      });
    }

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Error fetching platform settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      platformFeePercentage,
      platformFeeFixed,
      allowCustomFees,
      minFeePercentage,
      maxFeePercentage,
      platformName,
      supportEmail
    } = body;

    // Validate input
    if (platformFeePercentage < 0 || platformFeePercentage > 50) {
      return NextResponse.json(
        { error: 'Platform fee percentage must be between 0% and 50%' },
        { status: 400 }
      );
    }

    if (platformFeeFixed < 0) {
      return NextResponse.json(
        { error: 'Fixed platform fee cannot be negative' },
        { status: 400 }
      );
    }

    if (allowCustomFees && (minFeePercentage > maxFeePercentage)) {
      return NextResponse.json(
        { error: 'Minimum fee percentage cannot be greater than maximum' },
        { status: 400 }
      );
    }

    // Get existing settings or create if none exist
    let settings = await db.platformSettings.findFirst();

    if (!settings) {
      settings = await db.platformSettings.create({
        data: {
          platformFeePercentage,
          platformFeeFixed,
          allowCustomFees,
          minFeePercentage,
          maxFeePercentage,
          platformName,
          supportEmail
        }
      });
    } else {
      settings = await db.platformSettings.update({
        where: { id: settings.id },
        data: {
          platformFeePercentage,
          platformFeeFixed,
          allowCustomFees,
          minFeePercentage,
          maxFeePercentage,
          platformName,
          supportEmail
        }
      });
    }

    return NextResponse.json({
      success: true,
      settings,
      message: 'Platform settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating platform settings:', error);
    return NextResponse.json(
      { error: 'Failed to update platform settings' },
      { status: 500 }
    );
  }
}