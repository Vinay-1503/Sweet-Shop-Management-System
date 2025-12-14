// Inspirational Dessert Banner - Joyful pause section
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

export const InspirationalBanner = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      ref={ref}
      className={cn(
        'bg-[#FFD1E3] py-16 md:py-20 transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          {/* Image Side - Left on desktop, top on mobile */}
          <div className="order-2 md:order-1">
            <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80&auto=format&fit=crop"
                alt="Colorful assortment of cupcakes, macarons, chocolate truffles, and pastries arranged beautifully on a soft pink background"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text Side - Right on desktop, bottom on mobile */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <div className="space-y-4 md:space-y-6">
              {/* Small label */}
              <p className="text-sm md:text-base font-semibold text-[#1F1F1F]/70 uppercase tracking-wide">
                Best Desserts
              </p>

              {/* Main headline */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1F1F] leading-tight">
                Life is short.
                <br />
                Eat dessert first.
              </h2>

              {/* Secondary line */}
              <p className="text-lg md:text-xl text-[#6F6F6F] font-light">
                From our kitchen to your happiest moments.
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <Button
                  size="lg"
                  className="bg-white text-[#FF6DAA] hover:bg-[#FF6DAA] hover:text-white border-2 border-white px-8 py-6 text-lg font-semibold shadow-sm"
                  onClick={() => navigate('/products')}
                >
                  Discover Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

