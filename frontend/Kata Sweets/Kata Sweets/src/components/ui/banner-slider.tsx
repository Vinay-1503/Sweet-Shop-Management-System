import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { banners } from '@/data/banners';

export const BannerSlider = () => {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((index - 1 + banners.length) % banners.length);
  };

  const next = () => {
    setIndex((index + 1) % banners.length);
  };

  const banner = banners[index];

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative w-full">
        <img
          src={banner.image}
          alt={`Banner ${banner.id}`}
          className="w-full h-auto object-cover"
          loading="lazy"
        />

        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </button>
      </div>
    </section>
  );
};

