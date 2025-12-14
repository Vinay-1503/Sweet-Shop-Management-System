/**
 * Section Divider Component - Soft gradient transitions between sections
 */
import React from 'react';

interface SectionDividerProps {
  variant?: 'pink-to-white' | 'white-to-pink' | 'red-to-white' | 'white-to-red';
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'pink-to-white',
  className = '',
}) => {
  const gradients = {
    'pink-to-white': 'linear-gradient(to bottom, #FFD1E3, #FFFFFF)',
    'white-to-pink': 'linear-gradient(to bottom, #FFFFFF, #FFD1E3)',
    'red-to-white': 'linear-gradient(to bottom, #C83A3A, #FFFFFF)',
    'white-to-red': 'linear-gradient(to bottom, #FFFFFF, #C83A3A)',
  };

  return (
    <div
      className={`h-[60px] w-full ${className}`}
      style={{
        background: gradients[variant],
      }}
    />
  );
};

