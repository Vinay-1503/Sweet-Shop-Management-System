// Simplified Cart page - no checkout, just cart management
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileAppBar } from '@/components/ui/mobile-appbar';
import { useStore } from '@/store/useStore';
import { useMobile } from '@/hooks/use-mobile';
import { useMobileHeaderOffset } from '@/hooks/use-mobile-header-offset';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useStore();
  const { isMobile } = useMobile();
  useMobileHeaderOffset();

  const handleWhatsAppOrder = () => {
    const items = cart.map(item => `${item.name} x${item.quantity}`).join('\n');
    const total = getCartTotal();
    const message = `Hello! I would like to order:\n\n${items}\n\nTotal: ₹${total}`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {isMobile && <MobileAppBar title="Cart" />}
        <div className={`container mx-auto px-4 py-16 ${isMobile ? 'pt-24' : 'pt-8'} text-center`}>
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-4">Your cart is empty</h2>
          <p className="text-[#6F6F6F] mb-8">Add some sweets to get started!</p>
          <Link to="/products">
            <Button className="bg-[#FF6DAA] text-white">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isMobile && <MobileAppBar title="Cart" />}
      
      <div className={`container mx-auto px-4 py-6 ${isMobile ? 'pt-24' : 'pt-8'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[#F3E1EA] last:border-0">
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
                />
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1F1F1F] mb-1">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-[#6F6F6F] mb-2 line-clamp-1">{item.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#FF6DAA]">₹{item.price}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-[#6F6F6F] line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#F3E1EA]/30 rounded-lg">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#FFD1E3]/50"
                    >
                      <Minus className="w-4 h-4 text-[#1F1F1F]" />
                    </button>
                    <span className="w-10 text-center font-semibold text-[#1F1F1F]">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#FFD1E3]/50"
                    >
                      <Plus className="w-4 h-4 text-[#1F1F1F]" />
                    </button>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#FFD1E3]/30 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-[#DC143C]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-[#1F1F1F]">Total:</span>
              <span className="text-2xl font-bold text-[#FF6DAA]">₹{getCartTotal()}</span>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleWhatsAppOrder}
                className="flex-1 bg-[#FF6DAA] text-white py-3 text-base font-semibold"
                style={{ transition: 'none' }}
              >
                Place Order
              </Button>
              
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1 border-2 border-[#FF6DAA] text-[#FF6DAA] py-3 text-base font-semibold"
                style={{ transition: 'none' }}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
