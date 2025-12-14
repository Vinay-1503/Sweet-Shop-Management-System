/**
 * Products Page - Grid/Table view with role-based access
 */
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileAppBar } from '@/components/ui/mobile-appbar';
import { UnifiedProductCard } from '@/components/ui/unified-product-card';
import { useMobile } from '@/hooks/use-mobile';
import { useMobileHeaderOffset } from '@/hooks/use-mobile-header-offset';
import { useStore } from '@/store/useStore';
import { mockSweets, mockCategories } from '@/data/mockSweets';
import { getRoleFromToken, getStoredToken } from '@/utils/jwt';
import { deleteProduct } from '@/services/productService';
import { Plus, Grid3x3, Table2, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { Product } from '@/store/useStore';

type ViewMode = 'grid' | 'table';

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFilter = searchParams.get('category');
  const { isMobile } = useMobile();
  useMobileHeaderOffset();
  const { isAuthenticated } = useStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check user role
  useEffect(() => {
    if (isAuthenticated) {
      const token = getStoredToken();
      const role = getRoleFromToken(token);
      setIsAdmin(role === 'ADMIN');
      
      // Admin defaults to grid view, but can switch to table
      // User always sees grid view
      if (role !== 'ADMIN') {
        setViewMode('grid');
      }
    }
  }, [isAuthenticated]);

  // Filter products by category if specified
  const filteredProducts = categoryFilter
    ? mockSweets.filter(sweet => sweet.category === categoryFilter)
    : mockSweets;

  const handleDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteProduct(productToDelete);
      
      if (response.success) {
        toast.success('Product deleted successfully');
        // In a real app, you'd refresh the products list here
        // For now, we'll just close the dialog
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } else {
        toast.error(response.message || 'Failed to delete product');
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'An error occurred while deleting the product');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {isMobile && <MobileAppBar title="Products" />}
      
      <div className={`container mx-auto px-4 py-6 ${isMobile ? 'pt-24' : 'pt-8'}`}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1F1F1F]">
              {categoryFilter
                ? mockCategories.find(c => c.id === categoryFilter)?.name || 'Products'
                : 'Products'}
            </h1>
            {categoryFilter && (
              <p className="text-[#6F6F6F] mt-1">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle - Admin Only */}
            {isAdmin && (
              <div className="flex items-center gap-2 border border-[#F3E1EA] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-[#FF6DAA] text-white'
                      : 'text-[#1F1F1F] hover:bg-[#FFD1E3]/30'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded ${
                    viewMode === 'table'
                      ? 'bg-[#FF6DAA] text-white'
                      : 'text-[#1F1F1F] hover:bg-[#FFD1E3]/30'
                  }`}
                >
                  <Table2 className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Create Product Button - Admin Only */}
            {isAdmin && (
              <Link to="/products/create">
                <Button className="bg-[#FF6DAA] hover:bg-[#FF9FC6] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map((sweet) => (
              <UnifiedProductCard
                key={sweet.id}
                product={{
                  id: sweet.id,
                  name: sweet.name,
                  description: sweet.description,
                  price: sweet.price,
                  originalPrice: sweet.originalPrice,
                  image: sweet.image,
                  category: sweet.category,
                  inStock: sweet.inStock,
                  rating: sweet.rating,
                  reviewCount: sweet.reviewCount,
                  discount: sweet.discount,
                  tags: sweet.tags,
                }}
              />
            ))}
          </div>
        )}

        {/* Table View - Admin Only */}
        {viewMode === 'table' && isAdmin && (
          <div className="bg-white rounded-lg shadow-sm border border-[#F3E1EA] overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FFF7EC]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F1F1F]">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F1F1F]">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F1F1F]">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F1F1F]">Cost</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F1F1F]">Discount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F1F1F]">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F1F1F]">Ratings</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F1F1F]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3E1EA]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FFF7EC]/30">
                    <td className="px-4 py-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#1F1F1F]">{product.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#6F6F6F] max-w-xs truncate">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#FF6DAA]">₹{product.price}</div>
                      {product.originalPrice && (
                        <div className="text-xs text-[#6F6F6F] line-through">
                          ₹{product.originalPrice}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.discount ? (
                        <span className="bg-[#FFD1E3] text-[#FF6DAA] px-2 py-1 rounded text-xs font-semibold">
                          {product.discount}%
                        </span>
                      ) : (
                        <span className="text-[#6F6F6F] text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.inStock ? (
                        <span className="text-green-600 text-sm font-medium">In Stock</span>
                      ) : (
                        <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-[#1F1F1F] font-medium">
                          {product.rating}
                        </span>
                        <span className="text-xs text-[#6F6F6F]">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/products/edit/${product.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#FF6DAA] hover:text-[#FF6DAA] hover:bg-[#FFD1E3]/30"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(product.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#6F6F6F] text-lg">No products found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
