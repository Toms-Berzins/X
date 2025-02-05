import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { QuoteCard } from './QuoteCard.js';
import type { QuoteData, QuoteStatus } from '@/types/Quote.js';
import { cn } from '@/lib/utils.js';
import { useSwipeable } from 'react-swipeable';

interface QuoteCarouselProps {
  quotes: QuoteData[];
  autoPlay?: boolean;
  interval?: number;
  onStatusChange?: (quoteId: string, status: QuoteStatus) => void;
  className?: string;
}

export const QuoteCarousel: React.FC<QuoteCarouselProps> = ({
  quotes,
  autoPlay = true,
  interval = 5000,
  onStatusChange,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const goToNext = useCallback(() => {
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
  }, [quotes.length]);

  const goToPrevious = useCallback(() => {
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length);
  }, [quotes.length]);

  const goToIndex = useCallback((index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || quotes.length <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [isPlaying, interval, goToNext, quotes.length]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => goToNext(),
    onSwipedRight: () => goToPrevious(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Space':
          setIsPlaying((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  const handleQuoteStatusChange = (quote: QuoteData) => (status: QuoteStatus) => {
    onStatusChange?.(quote.id, status);
  };

  if (!quotes.length) {
    return null;
  }

  return (
    <div 
      className={cn('relative group', className)}
      {...handlers}
      role="region"
      aria-label="Quote carousel"
    >
      {/* Main carousel container */}
      <div className="overflow-hidden relative">
        <div
          className={cn(
            'flex transition-transform duration-500 ease-in-out',
            direction === 'right' ? 'animate-slideLeft' : 'animate-slideRight'
          )}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {quotes.map((quote, index) => (
            <div
              key={quote.id}
              className="w-full flex-shrink-0"
              aria-hidden={index !== currentIndex}
            >
              <QuoteCard
                quote={quote}
                variant="compact"
                onStatusChange={onStatusChange ? handleQuoteStatusChange(quote) : undefined}
                interactive={!!onStatusChange}
                className="mx-auto max-w-2xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      {quotes.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2',
              'p-2 rounded-full bg-white shadow-lg',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500'
            )}
            aria-label="Previous quote"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={goToNext}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
              'p-2 rounded-full bg-white shadow-lg',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500'
            )}
            aria-label="Next quote"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-600" />
          </button>
        </>
      )}

      {/* Dots navigation */}
      {quotes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-indigo-600 w-4'
                  : 'bg-gray-300 hover:bg-gray-400'
              )}
              aria-label={`Go to quote ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}

      {/* Play/Pause button */}
      {autoPlay && quotes.length > 1 && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            'absolute top-4 right-4',
            'p-2 rounded-full bg-white shadow-sm',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500'
          )}
          aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <rect x="6" y="4" width="3" height="12" />
              <rect x="11" y="4" width="3" height="12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}; 