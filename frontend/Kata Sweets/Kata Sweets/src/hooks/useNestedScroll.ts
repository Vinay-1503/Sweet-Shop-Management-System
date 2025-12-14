import { useCallback, useRef, useEffect } from 'react';

export const useNestedScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
    lastXRef.current = touch.clientX;
    lastYRef.current = touch.clientY;
    isScrollingRef.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastXRef.current;
    const deltaY = touch.clientY - lastYRef.current;
    const totalDeltaX = Math.abs(touch.clientX - startXRef.current);
    const totalDeltaY = Math.abs(touch.clientY - startYRef.current);

    // Only determine direction if we haven't started scrolling yet
    if (!isScrollingRef.current) {
      // Wait for a minimum movement to determine direction
      if (totalDeltaX > 5 || totalDeltaY > 5) {
        isScrollingRef.current = true;
        
        // If vertical movement is more significant, let the page handle it
        if (totalDeltaY > totalDeltaX) {
          // Don't prevent default - let the page scroll vertically
          return;
        }
      }
    }

    // If we're scrolling horizontally, handle it
    if (isScrollingRef.current && totalDeltaX > totalDeltaY) {
      // Allow horizontal scrolling within the container
      // Don't prevent default or stop propagation
    }

    lastXRef.current = touch.clientX;
    lastYRef.current = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    isScrollingRef.current = false;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const isAtLeftEdge = scrollLeft <= 0;
    const isAtRightEdge = scrollLeft >= scrollWidth - clientWidth - 1;

    // Always allow vertical scrolling to pass through
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      window.scrollBy(0, e.deltaY);
      return;
    }

    // Handle horizontal scrolling only when at edges
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if ((e.deltaX > 0 && isAtRightEdge) || (e.deltaX < 0 && isAtLeftEdge)) {
        e.preventDefault();
        window.scrollBy(0, e.deltaY);
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return {
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}; 