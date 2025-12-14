// Circular category card for premium sweet store
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CircularCategoryCardProps {
  category: {
    id: string;
    name: string;
    image: string;
  };
}

export const CircularCategoryCard: React.FC<CircularCategoryCardProps> = ({
  category,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer"
    >
      <Link 
        to={`/products?category=${category.id}`}
        className="block"
      >
        <div className="flex flex-col items-center text-center">
          {/* Circular Image */}
          <div className="relative w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] mb-4 rounded-full overflow-hidden border-2 border-[#F3E1EA] transition-all duration-300 hover:border-[#FF6DAA] hover:shadow-lg">
            {category.image && !imageError ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-[#FFD1E3]/20 flex items-center justify-center">
                <span className="text-3xl">🍬</span>
              </div>
            )}
          </div>
          
          {/* Category Name */}
          <p className="text-base font-medium text-[#1F1F1F] leading-tight">
            {category.name}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

