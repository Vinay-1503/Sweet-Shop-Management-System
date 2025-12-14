import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      // Mobile: < 768px
      // Tablet: 768px - 1024px  
      // Desktop: > 1024px
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    // Responsive breakpoint helpers
    isSmallScreen: screenSize.width < 640,
    isMediumScreen: screenSize.width >= 640 && screenSize.width < 1024,
    isLargeScreen: screenSize.width >= 1024,
    isExtraLargeScreen: screenSize.width >= 1280,
    // Touch device detection
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  };
};
