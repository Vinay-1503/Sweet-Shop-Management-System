// Simplified App - static sweet store, no API, minimal routing
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResponsivePage } from "@/components/ui/responsive-layout";
import { DesktopNavigation } from "@/components/ui/desktop-navigation";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Footer } from "@/components/ui/footer";
import SplashScreen from "./pages/SplashScreen";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import SimpleLogin from "./pages/SimpleLogin";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ui/protected-route";
import { useStore } from "./store/useStore";
import { useMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

// Component to conditionally render footer based on route
const FooterWrapper = ({ isMobile }: { isMobile: boolean }) => {
  // Hide footer on mobile
  return !isMobile ? <Footer /> : null;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(false);
  const { isOnboarding, completeOnboarding } = useStore();
  const { isMobile } = useMobile();

  useEffect(() => {
    // Only show splash on first load, not on refresh
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (!hasSeenSplash) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
        if (isOnboarding) {
          completeOnboarding();
        }
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // Already seen splash, just complete onboarding if needed
      if (isOnboarding) {
        completeOnboarding();
      }
    }
  }, [isOnboarding, completeOnboarding]);

  return (
    <TooltipProvider>
      <Toaster />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        {showSplash ? (
          <SplashScreen />
        ) : (
          <Routes>
            {/* Auth Route */}
            <Route path="/login" element={<SimpleLogin />} />
            
            {/* Main App Routes - With navigation wrapper */}
            <Route path="/" element={
              <ResponsivePage>
                <DesktopNavigation />
                <Home />
                <FooterWrapper isMobile={isMobile} />
                {isMobile && <BottomNavigation />}
              </ResponsivePage>
            } />
            <Route path="/products" element={
              <ResponsivePage>
                <DesktopNavigation />
                <Products />
                <FooterWrapper isMobile={isMobile} />
                {isMobile && <BottomNavigation />}
              </ResponsivePage>
            } />
            <Route path="/products/create" element={
              <ResponsivePage>
                <DesktopNavigation />
                <ProtectedRoute requiredRole="ADMIN">
                  <CreateProduct />
                </ProtectedRoute>
                <FooterWrapper isMobile={isMobile} />
                {isMobile && <BottomNavigation />}
              </ResponsivePage>
            } />
            <Route path="/products/edit/:id" element={
              <ResponsivePage>
                <DesktopNavigation />
                <ProtectedRoute requiredRole="ADMIN">
                  <EditProduct />
                </ProtectedRoute>
                <FooterWrapper isMobile={isMobile} />
                {isMobile && <BottomNavigation />}
              </ResponsivePage>
            } />
            <Route path="/product/:id" element={
              <ResponsivePage>
                <DesktopNavigation />
                <ProductDetail />
                <FooterWrapper isMobile={isMobile} />
                {isMobile && <BottomNavigation />}
              </ResponsivePage>
            } />
            <Route path="/cart" element={
              <ResponsivePage>
                <DesktopNavigation />
                <Cart />
                <FooterWrapper isMobile={isMobile} />
                {isMobile && <BottomNavigation />}
              </ResponsivePage>
            } />
            <Route path="*" element={
              <ResponsivePage>
                <DesktopNavigation />
                <NotFound />
                <FooterWrapper isMobile={isMobile} />
                {isMobile && <BottomNavigation />}
              </ResponsivePage>
            } />
          </Routes>
        )}
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
