import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  background?: 'none' | 'light' | 'muted' | 'primary' | 'white';
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  maxWidth = '7xl',
  background = 'none',
}) => {
  const { isMobile } = useMobile();

  const layoutVariants = {
    default: 'mx-auto',
    narrow: 'mx-auto max-w-4xl',
    wide: 'mx-auto max-w-7xl',
    full: 'w-full',
  };

  const paddingVariants = {
    none: '',
    sm: 'px-3 py-4',
    md: 'px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12',
    lg: 'px-6 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16',
    xl: 'px-6 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 xl:px-16 xl:py-20',
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  const backgroundClasses = {
    none: '',
    light: 'bg-light-grey/30',
    muted: 'bg-muted/30',
    primary: 'bg-primary/5',
    white: 'bg-white',
  };

  return (
    <div
      className={cn(
        'w-full',
        layoutVariants[variant],
        maxWidthClasses[maxWidth],
        paddingVariants[padding],
        backgroundClasses[background],
        // Responsive adjustments
        isMobile && 'px-4',
        isTablet && 'px-6',
        isDesktop && 'px-8',
        className
      )}
    >
      {children}
    </div>
  );
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = { mobile: 2, tablet: 3, desktop: 4, wide: 5 },
  gap = 'md',
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
    xl: 'gap-8 md:gap-10',
  };

  const gridCols = {
    mobile: `grid-cols-${cols.mobile || 2}`,
    tablet: `md:grid-cols-${cols.tablet || 3}`,
    desktop: `lg:grid-cols-${cols.desktop || 4}`,
    wide: `xl:grid-cols-${cols.wide || 5}`,
  };

  return (
    <div
      className={cn(
        'grid',
        gridCols.mobile,
        gridCols.tablet,
        gridCols.desktop,
        gridCols.wide,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

// Responsive Section Component
interface ResponsiveSectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'light' | 'muted' | 'primary';
  container?: boolean;
}

export const ResponsiveSection: React.FC<ResponsiveSectionProps> = ({
  children,
  className,
  spacing = 'md',
  background = 'none',
  container = true,
}) => {
  const spacingClasses = {
    none: '',
    sm: 'py-6 md:py-8',
    md: 'py-8 md:py-12 lg:py-16',
    lg: 'py-12 md:py-16 lg:py-20',
    xl: 'py-16 md:py-20 lg:py-24',
  };

  const backgroundClasses = {
    none: '',
    light: 'bg-light-grey/30',
    muted: 'bg-muted/30',
    primary: 'bg-primary/5',
  };

  const content = container ? (
    <ResponsiveLayout>
      {children}
    </ResponsiveLayout>
  ) : (
    children
  );

  return (
    <section
      className={cn(
        'w-full',
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
    >
      {content}
    </section>
  );
};

// Responsive Page Container
interface ResponsivePageProps {
  children: React.ReactNode;
  className?: string;
  showMobileNav?: boolean;
  showDesktopNav?: boolean;
}

export const ResponsivePage: React.FC<ResponsivePageProps> = ({
  children,
  className,
  showMobileNav = true,
  showDesktopNav = true,
}) => {
  const { isMobile } = useMobile();

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;

    if (isMobile) {
      root.style.setProperty('--desktop-header-height', '0px');
    } else {
      // On desktop, ensure the header height is calculated
      // The DesktopNavigation component will update this, but we set a default
      const desktopHeader = document.querySelector('header[class*="fixed"]');
      if (desktopHeader) {
        const height = desktopHeader.getBoundingClientRect().height;
        root.style.setProperty('--desktop-header-height', `${height}px`);
      } else {
        // Default fallback
        root.style.setProperty('--desktop-header-height', '80px');
      }
    }

    return () => {
      // Cleanup handled by DesktopNavigation component
    };
  }, [isMobile]);

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Main Content - ensure it can scroll */}
      <main
        className="relative min-h-screen"
        style={{
          paddingTop: isMobile ? 0 : 'var(--desktop-header-height, 80px)',
        }}
      >
        {children}
      </main>
      
      {/* Mobile Navigation - Only visible on mobile */}
      {showMobileNav && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {/* Mobile navigation will be rendered here */}
        </div>
      )}
    </div>
  );
};

// Responsive Content Wrapper
interface ResponsiveContentProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  container?: boolean;
}

export const ResponsiveContent: React.FC<ResponsiveContentProps> = ({
  children,
  className,
  spacing = 'md',
  container = true,
}) => {
  const spacingClasses = {
    none: '',
    sm: 'py-6 md:py-8',
    md: 'py-8 md:py-12 lg:py-16',
    lg: 'py-12 md:py-16 lg:py-20',
    xl: 'py-16 md:py-20 lg:py-24',
  };

  const content = container ? (
    <ResponsiveLayout>
      {children}
    </ResponsiveLayout>
  ) : (
    children
  );

  return (
    <div
      className={cn(
        'w-full',
        spacingClasses[spacing],
        className
      )}
    >
      {content}
    </div>
  );
}; 