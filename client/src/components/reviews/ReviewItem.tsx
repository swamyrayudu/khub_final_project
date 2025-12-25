'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, MoreVertical, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { markReviewHelpful, deleteReview } from '@/actions/reviewActions';
import { toast } from 'react-toastify';
import { Review } from '@/actions/reviewActions';

interface ReviewItemProps {
  review: Review;
  isOwnReview?: boolean;
  onReviewUpdated?: () => void;
}

export function ReviewItem({ review, isOwnReview, onReviewUpdated }: ReviewItemProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [isHelpful, setIsHelpful] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleHelpful = async () => {
    setProcessing(true);
    try {
      const result = await markReviewHelpful(review.id);
      if (result.success) {
        setIsHelpful(result.isHelpful || false);
        setHelpfulCount(prev => result.isHelpful ? prev + 1 : prev - 1);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Failed to update helpful status');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const result = await deleteReview(review.id);
      if (result.success) {
        toast.success(result.message);
        onReviewUpdated?.();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="border-b last:border-0 pb-6 last:pb-0">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <Avatar className="w-10 h-10">
          <AvatarImage src={review.userImage} alt={review.userName} />
          <AvatarFallback>
            {review.userName?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        {/* Review Content */}
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{review.userName}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {review.verifiedPurchase && (
                  <Badge variant="secondary" className="text-xs">
                    Verified Purchase
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            {isOwnReview && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Review
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Review Title */}
          {review.title && (
            <h4 className="font-semibold text-sm">{review.title}</h4>
          )}

          {/* Review Comment */}
          {review.comment && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
          )}

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border"
                />
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <span>{formatDate(review.createdAt)}</span>
            {!isOwnReview && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 gap-1 hover:bg-muted"
                onClick={handleHelpful}
                disabled={processing}
              >
                <ThumbsUp className={`w-3 h-3 ${isHelpful ? 'fill-current' : ''}`} />
                <span>Helpful ({helpfulCount})</span>
              </Button>
            )}
            {isOwnReview && helpfulCount > 0 && (
              <span className="text-muted-foreground">Helpful ({helpfulCount})</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
