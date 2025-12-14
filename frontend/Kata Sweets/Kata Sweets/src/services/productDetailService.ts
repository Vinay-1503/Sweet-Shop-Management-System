import { apiRequest } from '@/lib/api';
import { ProductDetailsApiResponse, ProductDetailsData, ProductApiItem } from '@/types/product';
import { Product } from '@/store/useStore';
import { transformProductData, fetchProducts } from './productService';

/**
 * Fetches product details from the API
 */
export const fetchProductDetails = async (productId: string): Promise<ProductDetailsData> => {
  try {
    const response = await apiRequest(`/api/GetProductDetails?ProductId=${productId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product details: ${response.statusText}`);
    }

    const data: ProductDetailsApiResponse = await response.json();
    
    // Check if API returned success (status: 0 means success for GetProductDetails)
    if (data.status !== 0) {
      throw new Error(data.message || 'Failed to fetch product details');
    }

    if (!data.data) {
      throw new Error('Product details not found');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

/**
 * Transforms product details API data to UI Product format
 */
export const transformProductDetailsData = (apiProductDetails: ProductDetailsData): Product => {
  const rate = parseFloat(apiProductDetails.Rate) || 0;
  const discountedPrice = parseFloat(apiProductDetails.DiscountedPrice) || 0;
  const originalPrice = discountedPrice > 0 && discountedPrice < rate ? rate : undefined;
  const finalPrice = discountedPrice > 0 && discountedPrice < rate ? discountedPrice : rate;
  
  // Calculate discount percentage
  const discount = originalPrice && discountedPrice > 0
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : undefined;

  // Check if product is in stock - use parseFloat to handle decimal strings like "280.00"
  const availableStock = Math.floor(parseFloat(apiProductDetails.AvailableStock) || 0);
  const inStock = availableStock > 0 && apiProductDetails.ProductStatus === 'active';

  // Get the first variant if available, otherwise use main product data
  const firstVariant = apiProductDetails.Variants && apiProductDetails.Variants.length > 0
    ? apiProductDetails.Variants[0]
    : null;

  // For variants: Use variant's Price as MRP and DiscountedPrice as final price
  // For main product: Use Rate as MRP and DiscountedPrice as final price
  let finalPriceFromVariant = finalPrice;
  let originalPriceFromVariant = originalPrice;
  let unit = apiProductDetails.Units || 'piece';

  if (firstVariant) {
    const variantPrice = parseFloat(firstVariant.Price) || 0;
    const variantDiscountedPrice = parseFloat(firstVariant.DiscountedPrice) || 0;
    
    // Variant has discount if DiscountedPrice exists and is less than Price
    if (variantDiscountedPrice > 0 && variantDiscountedPrice < variantPrice) {
      finalPriceFromVariant = variantDiscountedPrice;
      originalPriceFromVariant = variantPrice;
    } else {
      // No discount, use Price as final price
      finalPriceFromVariant = variantPrice || finalPrice;
      originalPriceFromVariant = undefined;
    }
    
    unit = firstVariant.Unit || unit;
  }

  // Extract tags from Meta.Keywords if available
  const tags = apiProductDetails.Meta?.Keywords 
    ? (Array.isArray(apiProductDetails.Meta.Keywords) 
        ? apiProductDetails.Meta.Keywords 
        : typeof apiProductDetails.Meta.Keywords === 'string' 
          ? apiProductDetails.Meta.Keywords.split(',').map(t => t.trim()).filter(Boolean)
          : [])
    : [];

  // Recalculate discount based on final prices
  const finalDiscount = originalPriceFromVariant && finalPriceFromVariant > 0
    ? Math.round(((originalPriceFromVariant - finalPriceFromVariant) / originalPriceFromVariant) * 100)
    : discount;

  return {
    id: apiProductDetails.ProductID,
    name: apiProductDetails.ProductName,
    description: apiProductDetails.Description || '',
    price: finalPriceFromVariant,
    originalPrice: originalPriceFromVariant && originalPriceFromVariant > finalPriceFromVariant 
      ? originalPriceFromVariant 
      : undefined,
    image: apiProductDetails.MainImage || '',
    category: apiProductDetails.Category || 'uncategorized',
    unit: unit,
    inStock: inStock,
    rating: 4.5, // Default rating - can be updated if API provides rating data
    reviewCount: 0, // Default review count - can be updated if API provides review data
    discount: finalDiscount,
    tags: tags,
  };
};

/**
 * Fetches and transforms product details for UI use
 */
export const getProductDetails = async (productId: string): Promise<Product> => {
  const apiProductDetails = await fetchProductDetails(productId);
  return transformProductDetailsData(apiProductDetails);
};

/**
 * Fetches similar products based on category, brands, tags, and productType
 */
export const fetchSimilarProducts = async (
  currentProductId: string,
  category: string,
  brands?: string,
  tags?: string[],
  productType?: string
): Promise<Product[]> => {
  try {
    // Fetch all products
    const allProducts = await fetchProducts();
    
    // Filter similar products based on multiple criteria
    const similarProducts = allProducts
      .filter((product: ProductApiItem) => {
        // Exclude current product
        if (product.ProductID === currentProductId) {
          return false;
        }

        // Must be active
        if (product.ProductStatus !== 'active') {
          return false;
        }

        let matchScore = 0;

        // Category match (highest priority - 4 points)
        if (product.Category === category) {
          matchScore += 4;
        }

        // Brand match (3 points)
        if (brands && product.Brands && product.Brands.toLowerCase() === brands.toLowerCase()) {
          matchScore += 3;
        }

        // ProductType match (2 points)
        if (productType && product.ProductType && product.ProductType.toLowerCase() === productType.toLowerCase()) {
          matchScore += 2;
        }

        // Tags match (1 point per matching tag)
        if (tags && tags.length > 0 && product.Tags && product.Tags.length > 0) {
          const matchingTags = product.Tags.filter(tag => 
            tags.some(t => t.toLowerCase() === tag.toLowerCase())
          );
          matchScore += matchingTags.length;
        }

        // Only include products with at least one match (category match is minimum)
        return matchScore >= 4; // At least category match
      })
      .sort((a, b) => {
        // Calculate match scores for sorting
        const getScore = (product: ProductApiItem) => {
          let score = 0;
          if (product.Category === category) score += 4;
          if (brands && product.Brands && product.Brands.toLowerCase() === brands.toLowerCase()) score += 3;
          if (productType && product.ProductType && product.ProductType.toLowerCase() === productType.toLowerCase()) score += 2;
          if (tags && product.Tags) {
            const matchingTags = product.Tags.filter(tag => 
              tags.some(t => t.toLowerCase() === tag.toLowerCase())
            );
            score += matchingTags.length;
          }
          return score;
        };

        return getScore(b) - getScore(a); // Sort by highest match score
      })
      .slice(0, 8); // Limit to 8 similar products

    // Transform to UI format
    return similarProducts.map(transformProductData);
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return [];
  }
};

