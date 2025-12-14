import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from './button';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface CartItemCardProps {
  item: any;
  className?: string;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  className,
}) => {
  const { updateCartQuantity, removeFromCart } = useStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateCartQuantity(item.id, newQuantity);
    }
  };

  const discountPercentage = item.originalPrice 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : item.discount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white rounded-xl p-4 shadow-card border border-light-grey/30 hover:shadow-floating transition-all duration-300',
        className
      )}
    >
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <Link to={`/product/${item.id}`} className="flex-shrink-0">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F5F6FA]">
            {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full items-center justify-center bg-[#F5F6FA]" style={{ display: item.image ? 'none' : 'flex' }}>
              <svg className="w-6 h-6 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link to={`/product/${item.id}`}>
            <h3 className="font-bold text-dark-grey text-sm line-clamp-2 hover:text-brand-green transition-colors">
              {item.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">{item.unit}</p>
          
          {/* Price Section */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="font-bold text-lg text-dark-grey">₹{item.price}</span>
            {item.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{item.originalPrice}
              </span>
            )}
            {discountPercentage && discountPercentage > 0 && (
              <span className="text-xs bg-accent-red text-white px-2 py-1 rounded-full font-semibold">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-light-grey/50 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="h-8 w-8 hover:bg-white/80 transition-all duration-200"
            >
              <Minus className="w-4 h-4 text-dark-grey" />
            </Button>
            <span className="text-lg font-bold text-dark-grey min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="h-8 w-8 hover:bg-white/80 transition-all duration-200"
            >
              <Plus className="w-4 h-4 text-dark-grey" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFromCart(item.id)}
            className="h-8 w-8 hover:bg-accent-red/10 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 text-accent-red" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}; 