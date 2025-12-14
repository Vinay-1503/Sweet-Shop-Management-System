import { apiRequest } from '@/lib/api';
import { CategoryApiResponse, CategoryApiData, Category } from '@/types/category';

/**
 * Fetches categories from the API
 */
export const fetchCategories = async (): Promise<CategoryApiData[]> => {
  try {
    const response = await apiRequest('/api/GetCategories');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data: CategoryApiResponse = await response.json();
    
    // Check if API returned success
    if (data.status !== 0) {
      throw new Error(data.message || 'Failed to fetch categories');
    }

    // Return empty array if no data
    if (!data.data || data.data.length === 0) {
      return [];
    }

    return data.data;
  } catch (error) {
    // Only log in development mode - return empty array silently
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching categories:', error);
    }
    return [];
  }
};

/**
 * Transforms API category data to UI category format
 * Maps API response to the format expected by UnifiedCategoryCard component
 */
export const transformCategoryData = (apiCategory: CategoryApiData): Category => {
  // Map category name to an appropriate emoji icon for compatibility
  // You can enhance this with a proper icon mapping or use CategoryImage
  const iconMap: Record<string, string> = {
    'Juices': '🍹',
    'Snacks': '🍿',
    'Dry Fruits': '🥜',
    'Fruit Crush': '🍹',
    'Flours and Grains': '🌾',
    'Ready to Cook': '🍳',
    'Pooja Needs': '🕉️',
    'Ghee & Vanaspati': '🧈',
    'Salt/Sugar/Jaggery': '🧂',
    'Detergents and Cleaning Products': '🧽',
    'Others': '📦',
  };

  const icon = iconMap[apiCategory.CategoryName] || '📦';

  return {
    id: apiCategory.Id.toString(),
    name: apiCategory.CategoryName,
    slug: apiCategory.Slug,
    subtitle: apiCategory.CategorySubtitle || undefined,
    image: apiCategory.CategoryImage || undefined,
    icon, // For compatibility with existing UI that expects an icon
  };
};

/**
 * Fetches and transforms categories for UI use
 */
export const getCategories = async (): Promise<Category[]> => {
  const apiCategories = await fetchCategories();
  return apiCategories.map(transformCategoryData);
};

