// Mock data for sweet store - luxury dessert theme
export interface MockSweet {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  discount?: number;
  tags?: string[];
  isSugarFree?: boolean;
}

export interface MockCategory {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface MockBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  ctaText?: string;
}

// Mock Categories - Updated to match new structure
export const mockCategories: MockCategory[] = [
  {
    id: 'traditional-mithai',
    name: 'Traditional Mithai',
    image: '/categories/TraditionalMithai.jpg',
    description: 'Classic Indian sweets'
  },
  {
    id: 'sugar-free',
    name: 'Sugar-Free Delights',
    image: '/categories/SugarFreeDelights.webp',
    description: 'Mindful indulgence'
  },
  {
    id: 'premium-sweets',
    name: 'Premium Sweets',
    image: '/categories/PremiumSweets.jpg',
    description: 'Premium sweets'
  },
  {
    id: 'dry-fruits',
    name: 'Dry Fruit Specials',
    image: '/categories/DryFruitSpecials.jpg',
    description: 'Premium dry fruits'
  },
  {
    id: 'gift-boxes',
    name: 'Gift Hampers',
    image: '/categories/GiftHampers.jpg',
    description: 'Curated gift hampers'
  }
];

// Mock Sweets Products - Updated with better descriptions
export const mockSweets: MockSweet[] = [
  {
    id: '1',
    name: 'Kaju Katli',
    description: 'Soft, rich & melt-in-mouth',
    price: 450,
    originalPrice: 500,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f1f86dc8?w=800&q=95&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'traditional-mithai',
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
    discount: 10,
    tags: ['popular', 'gift']
  },
  {
    id: '2',
    name: 'Gulab Jamun',
    description: 'Soft, syrupy & perfectly sweet',
    price: 300,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=95&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'traditional-mithai',
    inStock: true,
    rating: 4.7,
    reviewCount: 89,
    tags: ['popular']
  },
  {
    id: '3',
    name: 'Rasgulla',
    description: 'Spongy, light & refreshing',
    price: 280,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f1f86dc8?w=800&q=95&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'traditional-mithai',
    inStock: true,
    rating: 4.6,
    reviewCount: 156,
    tags: ['popular']
  },
  {
    id: '4',
    name: 'Sugar-Free Kaju Katli',
    description: 'Same richness, zero guilt',
    price: 550,
    originalPrice: 650,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f1f86dc8?w=800&q=95&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'sugar-free',
    inStock: true,
    rating: 4.9,
    reviewCount: 203,
    discount: 15,
    tags: ['premium', 'gift', 'sugar-free'],
    isSugarFree: true
  },
  {
    id: '5',
    name: 'Chocolate Truffles',
    description: 'Luxury Belgian chocolate',
    price: 550,
    originalPrice: 650,
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=95&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'chocolate-desserts',
    inStock: true,
    rating: 4.9,
    reviewCount: 203,
    discount: 15,
    tags: ['premium', 'gift']
  },
  {
    id: '6',
    name: 'Premium Gift Box',
    description: 'Curated selection of best sweets',
    price: 1500,
    originalPrice: 1800,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4b2b3d3a?w=800&q=95&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'gift-boxes',
    inStock: true,
    rating: 4.9,
    reviewCount: 78,
    discount: 17,
    tags: ['gift', 'premium']
  },
  {
    id: '7',
    name: 'Sugar-Free Barfi Mix',
    description: 'Thoughtfully balanced sweetness',
    price: 400,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f1f86dc8?w=800&q=95&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'sugar-free',
    inStock: true,
    rating: 4.5,
    reviewCount: 92,
    tags: ['gift', 'sugar-free'],
    isSugarFree: true
  },
  {
    id: '8',
    name: 'Dry Fruit Mix',
    description: 'Premium nuts & dates',
    price: 800,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4b2b3d3a?w=800&q=95&auto=format&fit=crop&ixlib=rb-4.0.3',
    category: 'dry-fruits',
    inStock: true,
    rating: 4.7,
    reviewCount: 145,
    tags: ['premium']
  },
  {
    id: '9',
    name: 'Red Velvet Cupcake',
    description: 'Classic American favorite with cream cheese frosting',
    price: 180,
    originalPrice: 200,
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&q=95&auto=format&fit=crop',
    category: 'chocolate-desserts',
    inStock: true,
    rating: 4.9,
    reviewCount: 312,
    discount: 10,
    tags: ['popular', 'featured', 'bestseller']
  },
  {
    id: '10',
    name: 'Kesar Badam Milk Cake',
    description: 'Traditional Indian delight with saffron and almonds',
    price: 650,
    originalPrice: 750,
    image: '/FeaturedSweets/kesar-badam.webp',
    category: 'traditional-mithai',
    inStock: true,
    rating: 4.8,
    reviewCount: 189,
    discount: 13,
    tags: ['popular', 'featured', 'traditional']
  },
  {
    id: '11',
    name: 'Texas Pecan Praline',
    description: 'Southern comfort treat with caramelized pecans',
    price: 520,
    originalPrice: 600,
    image: '/FeaturedSweets/Pecan-Pralines-MAIN.jpg',
    category: 'chocolate-desserts',
    inStock: true,
    rating: 4.7,
    reviewCount: 145,
    discount: 13,
    tags: ['popular', 'featured', 'premium']
  },
  {
    id: '12',
    name: 'Belgian Chocolate Truffles',
    description: 'Luxury Belgian chocolate, handcrafted perfection',
    price: 680,
    originalPrice: 800,
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=95&auto=format&fit=crop',
    category: 'chocolate-desserts',
    inStock: true,
    rating: 4.9,
    reviewCount: 267,
    discount: 15,
    tags: ['popular', 'featured', 'premium', 'gift']
  }
];

// Mock Banners - Using luxury dessert images
export const mockBanners: MockBanner[] = [
  {
    id: '1',
    title: 'Sweet moments, crafted with love',
    subtitle: 'Premium mithai & desserts, freshly prepared for every celebration.',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4b2b3d3a?w=1200&q=80&auto=format&fit=crop',
    ctaText: 'Explore Sweets',
    link: '/products'
  },
  {
    id: '2',
    title: 'Festive season presents, wrapped in sweetness',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4b2b3d3a?w=1200&q=80&auto=format&fit=crop',
    ctaText: 'Order Festive Boxes',
    link: '/products?category=gift-boxes'
  },
  {
    id: '3',
    title: 'Traditional Mithai Collection',
    subtitle: 'Gulab Jamun, Rasgulla & more',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4b2b3d3a?w=1200&q=80&auto=format&fit=crop',
    ctaText: 'Shop Traditional',
    link: '/products?category=traditional-mithai'
  },
  {
    id: '4',
    title: 'Premium Chocolate Truffles',
    subtitle: 'Luxury Belgian chocolates',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=1200&q=80&auto=format&fit=crop',
    ctaText: 'Explore Chocolates',
    link: '/products?category=chocolate-desserts'
  }
];
