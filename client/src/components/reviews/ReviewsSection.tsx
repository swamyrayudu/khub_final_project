'use client';

import React, { useEffect, useState } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ReviewItem } from './ReviewItem';
import { ReviewForm } from './ReviewForm';
import { StarRating } from './StarRating';
import { 
  getProductReviews, 
  getProductRatingStats, 
  getUserReviewForProduct,
  Review,
  ReviewStats 
} from '@/actions/reviewActions';
import { useSession } from 'next-auth/react';

interface ReviewsSectionProps {
  productId: string;
  sellerId: string;
  productName: string;
}

export function ReviewsSection({ productId, sellerId, productName }: ReviewsSectionProps) {
  const { status } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const [reviewsResult, statsResult, userReviewResult] = await Promise.all([
        getProductReviews(productId),
        getProductRatingStats(productId),
        status === 'authenticated' ? getUserReviewForProduct(productId) : Promise.resolve({ success: true, review: null }),
      ]);

      if (reviewsResult.success) {
        setReviews(reviewsResult.reviews || []);
      }
      
      if (statsResult) {
        setStats(statsResult);
      }

      if (userReviewResult.success && userReviewResult.review) {
        setUserReview(userReviewResult.review);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, status]);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);

  const getRatingPercentage = (count: number) => {
    if (!stats || stats.totalReviews === 0) return 0;
    return Math.round((count / stats.totalReviews) * 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl mb-2">Customer Reviews</CardTitle>
            {stats && stats.totalReviews > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">out of 5</span>
                </div>
                <StarRating rating={stats.averageRating} size="lg" />
                <span className="text-sm text-muted-foreground">
                  {stats.totalReviews.toLocaleString()} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            )}
          </div>
          
          {/* Write Review Button */}
          {status === 'authenticated' && !userReview && (
            <ReviewForm
              productId={productId}
              sellerId={sellerId}
              productName={productName}
              onReviewSubmitted={fetchReviews}
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rating Breakdown */}
        {stats && stats.totalReviews > 0 && (
          <div className="space-y-2 border-b pb-6">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = 
                rating === 5 ? stats.fiveStarCount :
                rating === 4 ? stats.fourStarCount :
                rating === 3 ? stats.threeStarCount :
                rating === 2 ? stats.twoStarCount :
                stats.oneStarCount;
              const percentage = getRatingPercentage(count);

              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-12">{rating} star</span>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* User's Review (if exists) */}
        {userReview && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <p className="text-sm font-medium mb-3">Your Review</p>
            <ReviewItem
              review={userReview}
              isOwnReview={true}
              onReviewUpdated={fetchReviews}
            />
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground mb-4">No reviews yet</p>
            {status === 'authenticated' && !userReview && (
              <ReviewForm
                productId={productId}
                sellerId={sellerId}
                productName={productName}
                onReviewSubmitted={fetchReviews}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                isOwnReview={userReview?.id === review.id}
                onReviewUpdated={fetchReviews}
              />
            ))}

            {/* Show More Button */}
            {reviews.length > 5 && !showAll && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAll(true)}
              >
                Show All {reviews.length} Reviews
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
