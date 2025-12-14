import React from 'react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  maxWidth = '7xl',
}) => {
  const { isMobile, isTablet, isDesktop } = useMobile();

  const containerVariants = {
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
    xl: 'px-8 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20',
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

  return (
    <div
      className={cn(
        'w-full',
        containerVariants[variant],
        maxWidthClasses[maxWidth],
        paddingVariants[padding],
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
    <ResponsiveContainer>
      {children}
    </ResponsiveContainer>
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
