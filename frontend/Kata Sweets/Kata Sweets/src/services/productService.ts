/**
 * Product Service - CRUD operations for products
 */
import { apiRequest, getAuthHeader } from '@/lib/api';
import { Product } from '@/store/useStore';

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string; // Base64 or URL
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  discount?: number;
  tags?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductApiResponse {
  success: boolean;
  message?: string;
  data?: Product | Product[];
}

/**
 * Create a new product
 */
export const createProduct = async (productData: CreateProductRequest): Promise<ProductApiResponse> => {
  try {
    const response = await apiRequest('/api/products/create', {
      method: 'POST',
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Product created successfully',
        data: data.data || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to create product',
      };
    }
  } catch (error: any) {
    console.error('Error creating product:', error);
    return {
      success: false,
      message: error.message || 'Network error while creating product',
    };
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (productId: string, productData: Partial<CreateProductRequest>): Promise<ProductApiResponse> => {
  try {
    const response = await apiRequest(`/api/products/update/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Product updated successfully',
        data: data.data || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to update product',
      };
    }
  } catch (error: any) {
    console.error('Error updating product:', error);
    return {
      success: false,
      message: error.message || 'Network error while updating product',
    };
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: string): Promise<ProductApiResponse> => {
  try {
    const response = await apiRequest(`/api/products/delete/${productId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to delete product',
      };
    }
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      message: error.message || 'Network error while deleting product',
    };
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (productId: string): Promise<ProductApiResponse> => {
  try {
    const response = await apiRequest(`/api/products/${productId}`, {
      method: 'GET',
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data.data || data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch product',
      };
    }
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return {
      success: false,
      message: error.message || 'Network error while fetching product',
    };
  }
};
