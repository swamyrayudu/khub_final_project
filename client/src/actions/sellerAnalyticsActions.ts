'use server';

import { db } from '@/lib/db';
import { products, messages } from '@/lib/db/schema';
import { eq, count, sql, and, gte } from 'drizzle-orm';

export async function getSellerAnalytics(sellerId: string) {
  try {
    // Get total products count
    const [totalProductsResult] = await db
      .select({ value: count() })
      .from(products)
      .where(eq(products.sellerId, sellerId));

    const totalProducts = totalProductsResult?.value || 0;

    // Get active products count
    const [activeProductsResult] = await db
      .select({ value: count() })
      .from(products)
      .where(
        and(
          eq(products.sellerId, sellerId),
          eq(products.status, 'active')
        )
      );

    const activeProducts = activeProductsResult?.value || 0;

    // Get out of stock products count
    const [outOfStockResult] = await db
      .select({ value: count() })
      .from(products)
      .where(
        and(
          eq(products.sellerId, sellerId),
          eq(products.quantity, 0)
        )
      );

    const outOfStock = outOfStockResult?.value || 0;

    // Get total inventory value
    const inventoryValueResult = await db
      .select({
        totalValue: sql<number>`CAST(SUM(CAST(${products.price} AS NUMERIC) * ${products.quantity}) AS FLOAT)`,
      })
      .from(products)
      .where(eq(products.sellerId, sellerId));

    const totalInventoryValue = inventoryValueResult[0]?.totalValue || 0;

    // Get products by category
    const productsByCategory = await db
      .select({
        category: products.category,
        count: count(),
      })
      .from(products)
      .where(eq(products.sellerId, sellerId))
      .groupBy(products.category);

    // Get recent products (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentProductsResult] = await db
      .select({ value: count() })
      .from(products)
      .where(
        and(
          eq(products.sellerId, sellerId),
          gte(products.createdAt, thirtyDaysAgo)
        )
      );

    const recentProducts = recentProductsResult?.value || 0;

    // Get unread messages count
    const [unreadMessagesResult] = await db
      .select({ value: count() })
      .from(messages)
      .where(
        and(
          eq(messages.sellerId, sellerId),
          eq(messages.senderType, 'user'),
          eq(messages.isRead, false)
        )
      );

    const unreadMessages = unreadMessagesResult?.value || 0;

    // Get price range statistics
    const priceStats = await db
      .select({
        avgPrice: sql<number>`CAST(AVG(CAST(${products.price} AS NUMERIC)) AS FLOAT)`,
        minPrice: sql<number>`CAST(MIN(CAST(${products.price} AS NUMERIC)) AS FLOAT)`,
        maxPrice: sql<number>`CAST(MAX(CAST(${products.price} AS NUMERIC)) AS FLOAT)`,
      })
      .from(products)
      .where(eq(products.sellerId, sellerId));

    return {
      success: true,
      data: {
        totalProducts,
        activeProducts,
        outOfStock,
        totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
        productsByCategory: productsByCategory.map(cat => ({
          category: cat.category || 'Uncategorized',
          count: cat.count,
        })),
        recentProducts,
        unreadMessages,
        averagePrice: Number((priceStats[0]?.avgPrice || 0).toFixed(2)),
        minPrice: Number((priceStats[0]?.minPrice || 0).toFixed(2)),
        maxPrice: Number((priceStats[0]?.maxPrice || 0).toFixed(2)),
      },
    };
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    return {
      success: false,
      data: null,
      error: 'Failed to fetch analytics data',
    };
  }
}

export async function getSellerProductTrends(sellerId: string) {
  try {
    // Get products added in the last 6 months, grouped by month
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await db
      .select({
        month: sql<string>`TO_CHAR(${products.createdAt}, 'Mon YYYY')`,
        count: count(),
      })
      .from(products)
      .where(
        and(
          eq(products.sellerId, sellerId),
          gte(products.createdAt, sixMonthsAgo)
        )
      )
      .groupBy(sql`TO_CHAR(${products.createdAt}, 'Mon YYYY')`)
      .orderBy(sql`MIN(${products.createdAt})`);

    return {
      success: true,
      data: monthlyData,
    };
  } catch (error) {
    console.error('Error fetching product trends:', error);
    return {
      success: false,
      data: [],
    };
  }
}
