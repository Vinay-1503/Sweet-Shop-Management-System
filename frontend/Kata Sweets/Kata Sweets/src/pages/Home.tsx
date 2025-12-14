// Luxury dessert store Home page - Strict color theme, emotional sections
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { useMobile } from '@/hooks/use-mobile';
import { mockSweets, mockCategories, mockBanners } from '@/data/mockSweets';
import { UnifiedProductCard } from '@/components/ui/unified-product-card';
import { CircularCategoryCard } from '@/components/ui/circular-category-card';
import { ProfileDropdown } from '@/components/ui/profile-dropdown';
import { BannerSlider } from '@/components/ui/banner-slider';
import { FestiveCollage } from '@/components/ui/festive-collage';
import { InspirationalBanner } from '@/components/ui/inspirational-banner';
import { MostPopularShowcase } from '@/components/ui/most-popular-showcase';
import { CustomerReviews } from '@/components/ui/customer-reviews';
import { SectionDivider } from '@/components/ui/section-divider';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

const Home = () => {
  const { getCartItemsCount, isAuthenticated, user } = useStore();
  const cartCount = getCartItemsCount();
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search
  const filteredProducts = searchQuery
    ? mockSweets.filter(sweet =>
        sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockSweets;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Featured sweets - specific 4 products in exact order
  const featuredProductNames = [
    'Red Velvet Cupcake',
    'Kesar Badam Milk Cake',
    'Texas Pecan Praline',
    'Belgian Chocolate Truffles'
  ];
  
  const featuredSweetsFinal = featuredProductNames
    .map(name => mockSweets.find(sweet => sweet.name === name))
    .filter(Boolean) as typeof mockSweets;

  // Section wrapper component with scroll animation
  const SectionWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    const { ref, isVisible } = useScrollAnimation(0.1);
    return (
      <section
        ref={ref}
        className={cn(
          'bg-white py-16 md:py-20 transition-all duration-500 ease-out',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          className
        )}
      >
        {children}
      </section>
    );
  };

  // Section header component
  const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <h2 className="text-3xl md:text-4xl font-bold text-[#1F1F1F] mb-12 text-center">
        {children}
      </h2>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-[#FF6DAA] text-white shadow-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="text-xl font-bold text-[#DC143C]">
              Kata Sweets
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#FF6DAA] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <ProfileDropdown isMobile={true} />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-white hover:bg-white/20"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1 - BANNER SLIDER */}
      <BannerSlider />

      {/* Section Divider */}
      <SectionDivider variant="pink-to-white" />

      {/* SECTION 2 - SHOP BY CATEGORY */}
      <SectionWrapper>
        <div className="container mx-auto px-4">
          <SectionHeader>Shop by Category</SectionHeader>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 max-w-6xl mx-auto">
            {mockCategories.map((category) => (
              <CircularCategoryCard
                key={category.id}
                category={{
                  id: category.id,
                  name: category.name,
                  image: category.image
                }}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Section Divider */}
      <SectionDivider variant="white-to-red" />

      {/* SECTION 3 - FESTIVE COLLAGE */}
      <FestiveCollage />

      {/* Section Divider */}
      <SectionDivider variant="red-to-white" />

      {/* SECTION 3.5 - INSPIRATIONAL BANNER */}
      <InspirationalBanner />

      {/* SECTION 3.75 - MOST POPULAR SHOWCASE */}
      <MostPopularShowcase />

      {/* SECTION 4 - FEATURED SWEETS */}
      <SectionWrapper>
        <div className="container mx-auto px-4">
          <SectionHeader>You Might Miss These If You're Late</SectionHeader>
          
          {/* Horizontal Scroll Container - One Row Only */}
          <div className="overflow-x-auto md:overflow-x-visible -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 min-w-max md:min-w-0 pb-2 md:pb-0">
              {featuredSweetsFinal.map((sweet) => (
                <div key={sweet.id} className="flex-shrink-0 w-[280px] md:w-auto">
                  <UnifiedProductCard
                    product={{
                      id: sweet.id,
                      name: sweet.name,
                      description: sweet.description,
                      price: sweet.price,
                      originalPrice: sweet.originalPrice,
                      image: sweet.image,
                      category: sweet.category,
                      unit: 'piece',
                      inStock: sweet.inStock,
                      rating: sweet.rating,
                      reviewCount: sweet.reviewCount,
                      discount: sweet.discount,
                      tags: sweet.tags
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 5 - CUSTOMER REVIEWS */}
      <CustomerReviews />

    </div>
  );
};

export default Home;
