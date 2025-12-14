import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UnifiedProductCard } from '@/components/ui/unified-product-card';
import { UnifiedCategoryCard } from '@/components/ui/unified-category-card';
import { MobileAppBar } from '@/components/ui/mobile-appbar';
import { useMobile } from '@/hooks/use-mobile';
import { useMobileHeaderOffset } from '@/hooks/use-mobile-header-offset';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import type { DisplayProduct } from '@/utils/productTransformer';
import type { Category } from '@/types/category';
import { updateProductCategoryNames } from '@/utils/categoryMapper';
import toast from 'react-hot-toast';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || searchParams.get('query') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredResults, setFilteredResults] = useState<DisplayProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<DisplayProduct[]>([]);
  const { isMobile } = useMobile();
  useMobileHeaderOffset();

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const fetchedProducts = await getProducts();
        if (!isMounted) return;
        // Update category IDs to category names
        const productsWithCategoryNames = await updateProductCategoryNames(fetchedProducts);
        setProducts(productsWithCategoryNames);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to load products for search:', error);
        }
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const mainProducts = useMemo(
    () => products.filter((product) => !product.isVariant),
    [products]
  );

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const fetchedCategories = await getCategories();
        if (!isMounted) return;
        setCategories(fetchedCategories);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to load categories for search:', error);
        }
        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setFilteredResults([]);
      setSuggestedProducts([]);
      return;
    }

    const normalized = trimmedQuery.toLowerCase();
    const results = mainProducts.filter((product) => {
      const productName = product.name?.toLowerCase() || '';
      const categoryName = product.category?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      const tagMatch = (product.tags || []).some((tag) => tag.toLowerCase().includes(normalized));
      return (
        productName.includes(normalized) ||
        categoryName.includes(normalized) ||
        description.includes(normalized) ||
        tagMatch
      );
    });

    setFilteredResults(results);

    if (results.length > 0) {
      setSuggestedProducts([]);
      return;
    }

    const condensedQuery = normalized.replace(/(.)\1+/g, '$1');

    const fuzzyMatches = mainProducts
      .filter((product) => {
        const productName = product.name?.toLowerCase() || '';
        const categoryName = product.category?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || '';
        const tagMatch = (product.tags || []).some((tag) => tag.toLowerCase().includes(condensedQuery));

        return (
          productName.includes(condensedQuery) ||
          categoryName.includes(condensedQuery) ||
          description.includes(condensedQuery) ||
          tagMatch
        );
      })
      .slice(0, 8);

    if (fuzzyMatches.length > 0) {
      setSuggestedProducts(fuzzyMatches);
    } else {
      setSuggestedProducts(mainProducts.slice(0, 8));
    }
  }, [searchQuery, mainProducts]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const similarProducts = useMemo(() => {
    if (filteredResults.length === 0) return [];

    const excludeIds = new Set(filteredResults.map((product) => product.id));
    const categorySet = new Set(
      filteredResults
        .map((product) => product.category?.toLowerCase())
        .filter(Boolean)
    );
    const tagSet = new Set(
      filteredResults.flatMap((product) =>
        (product.tags || []).map((tag) => tag.toLowerCase())
      )
    );

    return mainProducts
      .filter((product) => !excludeIds.has(product.id))
      .filter((product) => {
        const categoryMatch =
          product.category && categorySet.has(product.category.toLowerCase());
        const tagMatch = (product.tags || []).some((tag) =>
          tagSet.has(tag.toLowerCase())
        );
        return categoryMatch || tagMatch;
      })
      .slice(0, 6);
  }, [filteredResults, mainProducts]);


  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Mobile AppBar */}
      {isMobile && <MobileAppBar title="Search" />}

      {/* Search Input for Mobile */}
      {isMobile && (
        <div className={`bg-primary px-4 py-4 md:pt-4 ${isMobile ? 'page-content' : ''}`}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search for products..."
              className="w-full border border-primary/40 rounded-lg bg-white text-[#1E1E2F] placeholder:text-gray-500 pl-10 pr-10 py-2 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!searchQuery ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#1E1E2F]">Shop by Category</h2>
              {!categoriesLoading && (
                <span className="text-sm text-[#6B7280]">{categories.length} categories</span>
              )}
            </div>
            {categoriesLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className="h-40 animate-pulse rounded-2xl border border-primary/10 bg-white"
                  />
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {categories.map((category) => (
                  <UnifiedCategoryCard
                    key={category.id}
                    category={{
                      id: category.id,
                      name: category.name,
                      icon: category.icon || '📦',
                      image: category.image,
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-primary/20 bg-white p-6 text-center text-sm text-[#6B7280]">
                Categories are unavailable right now. Please try again soon.
              </p>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">
                {productsLoading ? 'Searching products…' : `${filteredResults.length} results for "${searchQuery}"`}
              </p>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="space-y-6">
                <p className="text-center text-sm text-[#6B7280]">
                  No products found matching "{searchQuery}".
                </p>
                {suggestedProducts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#1E1E2F] text-center">Products you may like</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {suggestedProducts.map((product) => {
                        // Create unique key: include variantId if present to avoid duplicate keys
                        const uniqueKey = product.variantId 
                          ? `${product.id}-${product.variantId}`
                          : product.id;
                        return (
                          <UnifiedProductCard key={uniqueKey} product={product} />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredResults.map((product) => {
                    // Create unique key: include variantId if present to avoid duplicate keys
                    const uniqueKey = product.variantId 
                      ? `${product.id}-${product.variantId}`
                      : product.id;
                    return (
                      <UnifiedProductCard key={uniqueKey} product={product} />
                    );
                  })}
                </div>

                {similarProducts.length > 0 && (
                  <div className="space-y-4 mt-8">
                    <h3 className="text-lg font-semibold text-[#1E1E2F]">
                      Similar Products
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {similarProducts.map((product) => (
                        <UnifiedProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;