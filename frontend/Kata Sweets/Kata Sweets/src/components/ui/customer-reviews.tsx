// Customer Reviews Section - Trust building testimonials
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface Review {
  id: number;
  customerName: string;
  reviewText: string;
  rating: number;
}

const reviews: Review[] = [
  {
    id: 1,
    customerName: 'Christina',
    reviewText: 'You have never steered me wrong, and this cake is no exception! I first found your website on my daughter\'s first birthday (4 years ago), and I swore it was the best cake I\'ve ever made! Since then, I have used recipes from your website for every family birthday cake I\'ve made. This one is another hit and possibly my daughter\'s (now her fifth birthday cake) new favorite!',
    rating: 5
  },
  {
    id: 2,
    customerName: 'Sarah Johnson',
    reviewText: 'Absolutely amazing quality! The sweets arrived fresh and beautifully packaged. My family loved every single item. Will definitely order again for our next celebration.',
    rating: 5
  },
  {
    id: 3,
    customerName: 'Michael Chen',
    reviewText: 'The best sweet shop I\'ve discovered! Every product is crafted with such care and attention to detail. The Confetti Cake was a huge hit at my daughter\'s birthday party.',
    rating: 5
  }
];

export const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentReview = reviews[currentIndex];
  const { ref, isVisible } = useScrollAnimation(0.1);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={ref}
      className={cn(
        'bg-white py-16 md:py-20 transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F1F1F] text-center mb-8">
          Happy Customers
        </h2>

        {/* Review Content */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-[#F3E1EA] flex items-center justify-center hover:border-[#FF6DAA] hover:bg-[#FFD1E3]/20"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5 text-[#1F1F1F]" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-[#F3E1EA] flex items-center justify-center hover:border-[#FF6DAA] hover:bg-[#FFD1E3]/20"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5 text-[#1F1F1F]" />
          </button>

          {/* Review Content Container */}
          <div className="text-center px-8 md:px-16">
            {/* Star Rating */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 md:w-6 md:h-6 fill-[#FF6DAA] text-[#FF6DAA]"
                />
              ))}
            </div>

            {/* Review Text */}
            <blockquote className="text-lg md:text-xl lg:text-2xl text-[#1F1F1F] leading-relaxed mb-8 font-light">
              &ldquo;{currentReview.reviewText}&rdquo;
            </blockquote>

            {/* Customer Name */}
            <p className="text-base md:text-lg font-medium text-[#1F1F1F] mb-4">
              {currentReview.customerName}
            </p>

            {/* Pagination Indicator */}
            <p className="text-sm text-[#6F6F6F]">
              {currentIndex + 1} / {reviews.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

