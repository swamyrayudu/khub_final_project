'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedTextFlipProps {
  words: string[];
  className?: string;
  speed?: number;
}

export default function AnimatedTextFlip({
  words,
  className = '',
  speed = 2000,
}: AnimatedTextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsFlipping(false);
      }, 300);
    }, speed);

    return () => clearInterval(interval);
  }, [words.length, speed]);

  return (
    <>
      <style>{`
        @keyframes textFlip {
          0% {
            transform: rotateX(0deg);
            opacity: 1;
          }
          50% {
            transform: rotateX(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }
        
        .flip-animate {
          animation: textFlip 0.6s ease-in-out;
          display: inline-block;
          perspective: 1000px;
        }
      `}</style>
      <span
        className={`flip-animate ${className}`}
        style={{
          animation: isFlipping ? 'textFlip 0.6s ease-in-out' : 'none',
        }}
      >
        {words[currentIndex]}
      </span>
    </>
  );
}
