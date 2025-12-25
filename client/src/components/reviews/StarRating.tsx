'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  totalReviews?: number;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showNumber = false,
  totalReviews 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const fillPercentage = Math.min(Math.max(rating - index, 0), 1) * 100;

          return (
            <div key={index} className="relative">
              <Star className={`${sizeClasses[size]} text-gray-300`} />
              <div 
                className="absolute inset-0 overflow-hidden" 
                style={{ width: `${fillPercentage}%` }}
              >
                <Star 
                  className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {showNumber && (
        <span className={`${textSizes[size]} font-medium text-foreground`}>
          {rating.toFixed(1)}
        </span>
      )}
      
      {totalReviews !== undefined && (
        <span className={`${textSizes[size]} text-muted-foreground`}>
          ({totalReviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}
