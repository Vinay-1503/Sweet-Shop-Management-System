/**
 * Create Product Page - Admin Only
 */
import { useNavigate } from 'react-router-dom';
import { MobileAppBar } from '@/components/ui/mobile-appbar';
import { ProductForm } from '@/components/ui/product-form';
import { useMobile } from '@/hooks/use-mobile';
import { useMobileHeaderOffset } from '@/hooks/use-mobile-header-offset';
import { useStore } from '@/store/useStore';
import { createProduct } from '@/services/productService';
import { getRoleFromToken, getStoredToken } from '@/utils/jwt';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  useMobileHeaderOffset();
  const { isAuthenticated } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

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

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);

    try {
      // Convert image to base64 if file is selected
      let imageUrl = formData.imageUrl || '';
      
      if (formData.image) {
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.image);
        });
      }

      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        image: imageUrl,
        category: formData.category,
        inStock: formData.inStock,
        rating: parseFloat(formData.rating),
        reviewCount: parseInt(formData.reviewCount),
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
        tags: formData.tags
          ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
          : undefined,
      };

      const response = await createProduct(productData);

      if (response.success) {
        toast.success('Product created successfully!');
        navigate('/products');
      } else {
        toast.error(response.message || 'Failed to create product');
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'An error occurred while creating the product');
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

  return (
    <div className="min-h-screen bg-white">
      {isMobile && <MobileAppBar title="Create Product" />}
      
      <div className={`container mx-auto px-4 py-6 ${isMobile ? 'pt-24' : 'pt-8'}`}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1F1F1F] mb-6">Create Product</h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-[#F3E1EA] p-6">
            <ProductForm
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

export default CreateProduct;

