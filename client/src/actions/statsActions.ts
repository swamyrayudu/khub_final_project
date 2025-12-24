'use server';

import { db } from '@/lib/db';
import { users, sellers, products } from '@/lib/db/schema';
import { count } from 'drizzle-orm';

export async function getStats() {
  try {
    // Get total user count
    const userCountResult = await db.select({ value: count() }).from(users);
    const totalUsers = userCountResult[0]?.value || 0;

    // Get total sellers count
    const sellerCountResult = await db.select({ value: count() }).from(sellers);
    const totalSellers = sellerCountResult[0]?.value || 0;

    // Get total products count
    const productCountResult = await db.select({ value: count() }).from(products);
    const totalProducts = productCountResult[0]?.value || 0;

    return {
      users: totalUsers,
      sellers: totalSellers,
      products: totalProducts,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      users: 0,
      sellers: 0,
      products: 0,
    };
  }
}
