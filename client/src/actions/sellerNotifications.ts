'use server';

import { db } from '@/lib/db';
import { messages, users, notifications } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// Interface for customer messages
interface CustomerMessage {
  id: string;
  customerName: string;
  customerEmail: string;
  productName?: string;
  message: string;
  time: string;
  unread: boolean;
  createdAt: Date;
}

// Interface for wishlist events
interface WishlistNotification {
  id: string;
  customerName: string;
  productName: string;
  time: string;
  createdAt: Date;
}

// Interface for view events
interface ViewNotification {
  id: string;
  customerName: string;
  productName: string;
  time: string;
  createdAt: Date;
}

// Get recent customer messages for seller (only direct messages from users)
export async function getSellerNotificationMessages(sellerId: string) {
  try {
    if (!sellerId) {
      return { success: false, data: [], message: 'Seller ID required' };
    }

    const recentMessages = await db
      .select({
        id: messages.id,
        customerName: users.name,
        customerEmail: users.email,
        message: messages.message,
        createdAt: messages.createdAt,
        isRead: messages.isRead,
        senderType: messages.senderType,
      })
      .from(messages)
      .leftJoin(users, eq(messages.userId, users.id))
      .where(
        and(
          eq(messages.sellerId, sellerId),
          eq(messages.senderType, 'user')
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(20);

    const formattedMessages: CustomerMessage[] = recentMessages.map((msg) => ({
      id: msg.id || '',
      customerName: msg.customerName || 'Unknown Customer',
      customerEmail: msg.customerEmail || 'No email',
      productName: undefined,
      message: msg.message || 'No message',
      time: formatTime(msg.createdAt),
      unread: !msg.isRead,
      createdAt: msg.createdAt || new Date(),
    }));

    return { success: true, data: formattedMessages };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { success: false, data: [], message: 'Failed to fetch messages' };
  }
}

// Get wishlist events for seller
export async function getSellerWishlistEvents(sellerId: string) {
  try {
    if (!sellerId) {
      return { success: false, data: [], message: 'Seller ID required' };
    }

    const wishlistNotifications = await db
      .select({
        id: notifications.id,
        title: notifications.title,
        message: notifications.message,
        createdAt: notifications.createdAt,
        relatedId: notifications.relatedId,
      })
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientId, sellerId),
          eq(notifications.type, 'wishlist')
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    // Get user details for each notification
    const formattedEvents: WishlistNotification[] = await Promise.all(
      wishlistNotifications.map(async (notif) => {
        // Extract customer name from title or message
        const customerName = notif.title?.replace(' added to wishlist', '').trim() || 'Unknown Customer';
        
        // Extract product name from message
        const productMatch = notif.message?.match(/added "([^"]+)" to their wishlist/);
        const productName = productMatch ? productMatch[1] : 'Unknown Product';
        
        return {
          id: notif.id || '',
          customerName: customerName,
          productName: productName,
          time: formatTime(notif.createdAt),
          createdAt: notif.createdAt || new Date(),
        };
      })
    );

    return { success: true, data: formattedEvents };
  } catch (error) {
    console.error('Error fetching wishlist events:', error);
    return { success: false, data: [], message: 'Failed to fetch wishlist events' };
  }
}

// Get view events for seller
export async function getSellerViewEvents(sellerId: string) {
  try {
    if (!sellerId) {
      return { success: false, data: [], message: 'Seller ID required' };
    }

    const viewNotifications = await db
      .select({
        id: notifications.id,
        title: notifications.title,
        message: notifications.message,
        createdAt: notifications.createdAt,
        relatedId: notifications.relatedId,
      })
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientId, sellerId),
          eq(notifications.type, 'location_view')
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(20);

    // Get user details for each notification
    const formattedEvents: ViewNotification[] = viewNotifications.map((notif) => {
      // Extract customer name from title
      const customerName = notif.title?.replace(' viewed location', '').trim() || 'Unknown Customer';
      
      // Extract product name from message
      const productMatch = notif.message?.match(/viewed the location for "([^"]+)"/);
      const productName = productMatch ? productMatch[1] : 'Unknown Product';
      
      return {
        id: notif.id || '',
        customerName: customerName,
        productName: productName,
        time: formatTime(notif.createdAt),
        createdAt: notif.createdAt || new Date(),
      };
    });

    return { success: true, data: formattedEvents };
  } catch (error) {
    console.error('Error fetching view events:', error);
    return { success: false, data: [], message: 'Failed to fetch view events' };
  }
}

// Get product reviews for seller (placeholder until reviews table is implemented)
export async function getSellerProductReviews(sellerId: string) {
  try {
    if (!sellerId) {
      return { success: false, data: [], message: 'Seller ID required' };
    }

    // TODO: Implement when reviews table is created in database schema
    // For now, return empty array
    return { success: true, data: [] };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { success: false, data: [], message: 'Failed to fetch reviews' };
  }
}

// Get product view statistics (placeholder until view tracking is implemented)
export async function getSellerProductViews(sellerId: string) {
  try {
    if (!sellerId) {
      return { success: false, data: [], message: 'Seller ID required' };
    }

    // TODO: Implement when product view tracking is added to database schema
    // For now, return empty array
    return { success: true, data: [] };
  } catch (error) {
    console.error('Error fetching product views:', error);
    return { success: false, data: [], message: 'Failed to fetch product views' };
  }
}

// Helper function to format time
function formatTime(date: Date | null | undefined): string {
  if (!date) return 'Just now';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

// Get all notifications combined
export async function getAllSellerNotifications(sellerId: string) {
  try {
    const [messagesResult, reviewsResult, wishlistResult, viewsResult] = await Promise.all([
      getSellerNotificationMessages(sellerId),
      getSellerProductReviews(sellerId),
      getSellerWishlistEvents(sellerId),
      getSellerViewEvents(sellerId),
    ]);

    return {
      success: true,
      messages: messagesResult.data,
      reviews: reviewsResult.data,
      wishlist: wishlistResult.data,
      views: viewsResult.data,
    };
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    return {
      success: false,
      messages: [],
      reviews: [],
      wishlist: [],
      views: [],
      message: 'Failed to fetch notifications',
    };
  }
}
