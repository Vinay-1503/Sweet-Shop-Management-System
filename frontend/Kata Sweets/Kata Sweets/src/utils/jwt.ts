/**
 * JWT Utility Functions
 * Handles JWT token decoding and role extraction
 */

export interface JWTPayload {
  role?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Decode JWT token without verification (client-side only)
 * Note: In production, tokens should be verified on the backend
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

/**
 * Get role from JWT token
 * Returns 'ADMIN' or 'USER' (uppercase) or null if not found
 */
export const getRoleFromToken = (token: string | null): 'ADMIN' | 'USER' | null => {
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.role) return null;
  
  const role = decoded.role.toUpperCase();
  return role === 'ADMIN' ? 'ADMIN' : role === 'USER' ? 'USER' : null;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Get stored JWT token from localStorage
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('access_token') || localStorage.getItem('jwt_token');
};

/**
 * Store JWT token in localStorage
 */
export const storeToken = (token: string): void => {
  localStorage.setItem('access_token', token);
  localStorage.setItem('jwt_token', token); // Backup key
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('jwt_token');
};

