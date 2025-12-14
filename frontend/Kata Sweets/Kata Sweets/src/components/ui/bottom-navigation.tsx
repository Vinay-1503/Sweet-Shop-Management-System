import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Menu } from 'lucide-react';
import { Badge } from './badge';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  showBadge?: boolean;
}

// Enhanced bottom navigation with original mobile design
export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { cart } = useStore();
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Menu, label: 'Products', path: '/products' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', showBadge: true },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className="mobile-footer fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center h-full px-3 min-w-[64px] touch-target group",
                item.path === '/cart' && "hover:scale-110"
              )}
            >
              <div className="relative flex flex-col items-center justify-center">
                {/* Icon container */}
                <div className="relative mb-1">
                  {active && item.path === '/' ? (
                    // Special styling for active home - white circle
                    <div className="w-6 h-6 bg-white border-2 border-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    </div>
                  ) : (
                  <Icon
                    className={cn(
                      'w-6 h-6',
                      active 
                          ? 'text-black font-bold' 
                          : 'text-gray-800 font-bold'
                    )}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  )}
                  
                  {/* Cart badge */}
                  {item.showBadge && cartItemCount > 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Badge 
                        variant="destructive" 
                        className="h-5 min-w-[20px] text-xs flex items-center justify-center px-1 bg-accent-red text-white"
                      >
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Label */}
                <span 
                  className={cn(
                    'text-xs font-bold',
                    active 
                      ? 'text-black' 
                      : 'text-black'
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};