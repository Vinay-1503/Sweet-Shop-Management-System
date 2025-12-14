import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Package, Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockSweets } from '@/data/mockSweets';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const SEARCH_HISTORY_KEY = 'kata-sweets-search-history';
const MAX_HISTORY = 8;

type SuggestionType = 'product' | 'category' | 'history';

interface SuggestionItem {
  id: string;
  label: string;
  type: SuggestionType;
}

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productSource, setProductSource] = useState<any[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isActive = true;
    // Use mock data for search suggestions
    setProductSource(mockSweets);
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const productNames = useMemo(
    () => {
      const suggestions: Array<{ id: string; label: string; isVariant?: boolean; variantId?: string }> = [];
      
      productSource.forEach((product) => {
        // Check if product has variants (DisplayProduct with variantId)
        const displayProduct = product as any;
        if (displayProduct.isVariant && displayProduct.variantId) {
          // Include variant in search suggestions
          suggestions.push({
            id: product.id,
            label: (product.name || '').trim(),
            isVariant: true,
            variantId: displayProduct.variantId,
          });
        } else {
          // Include main product
          suggestions.push({
            id: product.id,
            label: (product.name || '').trim(),
            isVariant: false,
          });
        }
      });
      
      return suggestions;
    },
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
    if (open) {
      loadSearchHistory();
    }
  }, [open, loadSearchHistory]);

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

    return [...productMatches, ...categoryMatches];
  }, [categoryNames, productNames, searchHistory, searchQuery]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

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

      setSearchHistory(nextHistory);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextHistory));
      } catch (error) {
        console.warn('Unable to save search history', error);
      }

      setSearchQuery(trimmed);
      setIsDropdownOpen(false);
      onOpenChange(false);

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
    [navigate, searchHistory, onOpenChange]
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

  const trimmedQuery = searchQuery.trim();
  const showHistorySection = !trimmedQuery && searchHistory.length > 0;
  const showSuggestionsSection = !!trimmedQuery && filteredSuggestions.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-3xl p-0 gap-0 overflow-hidden" 
        style={{ 
          top: 'var(--desktop-header-height, 80px)', 
          transform: 'translateX(-50%) translateY(0)',
          left: '50%'
        }}
      >
        <div ref={searchContainerRef} className="relative w-full">
          <div className="p-6 border-b border-[#E5E7EB]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none z-10" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearchQuery(value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  setIsDropdownOpen(true);
                  loadSearchHistory();
                }}
                placeholder="Search for products or categories..."
                className={cn(
                  "w-full pl-12 pr-4 py-3 rounded-full border border-[#2C2E83] text-base text-gray-900 placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#4B55C4] bg-white transition-all duration-200",
                  isDropdownOpen && 'shadow-lg border-[#4B55C4]'
                )}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSearchSubmit(event);
                  } else if (event.key === 'Escape') {
                    setIsDropdownOpen(false);
                    onOpenChange(false);
                  }
                }}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Search Dropdown */}
          {isDropdownOpen && (
            <div className="max-h-96 overflow-y-auto">
              {showSuggestionsSection && (
                <div className="py-2">
                  <p className="px-6 py-2 text-xs font-semibold uppercase text-[#6B7280] tracking-wide border-b border-[#E5E7EB]/50">
                    Suggestions
                  </p>
                  {filteredSuggestions.map((item) => {
                    // Create unique key: include variantId if present to avoid duplicate keys
                    const uniqueKey = item.type === 'product' && (item as any).variantId
                      ? `${item.type}-${item.id}-${(item as any).variantId}`
                      : `${item.type}-${item.id}`;
                    
                    return (
                      <button
                        key={uniqueKey}
                        type="button"
                        onClick={() => handleSearchSelect(item)}
                        className="w-full flex items-center gap-3 px-6 py-3 text-sm text-[#1E1E2F] hover:bg-[#E7E9FF] transition-all duration-200 text-left group cursor-pointer"
                      >
                        <div className="flex-shrink-0">{renderSuggestionIcon(item.type)}</div>
                        <span className="truncate flex-1 group-hover:text-[#2C2E83] transition-colors">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {showHistorySection && (
                <div className="py-2">
                  <p className="px-6 py-2 text-xs font-semibold uppercase text-[#6B7280] tracking-wide border-b border-[#E5E7EB]/50">
                    Recent Searches
                  </p>
                  {searchHistory.map((item, index) => (
                    <button
                      key={`history-${index}`}
                      type="button"
                      onClick={() => handleSearchSelect(item)}
                      className="w-full flex items-center gap-3 px-6 py-3 text-sm text-[#1E1E2F] hover:bg-[#E7E9FF] transition-all duration-200 text-left group cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
                      <span className="truncate flex-1 group-hover:text-[#2C2E83] transition-colors">{item}</span>
                    </button>
                  ))}
                </div>
              )}

              {!showHistorySection && !showSuggestionsSection && trimmedQuery && (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-[#6B7280]">No matches found. Try a different keyword.</p>
                </div>
              )}

              {!showHistorySection && !showSuggestionsSection && !trimmedQuery && (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-[#6B7280]">Start typing to search for products or categories.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

