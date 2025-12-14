import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Filter } from 'lucide-react';
import Fuse from 'fuse.js';
import { Input } from './input';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

interface SearchItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  image?: string;
  price?: number;
  tags?: string[];
}

interface EnhancedSearchProps {
  items: SearchItem[];
  onSearch: (query: string, results: SearchItem[]) => void;
  onSelectItem?: (item: SearchItem) => void;
  placeholder?: string;
  showRecentSearches?: boolean;
  showTrending?: boolean;
  className?: string;
}

// Point 7: Advanced search with fuzzy matching and suggestions
export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  items,
  onSearch,
  onSelectItem,
  placeholder = "Search for sweets...",
  showRecentSearches = true,
  showTrending = true,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fuzzy search configuration
  const fuse = useMemo(
    () => new Fuse(items, {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'category', weight: 0.2 },
        { name: 'description', weight: 0.1 },
        { name: 'tags', weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
    }),
    [items]
  );

  // Trending searches (mock data)
  const trendingSearches = ['Chocolates', 'Candies', 'Desserts', 'Cakes'];

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const searchResults = fuse.search(query).map(result => result.item);
      setResults(searchResults.slice(0, 8)); // Limit to 8 results
      onSearch(query, searchResults);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fuse, onSearch]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  const handleSelectItem = (item: SearchItem) => {
    onSelectItem?.(item);
    setIsOpen(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const showSuggestions = isOpen && (query.length > 0 || showRecentSearches || showTrending);

  return (
    <div ref={searchRef} className={cn('relative w-full max-w-2xl', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-12 pr-12 h-14 text-lg rounded-2xl shadow-elegant border-border/30 focus:border-primary/50 focus:shadow-glow transition-all duration-300"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-muted/50"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-muted/50"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="shadow-floating border-border/50 backdrop-blur-lg bg-card/95">
              <CardContent className="p-4">
                {/* Search Results */}
                {query.length > 0 && (
                  <div className="space-y-2">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    ) : results.length > 0 ? (
                      <>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                          Search Results
                        </h3>
                        {results.map((item) => (
                          <motion.button
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate group-hover:text-primary transition-colors">
                                {item.name}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {item.category}
                              </p>
                            </div>
                            {item.price && (
                              <Badge variant="secondary" className="shrink-0">
                                ₹{item.price}
                              </Badge>
                            )}
                          </motion.button>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No results found for "{query}"</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Recent Searches */}
                {query.length === 0 && showRecentSearches && recentSearches.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Recent Searches
                    </h3>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}

                {/* Trending Searches */}
                {query.length === 0 && showTrending && (
                  <div className="space-y-2 mt-4">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Trending Now
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((trend, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleSearch(trend)}
                        >
                          {trend}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

