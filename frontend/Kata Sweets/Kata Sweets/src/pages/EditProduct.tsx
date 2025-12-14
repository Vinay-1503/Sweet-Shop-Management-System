/**
 * Edit Product Page - Admin Only
 */
import { useParams, useNavigate } from 'react-router-dom';
import { MobileAppBar } from '@/components/ui/mobile-appbar';
import { ProductForm } from '@/components/ui/product-form';
import { useMobile } from '@/hooks/use-mobile';
import { useMobileHeaderOffset } from '@/hooks/use-mobile-header-offset';
import { useStore } from '@/store/useStore';
import { getProductById, updateProduct } from '@/services/productService';
import { getRoleFromToken, getStoredToken } from '@/utils/jwt';
import { mockSweets } from '@/data/mockSweets';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Product } from '@/store/useStore';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  useMobileHeaderOffset();
  const { isAuthenticated } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const token = getStoredToken();
    const role = getRoleFromToken(token);

    if (role !== 'ADMIN') {
      toast.error('Access Denied. Admin privileges required.');
      navigate('/products');
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !isAuthorized) return;

      setIsFetching(true);
      try {
        // Try API first, fallback to mock data
        const response = await getProductById(id);
        
        if (response.success && response.data) {
          setProduct(response.data as Product);
        } else {
          // Fallback to mock data
          const mockProduct = mockSweets.find(p => p.id === id);
          if (mockProduct) {
            setProduct({
              id: mockProduct.id,
              name: mockProduct.name,
              description: mockProduct.description,
              price: mockProduct.price,
              originalPrice: mockProduct.originalPrice,
              image: mockProduct.image,
              category: mockProduct.category,
              inStock: mockProduct.inStock,
              rating: mockProduct.rating,
              reviewCount: mockProduct.reviewCount,
              discount: mockProduct.discount,
              tags: mockProduct.tags,
            });
          } else {
            toast.error('Product not found');
            navigate('/products');
          }
        }
      } catch (error: any) {
        console.error('Error fetching product:', error);
        // Fallback to mock data
        const mockProduct = mockSweets.find(p => p.id === id);
        if (mockProduct) {
          setProduct({
            id: mockProduct.id,
            name: mockProduct.name,
            description: mockProduct.description,
            price: mockProduct.price,
            originalPrice: mockProduct.originalPrice,
            image: mockProduct.image,
            category: mockProduct.category,
            inStock: mockProduct.inStock,
            rating: mockProduct.rating,
            reviewCount: mockProduct.reviewCount,
            discount: mockProduct.discount,
            tags: mockProduct.tags,
          });
        } else {
          toast.error('Product not found');
          navigate('/products');
        }
      } finally {
        setIsFetching(false);
      }
    };

    if (isAuthorized) {
      fetchProduct();
    }
  }, [id, isAuthorized, navigate]);

  const handleSubmit = async (formData: any) => {
    if (!id) return;

    setIsLoading(true);

    try {
      // Convert image to base64 if new file is selected
      let imageUrl = formData.imageUrl || product?.image || '';
      
      if (formData.image) {
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.image);
        });
      }

      // Prepare update data - only include changed fields
      const updateData: any = {};
      
      if (formData.name.trim() !== product?.name) {
        updateData.name = formData.name.trim();
      }
      if (formData.description.trim() !== product?.description) {
        updateData.description = formData.description.trim();
      }
      if (parseFloat(formData.price) !== product?.price) {
        updateData.price = parseFloat(formData.price);
      }
      if (formData.originalPrice && parseFloat(formData.originalPrice) !== product?.originalPrice) {
        updateData.originalPrice = parseFloat(formData.originalPrice);
      }
      if (imageUrl !== product?.image) {
        updateData.image = imageUrl;
      }
      if (formData.category !== product?.category) {
        updateData.category = formData.category;
      }
      if (formData.inStock !== product?.inStock) {
        updateData.inStock = formData.inStock;
      }
      if (parseFloat(formData.rating) !== product?.rating) {
        updateData.rating = parseFloat(formData.rating);
      }
      if (parseInt(formData.reviewCount) !== product?.reviewCount) {
        updateData.reviewCount = parseInt(formData.reviewCount);
      }
      if (formData.discount) {
        const discount = parseFloat(formData.discount);
        if (discount !== product?.discount) {
          updateData.discount = discount;
        }
      }
      
      const tags = formData.tags
        ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];
      
      const tagsChanged = JSON.stringify(tags.sort()) !== JSON.stringify((product?.tags || []).sort());
      if (tagsChanged) {
        updateData.tags = tags;
      }

      const response = await updateProduct(id, updateData);

      if (response.success) {
        toast.success('Product updated successfully!');
        navigate('/products');
      } else {
        toast.error(response.message || 'Failed to update product');
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'An error occurred while updating the product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#1F1F1F]">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {isMobile && <MobileAppBar title="Edit Product" />}
      
      <div className={`container mx-auto px-4 py-6 ${isMobile ? 'pt-24' : 'pt-8'}`}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1F1F1F] mb-6">Edit Product</h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-[#F3E1EA] p-6">
            <ProductForm
              product={product}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

