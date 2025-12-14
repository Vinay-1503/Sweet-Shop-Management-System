import { apiRequest } from '@/lib/api';

/**
 * Request interface for AddUser API
 */
export interface AddUserRequest {
  user_id: string; // Mobile number (e.g., "+919988776655")
  user_name: string; // Full name
  password: string; // Password
  email_id: string; // Email address
  project: string; // Empty string "" (API docs say "always return null" but examples show empty strings)
  companyid: string; // Empty string "" (API docs say "always return null" but examples show empty strings)
  roleid: number; // Always 0
  is_customer: boolean; // true if registered from user website
  is_supplier: boolean; // Always false
  supplierid: number; // 0 if is_supplier is false
  phone?: string; // Optional phone number
}

/**
 * Response interface for AddUser API
 */
export interface AddUserResponse {
  Header: any[];
  EditableColumns: any[];
  ValueChangeColumns: any[];
  TwoFields: any[];
  status: number; // 1 means success (per API docs)
  message: string;
  data?: {
    UserId: string;
    UserName: string;
  };
  TotalRecords: number;
}

/**
 * Customer info (from api/GetCustomerInfo)
 */
export interface CustomerInfo {
  Id: number;
  Name: string;
  Email: string;
  MobileNo: string;
  WalletBalance: number;
  Type: string;
  CreatedDate: string;
  ProfileImage: string | null;
  ReferralCode: string;
  ReferredBy: string | null;
}

export interface GetCustomerInfoResponse {
  Header: any[];
  EditableColumns: any[];
  ValueChangeColumns: any[];
  TwoFields: any[];
  status: number;
  message: string;
  data?: CustomerInfo;
  TotalRecords: number;
}

/**
 * Register a new user in the app
 * 
 * @param userData - User registration data
 * @returns Promise with the API response
 */
export const addUser = async (userData: AddUserRequest): Promise<AddUserResponse> => {
  try {
    // Log the request for debugging
    console.log('Sending AddUser request:', JSON.stringify(userData, null, 2));
    
    const response = await apiRequest('/api/AddUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to register user: ${response.statusText}`);
    }

    const data: AddUserResponse = await response.json();
    
    // Log the response for debugging
    console.log('AddUser API response:', JSON.stringify(data, null, 2));
    
    // Check if API returned success (status: 1 means success based on API docs)
    if (data.status !== 1) {
      // Include the full error message from API
      const errorMsg = data.message || 'Failed to register user';
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Fetch customer details for the authenticated user
 * Uses bearer token (handled by apiRequest) as per API docs
 */
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    const response = await apiRequest('/api/GetCustomerInfo', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch customer info: ${response.statusText}`);
    }

    const data: GetCustomerInfoResponse = await response.json();

    if (data.status !== 1 || !data.data) {
      // API returned no data or non-success status
      console.warn('GetCustomerInfo did not return customer data:', data.message);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching customer info:', error);
    throw error;
  }
};

/**
 * Request interface for UpdateCustomer API
 */
export interface UpdateCustomerRequest {
  Name: string; // Full Name
  Email: string; // Email Address
  ProfileImage?: string; // Profile Image URL (optional)
}

/**
 * Response interface for UpdateCustomer API
 */
export interface UpdateCustomerResponse {
  Header: any[];
  EditableColumns: any[];
  ValueChangeColumns: any[];
  TwoFields: any[];
  status: number; // 1 means success
  message: string;
  data?: {
    UpdatedFields: number;
  };
  TotalRecords: number;
}

/**
 * Update customer details (Name, Email, ProfileImage)
 * Uses bearer token (handled by apiRequest) as per API docs
 * 
 * @param customerData - Customer update data
 * @returns Promise with the API response
 */
export const updateCustomer = async (customerData: UpdateCustomerRequest): Promise<UpdateCustomerResponse> => {
  try {
    // Log the request for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Sending UpdateCustomer request:', JSON.stringify(customerData, null, 2));
    }
    
    const response = await apiRequest('/api/UpdateCustomer', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.statusText}`);
    }

    const data: UpdateCustomerResponse = await response.json();
    
    // Log the response for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('UpdateCustomer API response:', JSON.stringify(data, null, 2));
    }
    
    // Check if API returned success (status: 1 means success)
    if (data.status !== 1) {
      const errorMsg = data.message || 'Failed to update customer';
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

