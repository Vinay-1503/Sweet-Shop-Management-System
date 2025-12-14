import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, CreditCard, Check, Zap, Edit3, Tag, Shield, Truck, User, Phone, Mail, Plus, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileAppBar } from '@/components/ui/mobile-appbar';
import { SearchOverlay } from '@/components/ui/search-overlay';
import { useMobile } from '@/hooks/use-mobile';
import { useMobileHeaderOffset } from '@/hooks/use-mobile-header-offset';
import { Address, useStore } from '@/store/useStore';
import { getActiveDeliverySlots, DeliverySlot } from '@/services/deliveryService';
import { getUserAddresses } from '@/services/addressService';
import { placeOrder, PlaceOrderRequest, PlaceOrderItem } from '@/services/orderService';
import { validateCouponCode, getCouponCodes, CouponCodeItem } from '@/services/couponService';
import toast from 'react-hot-toast';
import { normalizeTo10Digits, toBackendID } from '@/utils/phoneNumber';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, addOrder, user, updateUser, removeFromCart } = useStore();
  const { isMobile } = useMobile();
  useMobileHeaderOffset();
  const checkoutHeaderRef = useRef<HTMLElement>(null);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  // Local state for addresses - fetched directly from API
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ 
    code: string; 
    discount: number; 
    discountType: 'percentage' | 'fixed'; 
    discountAmount: number;
    message?: string 
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<CouponCodeItem[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
  const formatSize = (item: any) => {
    if (item?.variant?.size) {
      return `${item.variant.size}${item.variant.unit ? ` ${item.variant.unit}` : ''}`.trim();
    }
    if (item?.size) {
      return `${item.size}${item.unit ? ` ${item.unit}` : ''}`.trim();
    }
    return item?.unit || '';
  };

  // Update checkout header height CSS variable
  useEffect(() => {
    if (!isMobile && checkoutHeaderRef.current) {
      const updateHeaderHeight = () => {
        if (checkoutHeaderRef.current) {
          const height = checkoutHeaderRef.current.getBoundingClientRect().height;
          document.documentElement.style.setProperty('--checkout-header-height', `${height}px`);
        }
      };

      updateHeaderHeight();
      window.addEventListener('resize', updateHeaderHeight);

      return () => {
        window.removeEventListener('resize', updateHeaderHeight);
      };
    }
  }, [isMobile]);

  // Fetch delivery slots from API
  useEffect(() => {
    const loadDeliverySlots = async () => {
      try {
        setIsLoadingSlots(true);
        const slots = await getActiveDeliverySlots();
        setDeliverySlots(slots);
        
        // Set first slot as default if available
        if (slots.length > 0) {
          setSelectedSlot(slots[0]);
        }
      } catch (error: any) {
        console.error('Error loading delivery slots:', error);
        // Fail silently - show empty slots or default
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading delivery slots:', error);
        }
        // Keep empty array on error
        setDeliverySlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    loadDeliverySlots();
  }, []);

  // Fetch addresses from API when user is available
  useEffect(() => {
    const loadAddresses = async () => {
      console.log('🏠 [Checkout] loadAddresses called');
      console.log('👤 [Checkout] Current user:', user);
      console.log('🆔 [Checkout] User id:', user?.id);
      
      if (!user || !user.id) {
        console.log('⚠️ [Checkout] No user or id, skipping address fetch');
        return;
      }

      try {
        console.log('🔄 [Checkout] Starting to fetch addresses...');
        setIsLoadingAddresses(true);
        // Use userId for API calls - toBackendID will prepend 91 to make it 12 digits
        const userIdForApi = user.id || '';
        console.log('📤 [Checkout] Fetching addresses for userId:', userIdForApi);
        const addresses = await getUserAddresses(userIdForApi);
        
        console.log('📋 [Checkout] Received addresses from API:', addresses);
        console.log('📋 [Checkout] Number of addresses:', addresses.length);
        
        // Store in local state (not in global store)
        setAddresses(addresses);
          
        console.log('✅ [Checkout] Addresses stored in local state');
      } catch (error: any) {
        console.error('❌ [Checkout] Error loading addresses:', error);
        console.error('❌ [Checkout] Error message:', error?.message);
        console.error('❌ [Checkout] Error stack:', error?.stack);
        // Don't show error toast if user has no addresses (empty array is valid)
        if (error.message && !error.message.includes('no record')) {
          // Fail silently
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ [Checkout] Error loading addresses:', error);
          }
        }
      } finally {
        setIsLoadingAddresses(false);
        console.log('🏁 [Checkout] Address loading completed');
      }
    };

    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only fetch when user id changes

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddress.id);
    } else {
      setSelectedAddressId('');
    }
  }, [addresses]);

  // Fetch available coupons for display
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setIsLoadingCoupons(true);
        const data = await getCouponCodes();
        setAvailableCoupons(data.data || []);
        if (data.message) {
          toast.success(data.message);
        }
      } catch (error: any) {
        console.error('❌ [Checkout] Error loading coupon codes:', error);
        setAvailableCoupons([]);
      } finally {
        setIsLoadingCoupons(false);
      }
    };
    loadCoupons();
  }, []);

  const getAddressDisplay = (address: Address) => {
    if (address.fullAddress && address.fullAddress.trim().length > 0) {
      return address.fullAddress;
    }

    const segments = [address.address, address.city, address.state].filter(Boolean);
    const base = segments.join(', ');
    const pincodePart = address.pincode ? ` - ${address.pincode}` : '';
    const landmarkPart = address.landmark ? ` (Landmark: ${address.landmark})` : '';
    return `${base}${pincodePart}${landmarkPart}`.trim();
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleAddAddress = () => {
    if (!user) {
      toast.error('Please login to manage addresses');
      navigate('/login');
      return;
    }
    navigate('/add-address');
  };

  const handleEditAddress = (addressId: string) => {
    if (!user) {
      toast.error('Please login to manage addresses');
      navigate('/login');
      return;
    }
    navigate(`/add-address?edit=true&addressId=${addressId}`);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (isValidatingCoupon) {
      return;
    }

    setIsValidatingCoupon(true);
    const upperCode = couponCode.trim().toUpperCase();

    try {
      // Calculate order amount (total after product savings + delivery fee) for validation
      const orderAmount = totalAfterProductSavings + deliveryFee;

      console.log('🎫 [Checkout] Validating coupon:', { couponCode: upperCode, orderAmount });

      const response = await validateCouponCode(upperCode, orderAmount);

      if (response.status === 0 && response.data && response.data.length > 0) {
        const couponData = response.data[0];
        
        const discountAmount = Math.abs(parseFloat(couponData.DiscountAmount));
        
        const discountType = couponData.DiscountType.toLowerCase().includes('percentage') 
          ? 'percentage' as const
          : 'fixed' as const;
        
        let discountValue: number;
        if (discountType === 'percentage') {
          discountValue = Math.abs(parseFloat(couponData.DiscountValue));
        } else {
          discountValue = discountAmount;
        }

        setAppliedCoupon({
          code: upperCode,
          discount: discountValue,
          discountType: discountType,
          discountAmount: discountAmount,
          message: couponData.Message,
        });

        // Coupon applied - UI updates automatically
        if (couponData.Message) {
          // Coupon applied - UI updates automatically
        }
      } else {
        throw new Error(response.message || 'Invalid coupon code');
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ [Checkout] Error validating coupon:', error);
      }
      // Fail silently - show error in UI if needed
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    // Coupon removed silently - UI updates automatically
  };
  
  // NEW BILLING LOGIC: Use OriginalPrice for base total calculation
  // Base Total = Sum of (OriginalPrice * Quantity) for all items
  const baseTotal = cart.reduce((sum, item) => {
    const originalPrice = item.originalPrice || item.price; // Use originalPrice if available, otherwise use price
    return sum + (originalPrice * item.quantity);
  }, 0);

  // Product Savings = Sum of (OriginalPrice - DiscountedPrice) * Quantity
  const productSavings = cart.reduce((total, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return total + ((item.originalPrice - item.price) * item.quantity);
    }
    return total;
  }, 0);

  // Total after product discounts
  const totalAfterProductSavings = baseTotal - productSavings;

  // Delivery Fee - Always ₹29 (removed free delivery over ₹500 logic)
  const deliveryFee = 29;

  // Calculate coupon discount
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  // Final calculation: Base Total → Product Savings → Coupon Discount → Delivery Fee
  const totalAfterCoupon = totalAfterProductSavings - couponDiscount;
  const finalTotal = Math.max(0, totalAfterCoupon + deliveryFee);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    if (!user.name?.trim() || !user.id?.trim()) {
      toast.error('Please complete your contact information');
      return;
    }

    if (!selectedAddressId) {
      toast.error('Please add a delivery address');
      return;
    }

    if (!selectedSlot) {
      toast.error('Please select a delivery slot');
      return;
    }

    const selectedAddress =
      addresses.find((addr) => addr.id === selectedAddressId) ||
      addresses.find((addr) => addr.isDefault) ||
      addresses[0];

    if (!selectedAddress) {
      toast.error('Please add a delivery address');
      return;
    }

    setIsProcessing(true);
    setIsPlacingOrder(true);

    try {
      // Update local state addresses (mark selected as default)
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === selectedAddress.id,
      }));
      setAddresses(updatedAddresses);
    
      // Convert user ID to backend format (12-digit number without +)
      const backendUserId = toBackendID(user.id || '');
      const userIdNumber = parseInt(backendUserId, 10);
      
      if (isNaN(userIdNumber)) {
        throw new Error('Invalid user ID format');
      }

      // Filter out invalid cart items before processing
      const validCartItems = cart.filter((item) => {
        const isValid = 
          item.name && item.name.trim() !== '' &&
          item.unit && item.unit.trim() !== '' &&
          item.category && item.category.trim() !== '' &&
          item.image && item.image.trim() !== '';
        
        if (!isValid) {
          console.warn('⚠️ [Checkout] Removing invalid cart item:', {
            id: item.id,
            name: item.name || '(empty)',
            unit: item.unit || '(empty)',
            category: item.category || '(empty)',
            image: item.image || '(empty)'
          });
          // Remove invalid item from cart
          removeFromCart(item.id);
        }
        
        return isValid;
      });

      // Check if any items were removed
      if (validCartItems.length === 0) {
        toast.error('No valid items in cart. Please add products and try again.');
        return;
      }

      if (validCartItems.length < cart.length) {
        toast.error(`Removed ${cart.length - validCartItems.length} invalid item(s) from cart. Please review and try again.`);
        return;
      }

      // Recalculate totals based on valid items only - NEW BILLING LOGIC
      // Base Total = Sum of (OriginalPrice * Quantity)
      const validBaseTotal = validCartItems.reduce((sum, item) => {
        const originalPrice = item.originalPrice || item.price;
        return sum + (originalPrice * item.quantity);
      }, 0);

      // Product Savings = Sum of (OriginalPrice - DiscountedPrice) * Quantity
      const validProductSavings = validCartItems.reduce((total, item) => {
        if (item.originalPrice && item.originalPrice > item.price) {
          return total + ((item.originalPrice - item.price) * item.quantity);
        }
        return total;
      }, 0);

      // Total after product discounts
      const validTotalAfterProductSavings = validBaseTotal - validProductSavings;

      // Delivery Fee - Always ₹29
      const validDeliveryFee = 29;

      // Apply coupon discount if available
      const validCouponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;

      // Final calculation
      const validTotalAfterCoupon = validTotalAfterProductSavings - validCouponDiscount;
      const validFinalTotal = Math.max(0, validTotalAfterCoupon + validDeliveryFee);

      // Map valid cart items to API format with comprehensive validation
      const orderItems = validCartItems.map((item, index) => {
        // Sanitize and validate all required fields
        const productId = String(item.id || '').trim();
        const productName = (item.name || '').trim();
        const unit = (item.unit || '').trim();
        const category = (item.category || '').trim();
        const image = (item.image || '').trim();
        const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
        const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity) && item.quantity > 0 ? item.quantity : 1;

        // Validate required fields are not empty
        if (!productId || productId === '') {
          throw new Error(`Cart item ${index + 1}: ProductId is missing or empty`);
        }
        if (!productName || productName === '') {
          throw new Error(`Cart item ${index + 1}: ProductName is missing or empty`);
        }
        if (!unit || unit === '') {
          throw new Error(`Cart item ${index + 1}: Unit is missing or empty`);
        }
        if (!category || category === '') {
          throw new Error(`Cart item ${index + 1}: Category is missing or empty`);
        }
        if (!image || image === '') {
          throw new Error(`Cart item ${index + 1}: Image is missing or empty`);
        }
        if (price <= 0) {
          throw new Error(`Cart item ${index + 1}: Price must be greater than 0`);
        }
        if (quantity <= 0) {
          throw new Error(`Cart item ${index + 1}: Quantity must be greater than 0`);
        }

        // Build order item - CRITICAL: Only include optional fields if they have valid values
        // Backend SQL cannot handle NULL, so we omit fields entirely if they're empty
        const orderItem: PlaceOrderItem = {
          ProductId: productId,
          ProductName: productName,
          Unit: unit,
          Price: price,
          Quantity: quantity,
          Category: category,
          Image: image,
        };

        // ALWAYS include VariantId as empty string if no variant (never null)
        if (item.variant && item.variant.id && String(item.variant.id).trim() !== '') {
          orderItem.VariantId = String(item.variant.id).trim();
        } else {
          // Always send empty string, never null
          orderItem.VariantId = '';
        }

        // Add OriginalPrice only if it exists, is valid, and is different from Price
        if (item.originalPrice && typeof item.originalPrice === 'number' && !isNaN(item.originalPrice) && item.originalPrice > 0 && item.originalPrice !== price) {
          orderItem.OriginalPrice = item.originalPrice;
        }

        // ALWAYS include Tags as empty string if not present (never null or undefined)
        const tagsValue = item.tags
          ? (Array.isArray(item.tags) 
              ? item.tags.filter(t => t && String(t).trim() !== '').join(', ').trim()
              : String(item.tags).trim())
          : '';
        
        // Always include Tags field, even if empty (use empty string, never null)
        orderItem.Tags = tagsValue || '';

        // Final validation: ensure no undefined values in required fields
        // Allowed undefined/null fields: Tags (optional, omitted if empty), VariantId (can be null), OriginalPrice (optional)
        const requiredFields = ['ProductId', 'ProductName', 'Unit', 'Price', 'Quantity', 'Category', 'Image'];
        const optionalFields = ['Tags', 'VariantId', 'OriginalPrice'];
        
        // Check that all required fields are present and not null/undefined
        const missingRequiredField = requiredFields.find(field => {
          const value = orderItem[field as keyof typeof orderItem];
          return value === null || value === undefined;
        });
        
        if (missingRequiredField) {
          console.error(`❌ [Checkout] Order item ${index + 1} missing required field "${missingRequiredField}":`, orderItem);
          throw new Error(`Order item ${index + 1} is missing required field: ${missingRequiredField}`);
        }
        
        // Check that no field has undefined (null is OK for VariantId)
        const hasUndefined = Object.values(orderItem).some(value => value === undefined);
        if (hasUndefined) {
          console.error(`❌ [Checkout] Order item ${index + 1} contains undefined values:`, orderItem);
          throw new Error(`Order item ${index + 1} contains undefined values. This should not happen.`);
        }

        // Log each item for debugging
        console.log(`📦 [Checkout] Order item ${index + 1}:`, {
          ProductId: orderItem.ProductId,
          VariantId: orderItem.VariantId || 'not included (no variant)',
          ProductName: orderItem.ProductName,
          Unit: orderItem.Unit,
          Price: orderItem.Price,
          Quantity: orderItem.Quantity,
          Category: orderItem.Category,
          Image: orderItem.Image ? orderItem.Image.substring(0, 50) + '...' : 'MISSING',
          OriginalPrice: orderItem.OriginalPrice || 'not included',
          Tags: orderItem.Tags || 'not included',
        });

        return orderItem;
      });

      // Calculate estimated delivery time (current time + 30 minutes as default, or use slot end time)
      const estimatedDelivery = new Date(Date.now() + 30 * 60 * 1000).toISOString();

      // Validate and sanitize order request fields
      if (!selectedSlot || !selectedSlot.id) {
        throw new Error('Delivery slot is required');
      }
      if (!selectedAddressId || selectedAddressId.trim() === '') {
        throw new Error('Delivery address is required');
      }
      if (!paymentMethod || paymentMethod.trim() === '') {
        throw new Error('Payment method is required');
      }

      const slotId = typeof selectedSlot.id === 'number' ? selectedSlot.id : parseInt(String(selectedSlot.id), 10);
      if (isNaN(slotId) || slotId <= 0) {
        throw new Error('Invalid delivery slot ID');
      }

      const deliveryAddressId = String(selectedAddressId).trim();
      if (!deliveryAddressId || deliveryAddressId === '') {
        throw new Error('Delivery address ID is required');
      }

      // Ensure all numeric fields are valid numbers - NEW BILLING LOGIC
      const subtotal = typeof validBaseTotal === 'number' && !isNaN(validBaseTotal) ? Math.max(0, validBaseTotal) : 0;
      const deliveryFee = typeof validDeliveryFee === 'number' && !isNaN(validDeliveryFee) ? Math.max(0, validDeliveryFee) : 0;
      const savings = typeof validProductSavings === 'number' && !isNaN(validProductSavings) ? Math.max(0, validProductSavings) : 0;
      const couponDiscountValue = typeof validCouponDiscount === 'number' && !isNaN(validCouponDiscount) ? Math.max(0, validCouponDiscount) : 0;
      // Total should include coupon discount
      const total = typeof validFinalTotal === 'number' && !isNaN(validFinalTotal) ? Math.max(0, validFinalTotal) : 0;

      // Determine payment status based on selected payment method
      // COD = Unpaid, all other methods (card, upi, wallet, netbanking) = Paid
      const paymentStatus = paymentMethod.toLowerCase().trim() === 'cod' ? 'Unpaid' : 'Paid';

      // Prepare order request with validated fields
      // Ensure all fields are explicitly set and not null/undefined
      const orderRequest: PlaceOrderRequest = {
        UserId: userIdNumber,
        SlotId: slotId,
        PaymentMethod: paymentMethod.trim(),
        PaymentStatus: paymentStatus, // "Paid" or "Unpaid" based on PaymentMethod
        Subtotal: subtotal, // Base total (OriginalPrice * Quantity)
        DeliveryFee: deliveryFee,
        Savings: savings, // Product savings
        Total: total, // Final total
        DeliveryAddressId: deliveryAddressId,
        EstimatedDelivery: estimatedDelivery,
        Items: orderItems,
      };

      // Add coupon code and coupon discount if applied
      if (appliedCoupon && appliedCoupon.code && appliedCoupon.code.trim() !== '') {
        orderRequest.CouponCode = appliedCoupon.code.trim();
        orderRequest.CouponDiscount = couponDiscountValue;
      }

      // Validate all required fields are present and valid
      if (!orderRequest.UserId || isNaN(orderRequest.UserId)) {
        throw new Error('Invalid UserId');
      }
      if (!orderRequest.SlotId || isNaN(orderRequest.SlotId)) {
        throw new Error('Invalid SlotId');
      }
      if (!orderRequest.PaymentMethod || orderRequest.PaymentMethod.trim() === '') {
        throw new Error('Invalid PaymentMethod');
      }
      if (!orderRequest.PaymentStatus || (orderRequest.PaymentStatus !== 'Paid' && orderRequest.PaymentStatus !== 'Unpaid')) {
        throw new Error('Invalid PaymentStatus');
      }
      if (!orderRequest.DeliveryAddressId || orderRequest.DeliveryAddressId.trim() === '') {
        throw new Error('Invalid DeliveryAddressId');
      }
      if (!orderRequest.EstimatedDelivery || orderRequest.EstimatedDelivery.trim() === '') {
        throw new Error('Invalid EstimatedDelivery');
      }
      if (!orderRequest.Items || orderRequest.Items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      // Final validation: ensure no undefined or invalid null values in the request
      // Fields allowed to be null (valid business logic)
      const allowedNullFields = ['VariantId'];

      // Validate order-level fields
      const invalidOrderField = Object.entries(orderRequest).some(
        ([key, value]) => {
          // Skip Items array - validate separately
          if (key === 'Items') return false;
          // Allow null for VariantId (but VariantId is only in Items, not order-level)
          // Reject null/undefined for all other order-level fields
          return (value === null || value === undefined) && !allowedNullFields.includes(key);
        }
      );

      if (invalidOrderField) {
        console.error('❌ [Checkout] Invalid order-level field:', orderRequest);
        throw new Error('Order request contains invalid null or undefined values. Please refresh and try again.');
      }

      // Validate each item in Items array
      const invalidItem = orderRequest.Items.some((item, itemIndex) => {
        const hasInvalidField = Object.entries(item).some(
          ([key, value]) => {
            // Allow null for VariantId (valid when product has no variants)
            if (key === 'VariantId' && value === null) return false;
            // Reject null/undefined for all other fields
            return (value === null || value === undefined) && !allowedNullFields.includes(key);
          }
        );
        
        if (hasInvalidField) {
          console.error(`❌ [Checkout] Invalid item ${itemIndex + 1}:`, item);
        }
        
        return hasInvalidField;
      });

      if (invalidItem) {
        console.error('❌ [Checkout] Invalid items found in Items array:', orderRequest.Items);
        throw new Error('Order items contain invalid null or undefined values. Please refresh and try again.');
      }

      console.log('📤 [Checkout] Placing order with data:', JSON.stringify(orderRequest, null, 2));
      console.log('📤 [Checkout] Order request validation:', {
        hasUserId: !!orderRequest.UserId,
        hasSlotId: !!orderRequest.SlotId,
        hasPaymentMethod: !!orderRequest.PaymentMethod,
        hasDeliveryAddressId: !!orderRequest.DeliveryAddressId,
        hasEstimatedDelivery: !!orderRequest.EstimatedDelivery,
        itemsCount: orderRequest.Items.length,
        allItemsValid: orderRequest.Items.every(item => 
          item.ProductId && item.ProductName && item.Unit && item.Category && item.Image
        ),
      });

      // Call the PlaceOrder API
      const apiResponse = await placeOrder(orderRequest);

      console.log('✅ [Checkout] Order placed successfully. OrderId:', apiResponse.data?.OrderId);

      // Create order object for local storage
    const order = {
        id: apiResponse.data?.OrderId || `ORDER_${Date.now()}`,
      items: [...validCartItems],
      total: validFinalTotal,
        status: 'processing' as const,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        deliveryAddress: updatedAddresses.find((addr) => addr.id === selectedAddress.id) as Address,
      deliverySlot: selectedSlot.displayText,
      paymentMethod,
      createdAt: new Date().toISOString(),
        estimatedDelivery: estimatedDelivery,
    };

      // Add order to store
    addOrder(order);
      
      // Clear cart
    clearCart();
      
      // Show success message
    toast.success('Order placed successfully!');
      
      // Navigate to order success page
    navigate('/order-success', { 
      state: { orderData: order },
        replace: true,
    });
    } catch (error: any) {
      console.error('❌ [Checkout] Error placing order:', error);
      setIsPlacingOrder(false);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E1E2F] mb-4">No items in cart</h2>
          <p className="text-[#6B7280] mb-6">Add items to your cart before checking out.</p>
          <Button asChild>
            <Link
              to="/"
              className="bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-semibold shadow-md transition inline-flex items-center justify-center px-6"
            >
              Continue Shopping
            </Link>
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Mobile AppBar */}
      {isMobile && <MobileAppBar title="Checkout" />}

      {/* Desktop Header */}
      {!isMobile && (
        <header 
          ref={checkoutHeaderRef}
          className="breadcrumb-header checkout-header !sticky !top-[var(--desktop-header-height,80px)] !z-40 bg-white border-b border-[#E5E7EB] shadow-sm !m-0 !p-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-[#1E1E2F]">Checkout</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Shield className="w-4 h-4" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
      
      {/* Search Overlay */}
      {!isMobile && (
        <SearchOverlay open={isSearchOverlayOpen} onOpenChange={setIsSearchOverlayOpen} />
      )}

      <div className={isMobile ? "px-4 pb-6 page-content" : "max-w-7xl mx-auto px-6 pb-8 pt-4"}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Customer Information */}
          <div className="space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#F5F6FA] rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1E1E2F]">Contact Information</h3>
                  <p className="text-sm text-[#6B7280]">We'll use this to send order updates</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E2F] mb-2">Full Name</label>
                  <Input
                        value={user?.name || ''}
                        readOnly
                    placeholder="Enter your full name"
                        className="bg-white text-[#1E1E2F] placeholder:text-[#9CA3AF] focus:outline-none border-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1E1E2F] mb-2">Phone Number</label>
                  <div className="relative">
                    {/* +91 Prefix Badge */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                      <Phone className="w-5 h-5 text-[#8A8A8A]" />
                      <span className="text-sm font-medium text-primary-blue ml-1">+91</span>
                    </div>
                    {/* Use userId as phone number for display - normalize to 10 digits */}
                    <Input
                      value={user?.id ? normalizeTo10Digits(user.id) : ''}
                      readOnly
                      placeholder="Enter phone number"
                      className="pl-20 bg-white text-[#1E1E2F] placeholder:text-[#9CA3AF] focus:outline-none border-none shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-[#1E1E2F] mb-2">Email Address</label>
                <Input
                      value={user?.email || ''}
                      readOnly
                  placeholder="Enter email address"
                  type="email"
                      className="bg-white text-[#1E1E2F] placeholder:text-[#9CA3AF] focus:outline-none border-none shadow-sm"
                />
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#F7F7FB] rounded-xl shadow-sm p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1E1E2F]">Delivery Address</h3>
                    <p className="text-sm text-[#6B7280]">Where should we deliver your order?</p>
                  </div>
                </div>
                  <button
                    type="button"
                    onClick={handleAddAddress}
                  className="btn-bubbles"
                  >
                  <span className="text">
                    <Plus className="w-4 h-4" />
                    Add New Address
                  </span>
                  </button>
              </div>

              {isLoadingAddresses ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mr-3"></div>
                  <p className="text-sm text-[#6B7280]">Loading addresses...</p>
                </div>
              ) : addresses && addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`group bg-white rounded-[14px] border p-4 cursor-pointer ${
                        selectedAddressId === address.id
                          ? 'border-[#2C2E83]'
                          : 'border-gray-200'
                      }`}
                      style={{
                        background: selectedAddressId === address.id ? '#EEF0FF' : '#FFFFFF',
                        boxShadow: selectedAddressId === address.id 
                          ? '0px 4px 14px rgba(0, 0, 0, 0.10)' 
                          : '0px 2px 8px rgba(0,0,0,0.05)',
                        transition: 'all 0.20s ease',
                        transform: 'scale(1)',
                        borderLeft: '4px solid #2C2E83',
                        borderLeftWidth: selectedAddressId === address.id ? '4px' : '0px',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedAddressId !== address.id) {
                          e.currentTarget.style.background = '#EEF0FF';
                          e.currentTarget.style.boxShadow = '0px 4px 14px rgba(0, 0, 0, 0.10)';
                          e.currentTarget.style.transform = 'scale(0.98)';
                          e.currentTarget.style.borderLeftWidth = '4px';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedAddressId !== address.id) {
                          e.currentTarget.style.background = '#FFFFFF';
                          e.currentTarget.style.boxShadow = '0px 2px 8px rgba(0,0,0,0.05)';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.borderLeftWidth = '0px';
                        }
                      }}
                      onClick={() => handleSelectAddress(address.id)}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className="flex-1 cursor-pointer min-w-0"
                          role="presentation"
                        >
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span
                              className="text-sm text-[#1E1E2F] cursor-pointer"
                              style={{ fontWeight: 600 }}
                            >
                              {address.label || 'Address'}
                            </span>
                            {address.isDefault && (
                              <span
                                className="text-xs font-semibold text-[#2C2E83] bg-[#EEF0FF] px-[10px] py-[2px] rounded-[20px]"
                                style={{ fontWeight: 600, fontSize: '12px' }}
                              >
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#555] mt-1.5 leading-relaxed">
                            {address.fullAddress || address.address || getAddressDisplay(address)}
                          </p>
                          {address.landmark && (
                            <p className="text-xs text-[#888] mt-1.5">Landmark: {address.landmark}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label={`Edit ${address.label || 'address'}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            handleEditAddress(address.id);
                          }}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                          }}
                          className="flex items-center gap-2 flex-shrink-0 font-semibold transition-all hover:bg-[#EEF0FF] hover:border-[#4B55C4] hover:text-[#4B55C4] sm:flex z-10 relative"
                          style={{
                            border: '1.5px solid #2C2E83',
                            color: '#2C2E83',
                            borderRadius: '10px',
                            padding: '8px 18px',
                            transition: '0.2s ease'
                          }}
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-[#C7CBFF] rounded-xl p-6 text-center">
                  <p className="text-sm text-[#6B7280] mb-4">
                    You haven&apos;t saved any addresses yet. Add one to continue.
                  </p>
                    <button
                      type="button"
                      onClick={handleAddAddress}
                    className="btn-bubbles"
                    >
                    <span className="text">Add your address</span>
                    </button>
                </div>
              )}
            </motion.div>

            {/* Delivery Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#F5F6FA] rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1E1E2F]">Delivery Time</h3>
                  <p className="text-sm text-[#6B7280]">Choose your preferred delivery slot</p>
                </div>
              </div>

              {isLoadingSlots ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary-blue border-t-transparent rounded-full animate-spin mr-3"></div>
                  <p className="text-sm text-[#6B7280]">Loading delivery slots...</p>
                </div>
              ) : deliverySlots.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-[#C7CBFF] rounded-xl p-6 text-center">
                  <p className="text-sm text-[#6B7280]">
                    No delivery slots available at the moment. Please try again later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {deliverySlots.map((slot, index) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-4 rounded-lg transition-all text-left ${
                        selectedSlot?.id === slot.id
                          ? 'bg-[#E7E9FF] border border-[#2C2E83] text-[#2C2E83]'
                          : 'bg-white hover:bg-primary-blue/5 border border-transparent text-[#1E1E2F]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${
                            selectedSlot?.id === slot.id ? 'text-[#2C2E83]' : 'text-[#1E1E2F]'
                          }`}>
                            {slot.displayText}
                          </p>
                          {slot.name && (
                            <p className={`text-xs mt-1 ${
                              selectedSlot?.id === slot.id ? 'text-[#2C2E83]/70' : 'text-[#6B7280]'
                            }`}>
                              {slot.name}
                            </p>
                          )}
                          {index === 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Zap className="w-3 h-3 text-primary-blue" />
                              <span className="text-xs text-primary-blue font-medium">Fastest</span>
                            </div>
                          )}
                        </div>
                        {selectedSlot?.id === slot.id && (
                          <Check className="w-5 h-5 text-primary-blue" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#F5F6FA] rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1E1E2F]">Payment Method</h3>
                  <p className="text-sm text-[#6B7280]">Select your preferred payment option</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI Payment', icon: Phone },
                  { id: 'cod', label: 'Cash on Delivery', icon: Mail }
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-4 rounded-lg transition-all text-left flex items-center gap-3 ${
                        paymentMethod === method.id
                          ? 'bg-[#E7E9FF] border border-[#2C2E83] text-[#2C2E83]'
                          : 'bg-white hover:bg-primary-blue/5 border border-transparent text-[#1E1E2F]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${
                        paymentMethod === method.id ? 'text-[#2C2E83]' : 'text-[#6B7280]'
                      }`} />
                      <span className={`font-medium ${
                        paymentMethod === method.id ? 'text-[#2C2E83]' : 'text-[#1E1E2F]'
                      }`}>
                        {method.label}
                      </span>
                      {paymentMethod === method.id && (
                        <Check className="w-5 h-5 text-[#2C2E83] ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#F5F6FA] rounded-xl shadow-sm p-6"
            >
              <h3 className="text-xl font-bold text-[#1E1E2F] mb-6">Order Summary</h3>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variant?.id ?? 'base'}`} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E5E7EB]/60">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#1E1E2F] text-sm line-clamp-1">
                        {/* Show variant name if variant exists, otherwise show product name */}
                        {item.variant ? item.variant.name || item.name : item.name}
                      </h4>
                      <p className="text-xs text-[#9CA3AF]">{formatSize(item)}</p>
                      <p className="text-sm font-medium text-[#1E1E2F]">₹{item.price} × {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#1E1E2F]">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="mb-6">
                <div className="bg-white rounded-lg p-4 border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="w-5 h-5 text-primary-blue" />
                    <h4 className="text-sm font-bold text-[#1E1E2F]">Apply Coupon Code</h4>
                  </div>
                  
                  {appliedCoupon ? (
                    <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary-blue" />
                        <span className="text-sm font-medium text-primary-blue">
                          {appliedCoupon.code} - {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.discount}% OFF` 
                            : `₹${appliedCoupon.discount} OFF`}
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-primary-blue hover:text-primary-hover underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="ENTER COUPON CODE"
                        className="flex-1 text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon}
                        className="btn-bubbles disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text">{isValidatingCoupon ? 'Validating...' : 'Apply'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Coupons Table */}
              <div className="mb-6">
                <div className="bg-white rounded-lg p-4 border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-3">
                    <Ticket className="w-5 h-5 text-primary-blue" />
                    <h4 className="text-sm font-bold text-[#1E1E2F]">Available Coupons</h4>
                  </div>
                  {isLoadingCoupons ? (
                    <p className="text-sm text-[#6B7280]">Loading coupons...</p>
                  ) : availableCoupons.length === 0 ? (
                    <p className="text-sm text-[#6B7280]">No coupons available.</p>
                  ) : (
                    <div className="space-y-3">
                      {availableCoupons.map((c) => (
                        <div key={c.Id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start p-3 rounded-lg border border-[#E5E7EB]">
                          <div className="text-sm font-semibold text-[#1E1E2F] break-all">{c.CouponCode}</div>
                          <div className="text-xs text-[#6B7280] sm:col-span-2">{c.Message || '—'}</div>
                          <div className="text-xs text-[#6B7280] sm:text-right">
                            Min ₹{c.MinimumOrderAmount?.toFixed?.(2) || c.MinimumOrderAmount || 0}<br/>
                            Max ₹{c.MaxDiscountAmount?.toFixed?.(2) || c.MaxDiscountAmount || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown - NEW ORDER: Base Total → Savings → Coupon → Delivery → Final */}
              <div className="space-y-3 mb-6">
                {/* 1. Base Total (Original Prices) */}
                <div className="flex justify-between text-[#6B7280]">
                  <span>Base Total ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">₹{baseTotal.toFixed(2)}</span>
                </div>

                {/* 2. Product Savings */}
                {productSavings > 0 && (
                  <div className="flex justify-between text-primary-blue">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Product Savings
                    </span>
                    <span className="font-medium">-₹{productSavings.toFixed(2)}</span>
                  </div>
                )}

                {/* 3. Coupon Discount */}
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-primary-blue">
                    <span className="flex items-center gap-1">
                      <Ticket className="w-4 h-4" />
                      Coupon Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-medium">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                {/* 4. Delivery Fee */}
                <div className="flex justify-between text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Delivery Fee
                  </span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                
                <hr className="border-[#E5E7EB]" />
                
                {/* 5. Final Total */}
                <div className="flex justify-between text-xl font-bold text-[#1E1E2F]">
                  <span>Final Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
                <button
                  type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || isProcessing}
                className={`btn-place-order ${isPlacingOrder ? 'loading-state' : ''}`}
                style={isPlacingOrder ? {
                  backgroundColor: '#1A2FA3',
                  borderRadius: '9999px',
                  transform: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  opacity: isPlacingOrder || isProcessing ? 0.6 : 1,
                  cursor: isPlacingOrder || isProcessing ? 'not-allowed' : 'pointer'
                } : {}}
              >
                {isPlacingOrder ? (
                  <div className="loader" style={{ transform: 'scale(0.35)', marginTop: '-15px', marginBottom: '-15px' }}>
                    <div className="truckWrapper">
                      <div className="truckBody">
                        <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '130px', height: 'auto' }}>
                          {/* Truck Cab */}
                          <rect x="20" y="25" width="60" height="35" fill="#FFFFFF" rx="3"/>
                          <rect x="25" y="30" width="15" height="12" fill="#1A2FA3" rx="2"/>
                          <rect x="45" y="30" width="15" height="12" fill="#1A2FA3" rx="2"/>
                          {/* Truck Cargo */}
                          <rect x="80" y="30" width="50" height="30" fill="#FFFFFF" rx="3"/>
                          <rect x="85" y="35" width="12" height="8" fill="#1A2FA3" rx="1"/>
                          <rect x="100" y="35" width="12" height="8" fill="#1A2FA3" rx="1"/>
                          <rect x="115" y="35" width="12" height="8" fill="#1A2FA3" rx="1"/>
                        </svg>
                      </div>
                      <div className="truckTires">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                          <circle cx="12" cy="12" r="11" fill="#1A1A1A"/>
                          <circle cx="12" cy="12" r="7" fill="#2A2A2A"/>
                          <circle cx="12" cy="12" r="3" fill="#1A1A1A"/>
                        </svg>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px' }}>
                          <circle cx="12" cy="12" r="11" fill="#1A1A1A"/>
                          <circle cx="12" cy="12" r="7" fill="#2A2A2A"/>
                          <circle cx="12" cy="12" r="3" fill="#1A1A1A"/>
                        </svg>
                      </div>
                      <div className="road"></div>
                      <div className="lampPost">
                        <svg viewBox="0 0 10 90" xmlns="http://www.w3.org/2000/svg" style={{ width: '10px', height: '90px' }}>
                          <rect x="4" y="0" width="2" height="90" fill="#2A2A2A"/>
                          <circle cx="5" cy="10" r="3" fill="#FFD700"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <span>Place Order • ₹{finalTotal.toFixed(2)}</span>
                )}
                </button>

              {/* Trust Signals */}
              <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                <div className="text-sm text-[#6B7280] space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-blue" />
                    <span>SSL secured checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary-blue" />
                    <span>Free delivery over ₹500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary-blue" />
                    <span>Easy returns & refunds</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;