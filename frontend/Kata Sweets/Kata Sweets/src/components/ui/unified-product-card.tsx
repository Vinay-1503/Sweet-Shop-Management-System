// Simplified product card for static sweet store - no complex utilities needed
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';
import toast from 'react-hot-toast';

interface UnifiedProductCardProps {
  product: Product;
  className?: string;
  isFestive?: boolean; // Use Christmas red for festive sections
}

export const UnifiedProductCard: React.FC<UnifiedProductCardProps> = ({
  product,
  className,
  isFestive = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, cart, updateCartQuantity } = useStore();
  const { isMobile } = useMobile();

  // Get current quantity in cart
  const cartItem = cart.find(item => item.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const isOutOfStock = !product.inStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (newQuantity <= 0) {
      updateCartQuantity(product.id, 0);
      return;
    }
    
    updateCartQuantity(product.id, newQuantity);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  return (
    <div className={cn('h-full group', className)}>
      <Link 
        to={`/product/${product.id}`} 
        className="block h-full"
      >
        <div 
            className={cn(
              "relative rounded-xl cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border border-[#F3E1EA] hover:border-[#FF6DAA]/30 overflow-hidden h-full flex flex-col bg-white",
            isMobile ? "w-full" : "max-w-full mx-auto"
          )}
        >
          {/* Product Image Container */}
          <div className="relative flex-shrink-0">
            <div className="w-full h-[120px] rounded-t-xl overflow-hidden bg-white">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              {imageError ? (
                <div className="w-full h-full flex items-center justify-center bg-pink-50">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-[10px] text-gray-400">Image unavailable</p>
                  </div>
                </div>
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  className={cn(
                    'w-full h-full object-cover',
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(true);
                  }}
                  loading="lazy"
                />
              )}
            </div>
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-1.5 left-1.5 text-[#FF6DAA] text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FFD1E3] shadow-sm z-10">
                -{discountPercentage}%
              </div>
            )}
            
            {/* Out of Stock Badge */}
            {isOutOfStock && (
              <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white rounded-md px-2 py-1 text-[10px] font-medium z-10">
                Out of Stock
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col px-2 pt-1">
            {/* Product Name */}
            <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 leading-tight text-xs">
              {product.name}
            </h3>
            
            {/* Price */}
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-bold text-[#FF6DAA]">
                ₹{product.price || 0}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            
            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-1 mb-1.5">
                <span className="text-[10px] text-yellow-500">★</span>
                <span className="text-[10px] text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              </div>
            )}
            
            {/* ADD Button / Quantity Controls */}
            <div className="mt-auto pb-1.5">
              {isOutOfStock ? (
                <div className="w-full bg-gray-300 text-gray-600 rounded-lg px-3 py-1.5 text-[11px] font-medium cursor-not-allowed text-center" style={{ height: '34px', minHeight: '34px' }}>
                  Out of Stock
                </div>
              ) : currentQuantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#DC143C] hover:bg-[#B91C1C] text-white rounded-lg px-3 py-1.5 flex items-center justify-center shadow-sm text-[11px] font-semibold"
                  style={{ height: '34px', minHeight: '34px', transition: 'none' }}
                >
                  ADD
                </button>
              ) : (
                <div 
                  className="w-full bg-[#DC143C] text-white rounded-lg flex items-center justify-between gap-3 px-3 py-1.5 shadow-sm" 
                  style={{ height: '34px', minHeight: '34px', maxHeight: '34px' }}
                >
                  <button
                    onClick={(e) => handleUpdateQuantity(e, currentQuantity - 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80"
                    style={{ transition: 'none' }}
                  >
                    <Minus className="w-4 h-4 text-white font-bold" />
                  </button>
                  <span className="text-sm font-bold text-white min-w-[20px] text-center flex-1">
                    {currentQuantity}
                  </span>
                  <button
                    onClick={(e) => handleUpdateQuantity(e, currentQuantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-80"
                    style={{ transition: 'none' }}
                  >
                    <Plus className="w-4 h-4 text-white font-bold" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
