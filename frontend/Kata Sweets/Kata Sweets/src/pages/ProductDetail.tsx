// Simplified Product Detail page - uses mock data
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileAppBar } from '@/components/ui/mobile-appbar';
import { useStore } from '@/store/useStore';
import { useMobile } from '@/hooks/use-mobile';
import { useMobileHeaderOffset } from '@/hooks/use-mobile-header-offset';
import { mockSweets } from '@/data/mockSweets';
import { Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { UnifiedProductCard } from '@/components/ui/unified-product-card';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart, updateCartQuantity } = useStore();
  const { isMobile } = useMobile();
  useMobileHeaderOffset();

  const product = mockSweets.find(s => s.id === id);
  
  // Get current quantity in cart
  const cartItem = cart.find(item => item.id === product?.id);
  const currentQuantity = cartItem?.quantity || 0;
  
  // Find similar products (same category, or shared tags, or top-rated)
  const similarProducts = product 
    ? mockSweets
        .filter(s => s.id !== product.id)
        .filter(s => 
          s.category === product.category || 
          (product.tags && s.tags && product.tags.some(tag => s.tags?.includes(tag))) ||
          s.rating >= 4.5
        )
        .slice(0, 4)
    : [];
  
  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;
    if (newQuantity <= 0) {
      // Remove from cart handled by store
      updateCartQuantity(product.id, 0);
    } else {
      updateCartQuantity(product.id, newQuantity);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-pink-50">
        {isMobile && <MobileAppBar title="Product Not Found" />}
        <div className={`container mx-auto px-4 py-16 ${isMobile ? 'pt-24' : 'pt-8'} text-center`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isMobile && <MobileAppBar title={product.name} />}
      
      <div className={`container mx-auto px-4 py-6 ${isMobile ? 'pt-24' : 'pt-8'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">({product.reviewCount} reviews)</span>
                </div>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <div className="mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-pink-500">₹{product.price}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                        {product.discount && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                            {product.discount}% OFF
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  {currentQuantity === 0 ? (
                    <Button
                      onClick={() => {
                        addToCart(product, 1);
                      }}
                      className="flex-1 bg-[#FF6DAA] hover:bg-[#FF9FC6] text-white"
                      style={{ transition: 'none' }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex-1 flex items-center gap-3 bg-[#FF6DAA] text-white rounded-lg px-4 py-3">
                      <button
                        onClick={() => handleQuantityChange(currentQuantity - 1)}
                        className="w-8 h-8 rounded-full bg-white/25 hover:bg-white/35 flex items-center justify-center"
                        style={{ transition: 'none' }}
                      >
                        <Minus className="w-4 h-4 text-white font-bold" />
                      </button>
                      <span className="text-base font-bold text-white min-w-[24px] text-center">
                        {currentQuantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(currentQuantity + 1)}
                        className="w-8 h-8 rounded-full bg-white/25 hover:bg-white/35 flex items-center justify-center"
                        style={{ transition: 'none' }}
                      >
                        <Plus className="w-4 h-4 text-white font-bold" />
                      </button>
                    </div>
                  )}
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        
          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1F1F1F] mb-6">
                Similar Sweets You'll Love
              </h2>
              
              {/* Horizontal Scroll Container - One Row Only */}
              <div className="overflow-x-auto md:overflow-x-visible -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 min-w-max md:min-w-0 pb-2 md:pb-0">
                  {similarProducts.map((sweet) => (
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
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
