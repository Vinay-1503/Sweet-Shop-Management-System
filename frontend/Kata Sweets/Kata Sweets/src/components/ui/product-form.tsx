/**
 * Product Form Component - Used for both Create and Edit
 */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Product } from '@/store/useStore';
import { mockCategories } from '@/data/mockSweets';

interface ProductFormProps {
  product?: Product; // If provided, form is in edit mode
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  inStock: boolean;
  rating: string;
  reviewCount: string;
  discount: string;
  tags: string;
  image: File | null;
  imageUrl?: string; // For existing products
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    originalPrice: product?.originalPrice?.toString() || '',
    category: product?.category || '',
    inStock: product?.inStock ?? true,
    rating: product?.rating?.toString() || '4.5',
    reviewCount: product?.reviewCount?.toString() || '0',
    discount: product?.discount?.toString() || '',
    tags: product?.tags?.join(', ') || '',
    image: null,
    imageUrl: product?.image,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange('image', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.rating || parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    if (!formData.reviewCount || parseInt(formData.reviewCount) < 0) {
      newErrors.reviewCount = 'Review count must be 0 or greater';
    }

    // Image is required only for new products
    if (!product && !formData.image && !formData.imageUrl) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Image */}
      <div>
        <Label htmlFor="image" className="text-[#1F1F1F]">
          Product Image <span className="text-red-500">*</span>
        </Label>
        <div className="mt-2">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg mb-2 border border-[#F3E1EA]"
            />
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>
      </div>

      {/* Product Name */}
      <div>
        <Label htmlFor="name" className="text-[#1F1F1F]">
          Product Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Kaju Katli"
          className="mt-1"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-[#1F1F1F]">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the product..."
          rows={4}
          className="mt-1"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Price and Original Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-[#1F1F1F]">
            Cost (₹) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="450"
            className="mt-1"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <Label htmlFor="originalPrice" className="text-[#1F1F1F]">
            Original Price (₹)
          </Label>
          <Input
            id="originalPrice"
            type="number"
            step="0.01"
            value={formData.originalPrice}
            onChange={(e) => handleChange('originalPrice', e.target.value)}
            placeholder="500"
            className="mt-1"
          />
        </div>
      </div>

      {/* Discount */}
      <div>
        <Label htmlFor="discount" className="text-[#1F1F1F]">
          Discount (%)
        </Label>
        <Input
          id="discount"
          type="number"
          step="0.01"
          value={formData.discount}
          onChange={(e) => handleChange('discount', e.target.value)}
          placeholder="10"
          className="mt-1"
        />
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category" className="text-[#1F1F1F]">
          Category <span className="text-red-500">*</span>
        </Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-[#F3E1EA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6DAA]"
        >
          <option value="">Select category</option>
          {mockCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* Stock Status */}
      <div>
        <Label htmlFor="inStock" className="text-[#1F1F1F]">
          Stock Status <span className="text-red-500">*</span>
        </Label>
        <select
          id="inStock"
          value={formData.inStock ? 'true' : 'false'}
          onChange={(e) => handleChange('inStock', e.target.value === 'true')}
          className="mt-1 w-full px-3 py-2 border border-[#F3E1EA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6DAA]"
        >
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      {/* Rating and Review Count */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rating" className="text-[#1F1F1F]">
            Rating <span className="text-red-500">*</span>
          </Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) => handleChange('rating', e.target.value)}
            placeholder="4.5"
            className="mt-1"
          />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        <div>
          <Label htmlFor="reviewCount" className="text-[#1F1F1F]">
            Review Count <span className="text-red-500">*</span>
          </Label>
          <Input
            id="reviewCount"
            type="number"
            min="0"
            value={formData.reviewCount}
            onChange={(e) => handleChange('reviewCount', e.target.value)}
            placeholder="100"
            className="mt-1"
          />
          {errors.reviewCount && (
            <p className="text-red-500 text-sm mt-1">{errors.reviewCount}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label htmlFor="tags" className="text-[#1F1F1F]">
          Tags (comma-separated)
        </Label>
        <Input
          id="tags"
          type="text"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="popular, featured, traditional"
          className="mt-1"
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[#FF6DAA] hover:bg-[#FF9FC6] text-white"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 border-[#FF6DAA] text-[#FF6DAA]"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

