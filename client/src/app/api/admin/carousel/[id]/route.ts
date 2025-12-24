import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { carouselItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import cloudinary from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { image, title, description, cloudinaryPublicId } = body;

    if (!image || !title) {
      return NextResponse.json(
        { success: false, error: 'Image and title are required' },
        { status: 400 }
      );
    }

    const updatedItem = await db
      .update(carouselItems)
      .set({
        image,
        title,
        description: description || '',
        cloudinaryPublicId: cloudinaryPublicId || '',
        updatedAt: new Date(),
      })
      .where(eq(carouselItems.id, id))
      .returning();

    if (!updatedItem.length) {
      return NextResponse.json(
        { success: false, error: 'Carousel item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item: updatedItem[0],
    });
  } catch (error) {
    console.error('Error updating carousel item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update carousel item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Get the item to find cloudinary public id
    const item = await db
      .select()
      .from(carouselItems)
      .where(eq(carouselItems.id, id));

    if (!item.length) {
      return NextResponse.json(
        { success: false, error: 'Carousel item not found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary if it was uploaded
    if (item[0].cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(item[0].cloudinaryPublicId);
      } catch (err) {
        console.error('Error deleting from Cloudinary:', err);
        // Continue with database deletion even if cloudinary fails
      }
    }

    // Soft delete from database (set isActive to false)
    await db
      .update(carouselItems)
      .set({ isActive: false })
      .where(eq(carouselItems.id, id));

    return NextResponse.json({
      success: true,
      message: 'Carousel item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting carousel item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete carousel item' },
      { status: 500 }
    );
  }
}
