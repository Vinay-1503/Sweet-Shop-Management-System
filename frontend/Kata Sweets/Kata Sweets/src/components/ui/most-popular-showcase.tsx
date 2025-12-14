// Most Popular Sweet Showcase Section
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

export const MostPopularShowcase = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      ref={ref}
      className={cn(
        'bg-white py-16 md:py-20 transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          {/* LEFT COLUMN - Text Content */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Small Section Label */}
            <p className="text-sm md:text-base font-semibold text-[#FF6DAA] uppercase tracking-wide">
              Our Best Work
            </p>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1F1F] leading-tight">
              If you visit our store, this is the one sweet you absolutely must try.
            </h2>

            {/* Sweet Name */}
            <h3 className="text-2xl md:text-3xl font-bold text-[#FF6DAA]">
              Confetti Cake
            </h3>

            {/* Supporting Paragraph */}
            <p className="text-lg md:text-xl text-[#1F1F1F]/80 leading-relaxed">
              Joyful, vibrant, and irresistibly soft, our Confetti Cake is the celebration everyone comes back for. Baked fresh with layers of fluffy sponge and finished with a smooth, creamy frosting, every slice is filled with colourful sprinkles that turn simple moments into celebrations.
            </p>

            <p className="text-lg md:text-xl text-[#1F1F1F]/80 leading-relaxed">
              This cake isn't just popular — it's unforgettable. Loved by kids, chosen for birthdays, and often the first to sell out, it has become the heart of our dessert collection. If you don't try this, you truly miss out on what makes our store special.
            </p>

            {/* Optional Line */}
            <p className="text-lg md:text-xl font-semibold text-[#FF6DAA] italic">
              A celebration in every slice.
            </p>
          </div>

          {/* RIGHT COLUMN - Image */}
          <div className="relative">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80&auto=format&fit=crop"
                alt="Confetti Cake - A vibrant funfetti cake with colorful sprinkles, layers of fluffy sponge and creamy frosting"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

