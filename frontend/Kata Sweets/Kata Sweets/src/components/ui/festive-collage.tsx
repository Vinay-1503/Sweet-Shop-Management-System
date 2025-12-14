// Premium Festive Collage Section - Circular/Radial Layout
import { useState, useEffect } from 'react';

const festiveImages = [
  '/festiveSweetHampers/sweet1.jpg',
  '/festiveSweetHampers/sweet2.avif',
  '/festiveSweetHampers/sweet3.jpg',
  '/festiveSweetHampers/sweet4.png',
  '/festiveSweetHampers/sweet5.jpeg',
  '/festiveSweetHampers/sweet6.jpg',
];

export const FestiveCollage = () => {
  const [radius, setRadius] = useState(180);
  const [surroundingSize, setSurroundingSize] = useState(140);
  const [santaSize, setSantaSize] = useState(180);
  const { ref, isVisible } = useScrollAnimation(0.1);

  useEffect(() => {
    const updateSizes = () => {
      if (window.innerWidth < 768) {
        setRadius(130);
        setSurroundingSize(110);
        setSantaSize(160);
      } else {
        setRadius(180);
        setSurroundingSize(140);
        setSantaSize(180);
      }
    };
    
    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  // Calculate positions for surrounding images in a perfect circle
  // Equal angular spacing: 360 degrees / number of images
  const getImagePosition = (index: number, total: number, radius: number) => {
    // Start from top (12 o'clock) and distribute evenly
    const angleStep = (2 * Math.PI) / total;
    const angle = (index * angleStep) - (Math.PI / 2); // -90 degrees to start at top
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <section
      ref={ref}
      className={cn(
        'py-16 md:py-20 relative overflow-hidden transition-all duration-500 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{
        background: 'linear-gradient(135deg, #C83A3A 0%, #B72626 100%)'
      }}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Special Sale Caption */}
        <div className="text-center mb-6 md:mb-8">
          <p className="text-lg md:text-xl font-semibold text-[#FFD700] uppercase tracking-wide">
            Special Candy Sale for this Christmas
          </p>
        </div>

        {/* Mobile: Show caption first */}
        <div className="md:hidden text-center mb-6">
          <h2 className="text-3xl font-bold text-[#FFF7EC] mb-2">
            Our Presents, Children's Smiles
          </h2>
          <p className="text-lg text-[#FFD700]/90 font-light">
            <span className="text-[#FFD700] font-semibold">Sweet</span> moments that make Christmas unforgettable.
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-center min-h-[400px] md:min-h-[600px]">
          
          {/* LEFT COLUMN - Christmas Tree */}
          <div className="hidden md:flex items-center justify-center h-full">
            <div className="relative w-full max-w-[300px] mx-auto">
              <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                <img
                  src="/festiveSweetHampers/ChristmasTree.png"
                  alt="Festive Christmas tree with warm lights"
                  className="w-full h-full object-cover opacity-90"
                  style={{
                    filter: 'brightness(1.05) contrast(0.95)',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* CENTER COLUMN - Circular Collage */}
          <div className="col-span-3 md:col-span-1 flex justify-center items-center">
            <div 
              className="relative mx-auto"
              style={{
                width: '100%',
                maxWidth: '500px',
                aspectRatio: '1',
                position: 'relative',
              }}
            >
              {/* Center Image - Santa (Perfectly Centered, Slightly Larger) */}
              <div
                className="festive-santa-center"
                style={{
                  width: `${santaSize * 1.1}px`,
                  height: `${santaSize * 1.1}px`,
                }}
              >
                <img
                  src="/Santa.jpg"
                  alt="Santa Claus"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Surrounding Images - Perfect Circular Pattern (Equal Size, Equal Spacing) */}
              {festiveImages.map((image, index) => {
                const position = getImagePosition(index, festiveImages.length, radius * 1.1);
                return (
                  <div
                    key={index}
                    className="festive-surrounding-image"
                    style={{
                      width: `${surroundingSize * 1.1}px`,
                      height: `${surroundingSize * 1.1}px`,
                      left: `calc(50% + ${position.x}px)`,
                      top: `calc(50% + ${position.y}px)`,
                    }}
                  >
                    <img
                      src={image}
                      alt={`Festive sweet hamper ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN - Festive Quote */}
          <div className="hidden md:flex flex-col items-start justify-center h-full px-4">
            <div className="space-y-4">
              {/* Decorative sparkles */}
              <div className="flex gap-2 mb-2">
                <span className="text-[#FFD700] text-xl">✨</span>
                <span className="text-[#FFD700] text-lg">⭐</span>
                <span className="text-[#FFD700] text-xl">✨</span>
              </div>
              
              {/* Main Quote */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#FFF7EC] leading-tight">
                Every smile begins with a little sweetness.
              </h2>
              
              {/* Subtext */}
              <p className="text-lg md:text-xl text-[#FFD700]/90 font-light italic mt-6">
                <span className="text-[#FFD700] font-semibold not-italic">Sweet</span> moments that make Christmas unforgettable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

