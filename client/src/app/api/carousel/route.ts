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

    return NextResponse.json({
      success: true,
      items: items,
      count: items.length,
    });
  } catch (error) {
    console.error('Error fetching carousel items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch carousel items', count: 0, items: [] },
      { status: 500 }
    );
  }
}
