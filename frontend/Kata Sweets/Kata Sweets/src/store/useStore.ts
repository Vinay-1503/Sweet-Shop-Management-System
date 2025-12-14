// Simplified store for static sweet store - no API, no complex features
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
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
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  loginId: string;
  role?: 'user' | 'admin';
}

interface AppState {
  // User - simple login state only
  user: User | null;
  isAuthenticated: boolean;
  
  // Cart
  cart: CartItem[];
  
  // UI
  isOnboarding: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  completeOnboarding: () => void;
  
  // Getters
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      cart: [],
      isOnboarding: true,
      
      login: (user) => {
        set({ user, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, cart: [] });
      },
      
      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
            cart: [...cart, { ...product, quantity }]
          });
        }
      },
      
      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter(item => item.id !== productId)
        });
      },
      
      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set({
          cart: get().cart.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => set({ cart: [] }),
      
      completeOnboarding: () => set({ isOnboarding: false }),
      
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getCartItemsCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'kata-sweets-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        isOnboarding: state.isOnboarding,
      }),
    }
  )
);
