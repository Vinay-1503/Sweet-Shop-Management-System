import { useCallback } from 'react';

interface TouchScrollOptions {
  threshold?: number;
  onHorizontalScroll?: () => void;
  onVerticalScroll?: () => void;
}

export const useTouchScroll = (options: TouchScrollOptions = {}) => {
  const { threshold = 10, onHorizontalScroll, onVerticalScroll } = options;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = e.currentTarget as HTMLDivElement;
    target.dataset.startX = touch.clientX.toString();
    target.dataset.startY = touch.clientY.toString();
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = e.currentTarget as HTMLDivElement;
    const startX = parseInt(target.dataset.startX || '0');
    const startY = parseInt(target.dataset.startY || '0');
    const deltaX = Math.abs(touch.clientX - startX);
    const deltaY = Math.abs(touch.clientY - startY);
    
    // If vertical scroll is more significant, allow it to bubble up
    if (deltaY > deltaX && deltaY > threshold) {
      e.stopPropagation();
      onVerticalScroll?.();
      return;
    }
    
    // Update start position for horizontal scroll
    target.dataset.startX = touch.clientX.toString();
    target.dataset.startY = touch.clientY.toString();
    
    // If horizontal scroll is more significant
    if (deltaX > deltaY && deltaX > threshold) {
      onHorizontalScroll?.();
    }
  }, [threshold, onHorizontalScroll, onVerticalScroll]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLDivElement;
    delete target.dataset.startX;
    delete target.dataset.startY;
  }, []);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}; 