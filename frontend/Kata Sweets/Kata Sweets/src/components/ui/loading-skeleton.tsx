import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  ...props
}) => {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="skeleton h-4 w-full"
            style={{
              width: index === lines - 1 ? '75%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  const baseClasses = 'skeleton animate-pulse';
  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
};

// Point 8: Specific skeleton components
export const ProductCardSkeleton = () => (
  <div className="product-card">
    <Skeleton variant="rectangular" className="aspect-square mb-4" />
    <Skeleton variant="text" lines={2} className="mb-2" />
    <Skeleton variant="text" className="w-1/2 mb-2" />
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="circular" width={32} height={32} />
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="premium-card">
    <Skeleton variant="circular" width={64} height={64} className="mx-auto mb-4" />
    <Skeleton variant="text" className="w-3/4 mx-auto" />
  </div>
);

export const CarouselSkeleton = () => (
  <div className="carousel-container">
    <Skeleton variant="rectangular" className="h-48 w-full" />
  </div>
);
