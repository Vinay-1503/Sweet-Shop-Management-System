import React from 'react';
import { LucideIcon, Package, ShoppingBag, Search, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const defaultIcons = {
  products: Package,
  categories: FolderOpen,
  cart: ShoppingBag,
  search: Search,
  default: Package,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  const DefaultIcon = Icon || defaultIcons.default;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12 text-center',
        className
      )}
    >
      <div className="w-20 h-20 bg-[#F5F6FA] rounded-full flex items-center justify-center mb-4">
        <DefaultIcon className="w-10 h-10 text-[#9CA3AF]" />
      </div>
      <h3 className="text-lg font-semibold text-[#1E1E2F] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[#6B7280] mb-6 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

// Pre-configured empty states for common use cases
export const EmptyProducts: React.FC<Omit<EmptyStateProps, 'icon' | 'title'>> = (props) => (
  <EmptyState
    icon={defaultIcons.products}
    title="No products available"
    description="We couldn't find any products at the moment. Please check back later."
    {...props}
  />
);

export const EmptyCategories: React.FC<Omit<EmptyStateProps, 'icon' | 'title'>> = (props) => (
  <EmptyState
    icon={defaultIcons.categories}
    title="No categories found"
    description="Categories are currently unavailable. Please try again later."
    {...props}
  />
);

export const EmptySearch: React.FC<Omit<EmptyStateProps, 'icon' | 'title'>> = (props) => (
  <EmptyState
    icon={defaultIcons.search}
    title="No results found"
    description="Try adjusting your search terms or browse our categories."
    {...props}
  />
);

