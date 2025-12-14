import { useRef, useEffect } from 'react';

export const useSimpleScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: WheelEvent) => {
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
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return { containerRef };
}; 