import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { carouselItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ensureCarouselTableExists } from '@/lib/db/carousel-init';

export async function GET() {
  try {
    // Ensure table exists before querying
    await ensureCarouselTableExists();
    
    // For public view: get only ACTIVE items sorted by order
    const items = await db
      .select()
      .from(carouselItems)
      .where(eq(carouselItems.isActive, true))
      .orderBy(carouselItems.order);

    const response = NextResponse.json({
      success: true,
      items: items,
      count: items.length,
    });

    // No caching - always serve fresh carousel data for real-time updates
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');

    return response;
  } catch (error) {
    console.error('Error fetching carousel items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch carousel items', count: 0, items: [] },
      { status: 500 }
    );
  }
}
