import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { carouselItems } from '@/lib/db/schema';
import { ensureCarouselTableExists } from '@/lib/db/carousel-init';

export async function GET() {
  try {
    // Ensure table exists before querying
    await ensureCarouselTableExists();
    
    // For admin view: get ALL items (including inactive ones) sorted by order
    const items = await db
      .select()
      .from(carouselItems)
      .orderBy(carouselItems.order);

    return NextResponse.json({
      success: true,
      items: items,
      count: items.length,
      total: items.length,
    });
  } catch (error) {
    console.error('Error fetching carousel items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch carousel items', count: 0, items: [], total: 0 },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, title, description, cloudinaryPublicId } = body;

    if (!image || !title) {
      return NextResponse.json(
        { success: false, error: 'Image and title are required' },
        { status: 400 }
      );
    }

    const maxOrder = await db
      .select({ max: carouselItems.order })
      .from(carouselItems);

    const newOrder =
      (maxOrder[0]?.max ?? 0) + 1;

    const newItem = await db
      .insert(carouselItems)
      .values({
        image,
        title,
        description: description || '',
        order: newOrder,
        cloudinaryPublicId: cloudinaryPublicId || '',
      })
      .returning();

    return NextResponse.json({
      success: true,
      item: newItem[0],
    });
  } catch (error) {
    console.error('Error creating carousel item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create carousel item' },
      { status: 500 }
    );
  }
}
