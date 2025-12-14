import { useCallback } from 'react';

export const useScrollHandler = () => {
  const handleHorizontalScroll = useCallback((e: React.TouchEvent) => {
    const element = e.currentTarget as HTMLElement;
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    let isScrolling = false;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!isScrolling) {
        const currentX = moveEvent.touches[0].clientX;
        const currentY = moveEvent.touches[0].clientY;
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);

        // If vertical movement is more significant, allow page scroll
        if (deltaY > deltaX && deltaY > 10) {
          element.style.overflowX = 'hidden';
          isScrolling = true;
          
          setTimeout(() => {
            element.style.overflowX = 'auto';
            isScrolling = false;
          }, 150);
        }
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, []);

  return { handleHorizontalScroll };
}; 