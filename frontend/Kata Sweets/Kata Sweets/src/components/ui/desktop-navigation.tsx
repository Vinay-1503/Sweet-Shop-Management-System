import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  LogIn,
  Menu,
  Search as SearchIcon,
  Clock,
  Tag,
  Package,
} from 'lucide-react';
import { SearchOverlay } from '@/components/ui/search-overlay';
import { ProfileDropdown } from '@/components/ui/profile-dropdown';
import { Button } from './button';
import { Badge } from './badge';
import { useStore } from '@/store/useStore';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { mockSweets } from '@/data/mockSweets';

interface DesktopNavigationProps {
  className?: string;
}

type SuggestionType = 'product' | 'category' | 'history';

interface SuggestionItem {
  id: string;
  label: string;
  type: SuggestionType;
}

const SEARCH_HISTORY_KEY = 'kata-sweets-search-history';
const MAX_HISTORY = 8;

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ className }) => {
  const { isMobile } = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartItemsCount, isAuthenticated } = useStore();
  const cartCount = getCartItemsCount();
  const headerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (isMobile || typeof window === 'undefined') {
      // On mobile, set header height to 0
      document.documentElement.style.setProperty('--desktop-header-height', '0px');
      return;
    }

    const updateHeaderHeight = () => {
      if (!headerRef.current) {
        return;
      }

      const { height } = headerRef.current.getBoundingClientRect();
      document.documentElement.style.setProperty('--desktop-header-height', `${height}px`);
    };

    // Initial update with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateHeaderHeight, 0);
    
    // Update on resize
    window.addEventListener('resize', updateHeaderHeight);
    
    // Also update when window size changes (for responsive breakpoints)
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaChange = () => {
      if (mediaQuery.matches) {
        updateHeaderHeight();
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateHeaderHeight);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [isMobile]);

  const navigationLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeVariant, setActiveVariant] = useState<'desktop' | 'mobile' | null>(null);
  const [productSource, setProductSource] = useState<any[]>([]);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    // Use mock data for search suggestions
    setProductSource(mockSweets);

    return () => {
      isActive = false;
    };
  }, []);

  const productNames = useMemo(
    () =>
      productSource.map((product) => ({
        id: product.id,
        label: (product.name || '').trim(),
      })),
    [productSource]
  );

  const categoryNames = useMemo(
    () =>
      Array.from(new Set(productSource.map((product) => product.category)))
        .filter(Boolean)
        .map((category) => ({
          id: `category-${category}`,
          label: (category || '').trim(),
        })),
    [productSource]
  );

  const searchContainerRefs = useRef<Set<HTMLDivElement>>(new Set());

  const registerSearchContainer = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      searchContainerRefs.current.add(element);
    }
  }, []);

  const loadSearchHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed.filter((item) => typeof item === 'string'));
        }
      }
    } catch (error) {
      console.warn('Unable to load search history', error);
    }
  }, []);

  useEffect(() => {
    loadSearchHistory();
  }, [loadSearchHistory]);

  const persistSearchHistory = useCallback((history: string[]) => {
    setSearchHistory(history);
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.warn('Unable to save search history', error);
    }
  }, []);

  const filteredSuggestions = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (!trimmedQuery) {
      return searchHistory.map<SuggestionItem>((item, index) => ({
        id: `history-${index}`,
        label: item,
        type: 'history',
      }));
    }

    const productMatches = productNames
      .filter((item) => item.label.toLowerCase().includes(trimmedQuery))
      .slice(0, 6)
      .map<SuggestionItem>((item) => ({
        id: item.id,
        label: item.label,
        type: 'product',
      }));

    const categoryMatches = categoryNames
      .filter((item) => item.label.toLowerCase().includes(trimmedQuery))
      .slice(0, 4)
      .map<SuggestionItem>((item) => ({
        id: item.id,
        label: item.label,
        type: 'category',
      }));

    const tagMatches = productSource
      .flatMap((product) =>
        (product.tags || []).map((tag) => ({
          id: `${product.id}-tag-${tag}`,
          label: `${tag} (${product.name})`,
          type: 'product' as SuggestionType,
        }))
      )
      .filter((item) => item.label.toLowerCase().includes(trimmedQuery))
      .slice(0, 4);

    return [...productMatches, ...categoryMatches, ...tagMatches];
  }, [categoryNames, productNames, productSource, searchHistory, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = Array.from(searchContainerRefs.current.values()).some((container) =>
        container.contains(target)
      );

      if (!isInside) {
        setIsDropdownOpen(false);
        setActiveVariant(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSelect = useCallback(
    (item: SuggestionItem | string) => {
      let trimmed: string;
      let suggestionItem: SuggestionItem | null = null;

      if (typeof item === 'string') {
        trimmed = item.trim();
      } else {
        suggestionItem = item;
        trimmed = item.label.trim();
      }

      if (!trimmed) return;

      const nextHistory = [
        trimmed,
        ...searchHistory.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, MAX_HISTORY);

      persistSearchHistory(nextHistory);
      setSearchQuery(trimmed);
      setIsDropdownOpen(false);
      setActiveVariant(null);

      // Navigate based on suggestion type
      if (suggestionItem) {
        if (suggestionItem.type === 'product') {
          navigate(`/product/${suggestionItem.id}`);
        } else if (suggestionItem.type === 'category') {
          const categoryName = suggestionItem.label;
          navigate(`/products?category=${encodeURIComponent(categoryName)}`);
        } else {
          navigate(`/search?query=${encodeURIComponent(trimmed)}`);
        }
      } else {
      navigate(`/search?query=${encodeURIComponent(trimmed)}`);
      }
    },
    [navigate, persistSearchHistory, searchHistory]
  );

  const handleSearchSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      handleSearchSelect(searchQuery);
    },
    [handleSearchSelect, searchQuery]
  );

  const renderSuggestionIcon = (type: SuggestionType) => {
    switch (type) {
      case 'history':
        return <Clock className="w-4 h-4 text-[#6B7280]" />;
      case 'category':
        return <Tag className="w-4 h-4 text-[#2C2E83]" />;
      default:
        return <Package className="w-4 h-4 text-[#2C2E83]" />;
    }
  };

  const renderSuggestionsDropdown = (variant: 'desktop' | 'mobile') => {
    const trimmedQuery = searchQuery.trim();
    const showHistorySection = !trimmedQuery && searchHistory.length > 0;
    const showSuggestionsSection = !!trimmedQuery && filteredSuggestions.length > 0;

    if (!isDropdownOpen || activeVariant !== variant) {
      return null;
    }

    return (
      <div className="absolute left-0 right-0 mt-2 bg-white border border-[#2C2E83]/20 rounded-xl shadow-2xl max-h-80 overflow-y-auto z-[9999] backdrop-blur-sm">
        {showSuggestionsSection && (
          <div className="py-2">
            <p className="px-4 py-2 text-xs font-semibold uppercase text-[#6B7280] tracking-wide border-b border-[#E5E7EB]/50">
              Suggestions
            </p>
            {filteredSuggestions.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => handleSearchSelect(item)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1E1E2F] hover:bg-[#E7E9FF] transition-all duration-200 text-left group cursor-pointer"
              >
                <div className="flex-shrink-0">{renderSuggestionIcon(item.type)}</div>
                <span className="truncate flex-1 group-hover:text-[#2C2E83] transition-colors">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {showHistorySection && (
          <div className="py-2">
            <p className="px-4 py-2 text-xs font-semibold uppercase text-[#6B7280] tracking-wide border-b border-[#E5E7EB]/50">
              Recent Searches
            </p>
            {searchHistory.map((item, index) => (
              <button
                key={`history-${index}`}
                type="button"
                onClick={() => handleSearchSelect(item)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1E1E2F] hover:bg-[#E7E9FF] transition-all duration-200 text-left group cursor-pointer"
              >
                <Clock className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                <span className="truncate flex-1 group-hover:text-[#2C2E83] transition-colors">{item}</span>
              </button>
            ))}
          </div>
        )}

        {!showHistorySection && !showSuggestionsSection && trimmedQuery && (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-[#6B7280]">No matches found. Try a different keyword.</p>
          </div>
        )}

        {!showHistorySection && !showSuggestionsSection && !trimmedQuery && (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-[#6B7280]">Start typing to search for products or categories.</p>
          </div>
        )}
      </div>
    );
  };

  const renderSearchBar = (variant: 'desktop' | 'mobile') => {
    const isDesktop = variant === 'desktop';
    const containerClasses = cn(
      'relative w-full',
      isDesktop ? '' : 'lg:hidden mt-3'
    );

    const inputClasses = cn(
      'w-full pl-12 pr-4 py-2.5 rounded-full border border-[#2C2E83] text-sm text-gray-900 placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#4B55C4] bg-white transition-all duration-200',
      isDesktop ? 'max-w-[420px]' : 'shadow-md',
      isDropdownOpen && activeVariant === variant && 'shadow-lg border-[#4B55C4]'
    );

    return (
      <div ref={registerSearchContainer} className={cn(containerClasses, 'overflow-visible')}>
        <form onSubmit={handleSearchSubmit} className="w-full" onClick={(e) => e.stopPropagation()}>
          <div className="relative w-full overflow-visible">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                const value = event.target.value;
                setSearchQuery(value);
                setIsDropdownOpen(true);
                setActiveVariant(variant);
              }}
              onFocus={(e) => {
                e.stopPropagation();
                setActiveVariant(variant);
                setIsDropdownOpen(true);
                loadSearchHistory();
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveVariant(variant);
                setIsDropdownOpen(true);
                loadSearchHistory();
              }}
              placeholder="Search for products or categories..."
              className={inputClasses}
              style={
                isDropdownOpen && activeVariant === variant
                  ? { borderBottomColor: 'rgba(44, 46, 131, 0.3)' }
                  : undefined
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSearchSubmit(event);
                } else if (event.key === 'Escape') {
                  setIsDropdownOpen(false);
                  setActiveVariant(null);
                }
              }}
              autoComplete="off"
            />
          </div>
        </form>
        {renderSuggestionsDropdown(variant)}
      </div>
    );
  };

  if (isMobile) {
    return null;
  }

  return (
    <header
      ref={headerRef}
      className={cn('desktop-navigation fixed top-0 left-0 right-0 w-full z-50 bg-white border-b border-[#F2DCE6] shadow-[0_4px_14px_rgba(255,109,170,0.08)] overflow-visible', className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg border border-[#E5E7EB] text-[#1E1E2F] hover:bg-pink-50 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden sm:block text-lg font-bold tracking-wide text-[#FF6DAA] font-serif">
              KATA SWEETS
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 ml-12">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                  'text-sm font-medium px-3 py-2 rounded-lg transition-colors',
                    location.pathname === link.path
                    ? 'text-[#DC143C] font-semibold bg-[#FFD1E3]/20'
                    : 'text-[#1F1F1F] hover:text-[#DC143C] hover:bg-[#FFD1E3]/10'
                )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

          {/* Search Bar - Replaces About Us, FAQs, Contact Us */}
          <div className="hidden lg:flex flex-1 justify-center max-w-md mx-8 overflow-visible">
            {renderSearchBar('desktop')}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-[#FFD1E3]/10 group hover:scale-110">
              <ShoppingCart className="w-6 h-6 text-[#1F1F1F] group-hover:text-[#FF6DAA]" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-accent-red text-white text-xs font-semibold min-w-[20px] h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Link>

              {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Button asChild>
                <Link 
                  to="/login"
                  className="bg-[#FF6DAA] text-white hover:bg-[#FF9FC6] font-medium shadow-sm rounded-lg px-5 py-2 inline-flex items-center justify-center"
                >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                </Link>
              </Button>
            )}
          </div>
        </div>

      </div>
      
      {/* Search Overlay - Opens from magnifying glass icon */}
      <SearchOverlay open={isSearchOverlayOpen} onOpenChange={setIsSearchOverlayOpen} />
    </header>
  );
}; 
