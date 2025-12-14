/**
 * API Configuration
 * 
 * Base URL for all API endpoints
 * All future API integrations will use this base URL
 */
// Base URL from API documentation: http://sqldb.catchus.in:9184/
// Current production URL: https://natarajwebapi.catchus.in/
export const API_BASE_URL = 'https://natarajwebapi.catchus.in/';

/**
 * Constructs a full API URL by appending an endpoint to the base URL
 * 
 * @param endpoint - The API endpoint (e.g., '/api/GetBanners')
 * @returns The full API URL
 * 
 * @example
 * getApiUrl('/api/GetBanners') // Returns 'https://natarajwebapi.catchus.in/api/GetBanners'
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash from endpoint if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Ensure base URL ends with a slash
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Get the stored access token from localStorage
 * Checks both 'access_token' and 'authToken' keys
 * 
 * @returns The access token string or null if not found
 */
export const getAccessToken = (): string | null => {
  // Check both possible token keys
  const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');
  return token;
};

/**
 * Get the authorization header value for API requests
 * Format: "Bearer <access_token>"
 * 
 * @returns Authorization header string or null if no token
 */
export const getAuthHeader = (): string | null => {
  const token = getAccessToken();
  if (!token) {
    return null;
  }
  
  // Ensure token is a string
  const tokenString = String(token).trim();
  if (!tokenString) {
    return null;
  }
  
  // Return Bearer token format
  return `Bearer ${tokenString}`;
};

/**
 * Track if we've already shown a 401 notification to avoid spam
 */
let unauthorizedNotificationShown = false;
let notificationShownTime = 0;
const NOTIFICATION_COOLDOWN = 30000; // 30 seconds

/**
 * List of public API endpoints that don't require authentication
 */
const PUBLIC_ENDPOINTS = [
  'api/GetBanners',
  'api/GetProducts',
  'api/GetCategories',
  'api/GetSections',
  'api/GetProductsByCategoryId',
];

/**
 * Check if an endpoint is public (doesn't require authentication)
 */
const isPublicEndpoint = (endpoint: string): boolean => {
  const normalizedEndpoint = endpoint.replace(/^\/+/, '');
  return PUBLIC_ENDPOINTS.some(publicEndpoint => {
    const normalizedPublic = publicEndpoint.replace(/^\/+/, '');
    return normalizedEndpoint === normalizedPublic || normalizedEndpoint.startsWith(normalizedPublic + '?');
  });
};

/**
 * Helper function to make API requests
 * ALWAYS includes Bearer token if available (API requires auth for all endpoints)
 * 
 * @param endpoint - The API endpoint (e.g., '/api/GetBanners')
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise with the response
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  
  // Build headers
  const headers: Record<string, string> = {};
  
  // Set Content-Type (unless already set or for form-urlencoded)
  const existingHeaders = (options.headers as Record<string, string>) || {};
  if (!existingHeaders['Content-Type'] && !existingHeaders['content-type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Merge existing headers
  Object.assign(headers, existingHeaders);
  
  // ALWAYS try to add Authorization header if token exists
  // The API requires authentication for ALL endpoints
  const authHeader = getAuthHeader();
  if (authHeader) {
    headers['Authorization'] = authHeader;
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
    console.log('🔐 [apiRequest] Added Bearer token for:', endpoint);
    }
  } else {
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ [apiRequest] No auth token found for:', endpoint);
      console.warn('⚠️ [apiRequest] This may cause API to return status -1');
    }
  }
  
  // Prepare request options
  const requestOptions: RequestInit = {
    ...options,
    headers,
  };

  // Only log in development mode
  if (process.env.NODE_ENV === 'development') {
  console.log('📤 [apiRequest] Making request:', {
    url,
    method: options.method || 'GET',
    hasAuth: !!authHeader,
    endpoint
  });
  }

  // Make the request
  const response = await fetch(url, requestOptions);
  
  // Only log in development mode
  if (process.env.NODE_ENV === 'development') {
  console.log('📥 [apiRequest] Response:', {
    endpoint,
    status: response.status,
    statusText: response.statusText,
      ok: response.ok,
      hasAuth: !!authHeader
  });
  }
  
  // Handle 401 Unauthorized errors centrally
  if (response.status === 401) {
    console.warn('❌ [apiRequest] 401 Unauthorized for:', endpoint);
    
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ [apiRequest] Token in localStorage:', localStorage.getItem('access_token') ? 'EXISTS' : 'MISSING');
      console.error('❌ [apiRequest] User needs to login to access:', endpoint);
    }
    
    // Show user-friendly notification with cooldown
    const now = Date.now();
    const timeSinceLastNotification = now - notificationShownTime;
    
    if (!unauthorizedNotificationShown || timeSinceLastNotification > NOTIFICATION_COOLDOWN) {
      // Use dynamic import to avoid circular dependencies
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('Your session has expired. Please log out and log in again to continue.', {
          duration: 5000,
          id: 'session-expired', // Prevent duplicate toasts
        });
      });
      
      unauthorizedNotificationShown = true;
      notificationShownTime = now;
      
      // Reset flag after cooldown
      setTimeout(() => {
        unauthorizedNotificationShown = false;
      }, NOTIFICATION_COOLDOWN);
    }
    
    // DO NOT automatically logout - let user manually logout
    // Just return the error response so components can handle it
  }
  
  // Note: We don't read the response body here to avoid consuming the stream
  // The calling function will handle parsing and error checking
  
  return response;
};

/**
 * Reset unauthorized notification flag (useful after manual logout/login)
 */
export const resetUnauthorizedNotification = () => {
  unauthorizedNotificationShown = false;
  notificationShownTime = 0;
};
