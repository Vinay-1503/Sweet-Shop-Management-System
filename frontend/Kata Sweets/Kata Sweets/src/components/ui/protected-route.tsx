/**
 * Protected Route Component - Role-based access control
 */
import { Navigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getRoleFromToken, getStoredToken, isTokenExpired } from '@/utils/jwt';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
}) => {
  const { isAuthenticated } = useStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast.error('Please login to access this page');
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Check token
      const token = getStoredToken();
      
      if (!token) {
        toast.error('Session expired. Please login again.');
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        toast.error('Session expired. Please login again.');
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Check role if required
      if (requiredRole) {
        const role = getRoleFromToken(token);
        
        if (role !== requiredRole) {
          toast.error('Access Denied. Insufficient privileges.');
          setIsAuthorized(false);
          setIsChecking(false);
          return;
        }
      }

      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAccess();
  }, [isAuthenticated, requiredRole]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#1F1F1F]">Checking access...</div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

