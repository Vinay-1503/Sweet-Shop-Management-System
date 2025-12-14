// Simplified category card for luxury dessert store
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface UnifiedCategoryCardProps {
  category: {
    id: string;
    name: string;
    image: string;
    description?: string;
    productCount?: number;
  };
  className?: string;
}

export const UnifiedCategoryCard: React.FC<UnifiedCategoryCardProps> = ({
  category,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={cn("h-full w-full", className)}
    >
      <Link 
        to={`/products?category=${category.id}`}
        className="block h-full"
      >
        <div 
          className="relative bg-white rounded-2xl p-4 cursor-pointer border border-[#F3E1EA] hover:border-[#FF6DAA] hover:shadow-md transition-all duration-300 h-full flex flex-col items-center text-center"
        >
          {/* Category Image */}
          <div className="relative w-20 h-20 mb-3 flex items-center justify-center overflow-hidden rounded-xl bg-[#FFD1E3]/20">
            {category.image && !imageError ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover rounded-xl"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-[#FFD1E3]/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🍬</span>
              </div>
            )}
          </div>
          
          {/* Category Name */}
          <h3 className="font-semibold text-[#1F1F1F] text-sm leading-tight">
            {category.name}
          </h3>
          
          {/* Product Count (optional) */}
          {category.productCount !== undefined && (
            <p className="text-xs text-[#1F1F1F] opacity-60 mt-1">
              {category.productCount} items
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
