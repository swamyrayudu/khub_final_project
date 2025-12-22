'use server';

import { auth } from '@/lib/userauth';
import { db, notifications, products, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

/**
 * Track when a user views a product location on the map
 * Sends a notification to the seller
 */
export async function trackLocationView(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      // Don't require login for this - just track it
      return { success: true, message: 'Location view tracked' };
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return { success: true, message: 'Location view tracked' };
    }

    // Get product info
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    const userName = user.name || 'A user';

    // Send notification to seller
    try {
      await db.insert(notifications).values({
        recipientId: product.sellerId,
        recipientType: 'seller',
        type: 'location_view',
        title: `${userName} viewed location`,
        message: `${userName} viewed the location for "${product.name}"`,
        relatedId: productId,
        relatedType: 'product',
        isRead: false,
      });
    } catch (notificationError) {
      console.error('Failed to create location view notification:', notificationError);
      // Continue anyway - notification failure shouldn't block the action
    }

    return { success: true, message: 'Location view tracked' };
  } catch (error) {
    console.error('Error tracking location view:', error);
    return { success: true, message: 'Location view tracked' };
  }
}
