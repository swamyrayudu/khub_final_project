'use server';

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { auth } from '@/lib/userauth';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  sellerId: string;
  rating: number;
  title?: string;
  comment?: string;
  helpfulCount: number;
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
  userName?: string;
  userImage?: string;
  images?: string[];
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}

/**
 * Get all reviews for a specific product
 */
export async function getProductReviews(productId: string) {
  try {
    const reviews = await db.execute(sql`
      SELECT 
        r.*,
        u.name as user_name,
        u.image as user_image,
        COALESCE(
          (SELECT json_agg(image_url) FROM review_images WHERE review_id = r.id),
          '[]'::json
        ) as images
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ${productId}
      ORDER BY r.created_at DESC
    `);

    return {
      success: true,
      reviews: (reviews as unknown[]).map((row) => {
        const r = row as Record<string, unknown>;
        return {
          id: r.id as string,
          productId: r.product_id as string,
          userId: r.user_id as string,
          sellerId: r.seller_id as string,
          rating: r.rating as number,
          title: r.title as string | undefined,
          comment: r.comment as string | undefined,
          helpfulCount: r.helpful_count as number,
          verifiedPurchase: r.verified_purchase as boolean,
          createdAt: r.created_at as Date,
          updatedAt: r.updated_at as Date,
          userName: r.user_name as string | undefined,
          userImage: r.user_image as string | undefined,
          images: (r.images as string[]) || [],
        };
      }),
    };
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return { success: false, message: 'Failed to fetch reviews', reviews: [] };
  }
}

/**
 * Get review statistics for a product
 */
export async function getProductRatingStats(productId: string): Promise<ReviewStats | null> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM product_ratings_summary
      WHERE product_id = ${productId}
    `);

    const resultArray = result as unknown[];
    if (resultArray.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        fiveStarCount: 0,
        fourStarCount: 0,
        threeStarCount: 0,
        twoStarCount: 0,
        oneStarCount: 0,
      };
    }

    const row = resultArray[0] as Record<string, unknown>;
    return {
      totalReviews: parseInt(String(row.total_reviews)),
      averageRating: parseFloat(String(row.average_rating || 0)),
      fiveStarCount: parseInt(String(row.five_star_count)),
      fourStarCount: parseInt(String(row.four_star_count)),
      threeStarCount: parseInt(String(row.three_star_count)),
      twoStarCount: parseInt(String(row.two_star_count)),
      oneStarCount: parseInt(String(row.one_star_count)),
    };
  } catch (error) {
    console.error('Error fetching rating stats:', error);
    return null;
  }
}

/**
 * Get reviews for multiple products (for product listing pages)
 */
export async function getProductsRatings(productIds: string[]): Promise<Map<string, ReviewStats>> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM product_ratings_summary
      WHERE product_id = ANY(${productIds})
    `);

    const ratingsMap = new Map<string, ReviewStats>();
    
    (result as unknown[]).forEach((item) => {
      const row = item as Record<string, unknown>;
      ratingsMap.set(String(row.product_id), {
        totalReviews: parseInt(String(row.total_reviews)),
        averageRating: parseFloat(String(row.average_rating || 0)),
        fiveStarCount: parseInt(String(row.five_star_count)),
        fourStarCount: parseInt(String(row.four_star_count)),
        threeStarCount: parseInt(String(row.three_star_count)),
        twoStarCount: parseInt(String(row.two_star_count)),
        oneStarCount: parseInt(String(row.one_star_count)),
      });
    });

    return ratingsMap;
  } catch (error) {
    console.error('Error fetching products ratings:', error);
    return new Map();
  }
}

/**
 * Create a new review
 */
export async function createReview(data: {
  productId: string;
  sellerId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return { success: false, message: 'You must be logged in to submit a review' };
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      return { success: false, message: 'Rating must be between 1 and 5' };
    }

    // Check if user already reviewed this product
    const existingReview = await db.execute(sql`
      SELECT id FROM reviews
      WHERE product_id = ${data.productId} AND user_id = ${userId}
    `);

    const existingArray = existingReview as unknown[];
    if (existingArray.length > 0) {
      return { success: false, message: 'You have already reviewed this product' };
    }

    // Create the review
    const reviewResult = await db.execute(sql`
      INSERT INTO reviews (product_id, user_id, seller_id, rating, title, comment)
      VALUES (${data.productId}, ${userId}, ${data.sellerId}, ${data.rating}, ${data.title || null}, ${data.comment || null})
      RETURNING id
    `);

    const resultArray = reviewResult as unknown[];
    const reviewId = (resultArray[0] as Record<string, unknown>)?.id as string;

    // Insert review images if provided
    if (data.images && data.images.length > 0) {
      for (const imageUrl of data.images) {
        await db.execute(sql`
          INSERT INTO review_images (review_id, image_url)
          VALUES (${reviewId}, ${imageUrl})
        `);
      }
    }

    return { success: true, message: 'Review submitted successfully', reviewId };
  } catch (error) {
    console.error('Error creating review:', error);
    return { success: false, message: 'Failed to submit review' };
  }
}

/**
 * Update an existing review
 */
export async function updateReview(reviewId: string, data: {
  rating?: number;
  title?: string;
  comment?: string;
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return { success: false, message: 'You must be logged in to update a review' };
    }

    // Check if the review belongs to the user
    const existingReview = await db.execute(sql`
      SELECT user_id FROM reviews WHERE id = ${reviewId}
    `);

    const existingArray = existingReview as unknown[];
    if (existingArray.length === 0) {
      return { success: false, message: 'Review not found' };
    }

    const firstRow = existingArray[0] as Record<string, unknown>;
    if (firstRow?.user_id !== userId) {
      return { success: false, message: 'You can only update your own reviews' };
    }

    // Build update query dynamically
    const updates: string[] = [];

    if (data.rating !== undefined) {
      if (data.rating < 1 || data.rating > 5) {
        return { success: false, message: 'Rating must be between 1 and 5' };
      }
      updates.push(`rating = ${data.rating}`);
    }
    if (data.title !== undefined) {
      updates.push(`title = ${data.title ? `'${data.title.replace(/'/g, "''")}'` : 'NULL'}`);
    }
    if (data.comment !== undefined) {
      updates.push(`comment = ${data.comment ? `'${data.comment.replace(/'/g, "''")}'` : 'NULL'}`);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    await db.execute(sql.raw(`
      UPDATE reviews SET ${updates.join(', ')}
      WHERE id = '${reviewId}'
    `));

    return { success: true, message: 'Review updated successfully' };
  } catch (error) {
    console.error('Error updating review:', error);
    return { success: false, message: 'Failed to update review' };
  }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return { success: false, message: 'You must be logged in to delete a review' };
    }

    // Check if the review belongs to the user
    const existingReview = await db.execute(sql`
      SELECT user_id FROM reviews WHERE id = ${reviewId}
    `);

    const existingArray = existingReview as unknown[];
    if (existingArray.length === 0) {
      return { success: false, message: 'Review not found' };
    }

    const firstRow = existingArray[0] as Record<string, unknown>;
    if (firstRow?.user_id !== userId) {
      return { success: false, message: 'You can only delete your own reviews' };
    }

    await db.execute(sql`DELETE FROM reviews WHERE id = ${reviewId}`);

    return { success: true, message: 'Review deleted successfully' };
  } catch (error) {
    console.error('Error deleting review:', error);
    return { success: false, message: 'Failed to delete review' };
  }
}

/**
 * Mark a review as helpful
 */
export async function markReviewHelpful(reviewId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return { success: false, message: 'You must be logged in to mark reviews as helpful' };
    }

    // Check if already marked as helpful
    const existing = await db.execute(sql`
      SELECT id FROM review_helpful
      WHERE review_id = ${reviewId} AND user_id = ${userId}
    `);

    const existingArray = existing as unknown[];
    if (existingArray.length > 0) {
      // Remove the helpful mark (toggle)
      await db.execute(sql`
        DELETE FROM review_helpful
        WHERE review_id = ${reviewId} AND user_id = ${userId}
      `);

      await db.execute(sql`
        UPDATE reviews
        SET helpful_count = helpful_count - 1
        WHERE id = ${reviewId}
      `);

      return { success: true, message: 'Removed from helpful', isHelpful: false };
    } else {
      // Add helpful mark
      await db.execute(sql`
        INSERT INTO review_helpful (review_id, user_id)
        VALUES (${reviewId}, ${userId})
      `);

      await db.execute(sql`
        UPDATE reviews
        SET helpful_count = helpful_count + 1
        WHERE id = ${reviewId}
      `);

      return { success: true, message: 'Marked as helpful', isHelpful: true };
    }
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return { success: false, message: 'Failed to update helpful status' };
  }
}

/**
 * Check if user has reviewed a product
 */
export async function hasUserReviewedProduct(productId: string): Promise<boolean> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return false;

    const result = await db.execute(sql`
      SELECT id FROM reviews
      WHERE product_id = ${productId} AND user_id = ${userId}
    `);

    const resultArray = result as unknown[];
    return resultArray.length > 0;
  } catch (error) {
    console.error('Error checking user review:', error);
    return false;
  }
}

/**
 * Get user's review for a product
 */
export async function getUserReviewForProduct(productId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    if (!userId) {
      return { success: false, review: null };
    }

    const result = await db.execute(sql`
      SELECT 
        r.*,
        COALESCE(
          (SELECT json_agg(image_url) FROM review_images WHERE review_id = r.id),
          '[]'::json
        ) as images
      FROM reviews r
      WHERE r.product_id = ${productId} AND r.user_id = ${userId}
    `);

    const resultArray = result as unknown[];
    if (resultArray.length === 0) {
      return { success: true, review: null };
    }

    const row = resultArray[0] as Record<string, unknown>;
    return {
      success: true,
      review: {
        id: row.id as string,
        productId: row.product_id as string,
        userId: row.user_id as string,
        sellerId: row.seller_id as string,
        rating: row.rating as number,
        title: row.title as string | undefined,
        comment: row.comment as string | undefined,
        helpfulCount: row.helpful_count as number,
        verifiedPurchase: row.verified_purchase as boolean,
        createdAt: row.created_at as Date,
        updatedAt: row.updated_at as Date,
        images: (row.images as string[]) || [],
      },
    };
  } catch (error) {
    console.error('Error fetching user review:', error);
    return { success: false, review: null };
  }
}
