import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface MobileAppBarProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
  showLogo?: boolean;
}

export const MobileAppBar: React.FC<MobileAppBarProps> = ({
  title,
  showBackButton = true,
  onBack,
  className,
  showLogo = false
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div 
      className={cn(
      "mobile-appbar mobile-page-header mobile-header fixed top-0 left-0 right-0 z-50 bg-[#FF6DAA] shadow-lg",
      className
      )}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side - Back Button */}
        <div className="flex items-center">
          {showBackButton && (
            <button
              type="button"
              onClick={handleBack}
              className="h-10 w-10 rounded-full bg-[#FF6DAA] hover:bg-[#FF9FC6] transition-all mr-3 border border-white/20 shadow-md flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Center - Page Title */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-white truncate px-4">
            {title}
          </h1>
        </div>

        {/* Right Side - Spacer for balance */}
        <div className="w-10"></div>
      </div>
      {/* Primary Blue Accent Line */}
      <div className="h-1 bg-primary-hover"></div>
    </div>
  );
}; 