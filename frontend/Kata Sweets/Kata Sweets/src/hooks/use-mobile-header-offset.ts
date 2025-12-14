import { useEffect } from 'react';
import { useMobile } from './use-mobile';

/**
 * Custom hook to dynamically calculate and set mobile header and footer offsets
 * Measures the .mobile-header and .mobile-footer heights and sets CSS variables
 * Only runs on mobile devices
 */
export const useMobileHeaderOffset = () => {
  const { isMobile } = useMobile();

  useEffect(() => {
    if (isMobile) {
      const updateSafeOffsets = () => {
        const header = document.querySelector('.mobile-header');
        const footer = document.querySelector('.mobile-footer');

        const headerH = header ? header.offsetHeight : 0;
        const footerH = footer ? footer.offsetHeight : 0;

        document.documentElement.style.setProperty('--header-offset', `${headerH}px`);
        document.documentElement.style.setProperty('--footer-offset', `${footerH}px`);
      };

      // Call immediately
      updateSafeOffsets();

      // Add event listeners
      window.addEventListener('load', updateSafeOffsets);
      window.addEventListener('resize', updateSafeOffsets);
      window.addEventListener('orientationchange', updateSafeOffsets);

      // Cleanup
      return () => {
        window.removeEventListener('load', updateSafeOffsets);
        window.removeEventListener('resize', updateSafeOffsets);
        window.removeEventListener('orientationchange', updateSafeOffsets);
      };
    }
  }, [isMobile]);
};

