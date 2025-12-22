'use server';

import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';

// Log when user views product on maps
export async function logProductViewEvent(
  userId: string,
  userName: string,
  sellerId: string,
  productName: string
) {
  try {
    if (!userId || !sellerId || !productName) {
      console.error('❌ Missing required fields:', { userId, sellerId, productName });
      return { success: false, message: 'Missing required fields' };
    }

    console.log('💾 Creating location view notification for seller...');

    // Create notification for seller
    await db.insert(notifications).values({
      recipientId: sellerId,
      recipientType: 'seller',
      type: 'location_view',
      title: `${userName} viewed location`,
      message: `${userName} viewed the location for "${productName}"`,
      relatedId: userId,
      relatedType: 'user',
      isRead: false,
      createdAt: new Date(),
    });

    console.log('✅ Location view notification created successfully');
    return { success: true, message: 'Notification sent' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error creating location view notification:', errorMessage);
    return { success: false, message: `Failed: ${errorMessage}` };
  }
}

// Log when user adds product to wishlist
export async function logWishlistEvent(
  userId: string,
  userName: string,
  sellerId: string,
  productName: string
) {
  try {
    if (!sellerId || !productName) {
      console.error('❌ Missing required fields:', { sellerId, productName });
      return { success: false, message: 'Missing required fields' };
    }

    console.log('💾 Creating wishlist notification for seller...');

    // Create notification for seller
    await db.insert(notifications).values({
      recipientId: sellerId,
      recipientType: 'seller',
      type: 'wishlist',
      title: `${userName} added to wishlist`,
      message: `${userName} added "${productName}" to their wishlist`,
      relatedId: userId,
      relatedType: 'user',
      isRead: false,
      createdAt: new Date(),
    });

    console.log('✅ Wishlist notification created successfully');
    return { success: true, message: 'Notification sent' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error creating wishlist notification:', errorMessage);
    return { success: false, message: `Failed: ${errorMessage}` };
  }
}
