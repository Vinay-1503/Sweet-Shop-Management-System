import { normalizeTo10Digits } from '@/utils/phoneNumber';
import { getApiUrl } from '@/lib/api';

// Generate OTP - Mock API
export interface GenerateOTPResponse {
  success: boolean;
  message: string;
  otp?: string;
}

export const generateOTP = async (mobileNumber: string): Promise<GenerateOTPResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock OTP generation
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  return {
    success: true,
    message: 'OTP sent successfully',
    otp
  };
};

// Verify OTP - Mock API
export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export const verifyOTP = async (mobileNumber: string, otp: string): Promise<VerifyOTPResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock OTP verification
  if (otp.length === 4 && /^\d{4}$/.test(otp)) {
    const tenDigitPhone = normalizeTo10Digits(mobileNumber);
    const token = `mock_token_${Date.now()}`;
    
    return {
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: tenDigitPhone,
        name: '',
        email: '',
        phone: tenDigitPhone
      }
    };
  }
  
  return {
    success: false,
    message: 'Invalid OTP'
  };
};

// Login with mobile and password - Real API
export interface LoginResponse {
  success: boolean;
  message: string;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface TokenApiResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Login function - Calls Token API and stores access_token
 * 
 * @param mobileNumber - Mobile number (can be with or without +91)
 * @param password - User password
 * @returns LoginResponse with success status and user data
 */
export const login = async (
  mobileNumber: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const url = getApiUrl('Token');

    // Prepare form data for OAuth2 password grant
    const formData = new URLSearchParams();
    formData.append('username', mobileNumber);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    console.log('🔐 [login] Calling Token API:', url);
    console.log('🔐 [login] Request data:', {
      username: mobileNumber,
      grant_type: 'password',
      password: '***' // Don't log password
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    console.log('🔐 [login] API Response:', {
      status: response.status,
      ok: response.ok,
      hasAccessToken: !!data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in
    });

    // Check if login was successful
    if (response.ok && data.access_token) {
      // Store access_token in localStorage
      localStorage.setItem('access_token', data.access_token);
      
      // Store token metadata (optional, for reference)
      if (data.token_type) {
        localStorage.setItem('token_type', data.token_type);
      }
      if (data.expires_in) {
        localStorage.setItem('token_expires_in', data.expires_in.toString());
      }

      console.log('✅ [login] Access token stored successfully');
      console.log('✅ [login] Token length:', data.access_token.length);
      console.log('✅ [login] Token type:', data.token_type || 'bearer');

      // Create user object from mobile number
      const tenDigitPhone = normalizeTo10Digits(mobileNumber);
      
      const user = {
        id: tenDigitPhone,
        name: 'Customer User',
        email: '',
        phone: ''
      };

      return {
        success: true,
        message: 'Login successful',
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
        user
      };
    } else {
      // Handle API error response
      const errorMessage = data.error_description || data.error || 'Invalid mobile number or password. Please try again.';
      console.error('❌ [login] Login failed:', errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error: any) {
    console.error('❌ [login] Network error:', error);
    return {
      success: false,
      message: error.message || 'Network error. Please check your connection and try again.'
    };
  }
};

// Resend OTP - Mock API
export const resendOTP = async (mobileNumber: string): Promise<GenerateOTPResponse> => {
  return generateOTP(mobileNumber);
};

// Send OTP for Verification - Real API (for Signup)
export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export const sendOTPForVerification = async (phone: string): Promise<SendOTPResponse> => {
  try {
    const url = getApiUrl('api/v1/auth/sendotpforverification');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone
      }),
    });

    const data = await response.json();

    // Handle empty array response
    if (Array.isArray(data) && data.length === 0) {
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }

    // Check for success message
    if (data.message && data.message.includes('OTP sent successfully')) {
      return {
        success: true,
        message: data.message || 'OTP sent successfully.'
      };
    }

    return {
      success: false,
      message: data.message || 'Failed to send OTP. Please try again.'
    };
  } catch (error: any) {
    console.error('❌ [sendOTPForVerification] Error:', error);
    return {
      success: false,
      message: error.message || 'Network error. Please check your connection and try again.'
    };
  }
};

// Send OTP for Login - Real API
export const sendOTPForLogin = async (phone: string): Promise<SendOTPResponse> => {
  try {
    const url = getApiUrl('api/v1/auth/sendotpforlogin');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone
      }),
    });

    const data = await response.json();

    // Handle empty array response (user not found)
    if (Array.isArray(data) && data.length === 0) {
      return {
        success: false,
        message: "We couldn't find your account. Register to continue."
      };
    }

    // Check for 404 or user not found errors
    if (response.status === 404 || (data.message && (data.message.toLowerCase().includes('not found') || data.message.toLowerCase().includes('user not found')))) {
      return {
        success: false,
        message: "We couldn't find your account. Register to continue."
      };
    }

    // Check for success message
    if (data.message && data.message.includes('OTP sent successfully')) {
      return {
        success: true,
        message: data.message || 'OTP sent successfully.'
      };
    }

    return {
      success: false,
      message: data.message || 'Failed to send OTP. Please try again.'
    };
  } catch (error: any) {
    console.error('❌ [sendOTPForLogin] Error:', error);
    // Check if it's a network error that might indicate user not found
    if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      return {
        success: false,
        message: "We couldn't find your account. Register to continue."
      };
    }
    return {
      success: false,
      message: error.message || 'Network error. Please check your connection and try again.'
    };
  }
};

// Verify OTP for Registration - Real API
export interface VerifyOTPForRegistrationResponse {
  success: boolean;
  message: string;
  token?: string;
}

export const verifyOTPForRegistration = async (phone: string, otp: string): Promise<VerifyOTPForRegistrationResponse> => {
  try {
    const url = getApiUrl('api/v1/auth/verifyotpforregistration');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        otp: otp
      }),
    });

    const data = await response.json();

    // Handle empty array response (invalid OTP)
    if (Array.isArray(data) && data.length === 0) {
      return {
        success: false,
        message: 'Invalid OTP. Please try again.'
      };
    }

    // Check for success message
    if (data.message && data.message.includes('Token found')) {
      return {
        success: true,
        message: data.message || 'Token found, you can proceed',
        token: data.token || data.access_token || undefined
      };
    }

    return {
      success: false,
      message: data.message || 'Invalid OTP. Please try again.'
    };
  } catch (error: any) {
    console.error('❌ [verifyOTPForRegistration] Error:', error);
    return {
      success: false,
      message: error.message || 'Network error. Please check your connection and try again.'
    };
  }
};

// Add User - Real API
export interface AddUserResponse {
  success: boolean;
  message: string;
  data?: {
    UserId: string;
    UserName: string;
    IsCustomer: boolean;
  };
  token?: string;
}

export interface AddUserPayload {
  user_id: string;
  user_name: string;
  password: string;
  email_id: string | null;
  project: string;
  companyid: string;
  roleid: number;
  is_customer: boolean;
  is_supplier: boolean;
  supplierid: number;
  phone: string;
  uid: string;
  referred_by?: string;
}

export const addUser = async (payload: AddUserPayload): Promise<AddUserResponse> => {
  try {
    const url = getApiUrl('api/AddUser');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Handle empty array response
    if (Array.isArray(data) && data.length === 0) {
      return {
        success: false,
        message: 'Failed to register user. Please try again.'
      };
    }

    // Check for success status
    if (data.status === 1 && data.message) {
      // Store token if present in response (check multiple possible fields)
      const token = data.token || data.access_token || data.accessToken || data.Token;
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('access_token', token); // Also store as access_token for API helper
      }

      return {
        success: true,
        message: data.message || 'User added successfully',
        data: data.data,
        token: token
      };
    }

    return {
      success: false,
      message: data.message || 'Failed to register user. Please try again.'
    };
  } catch (error: any) {
    console.error('❌ [addUser] Error:', error);
    return {
      success: false,
      message: error.message || 'Network error. Please check your connection and try again.'
    };
  }
};