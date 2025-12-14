import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { login } from '@/services/authService';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { normalizeTo10Digits, toBackendFormat } from '@/utils/phoneNumber';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog = ({ open, onOpenChange }: LoginDialogProps) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showThanks, setShowThanks] = useState(false);
  const { login: loginUser, completeOnboarding } = useStore();
  const navigate = useNavigate();

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 10 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(value);
    setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!mobileNumber.trim()) {
      setError('Please enter your mobile number');
      return;
    }

    // Validate exactly 10 digits
    const digitsOnly = mobileNumber.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    // Additional validation: must be exactly 10 digits
    if (!/^[0-9]{10}$/.test(digitsOnly)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Normalize input to 10 digits, then format for backend
      const normalizedMobile = normalizeTo10Digits(mobileNumber);
      if (normalizedMobile.length !== 10) {
        setError('Please enter a valid 10-digit mobile number');
        setIsLoading(false);
        return;
      }
      
      const formattedMobileNumber = toBackendFormat(normalizedMobile);
      const response = await login(formattedMobileNumber, password);

      if (response.success && response.user && response.access_token) {
        // Show "Thanks" animation
        setShowThanks(true);
        
        // Access token is already stored in localStorage by the login function
        // Additional token storage for backward compatibility
        localStorage.setItem('authToken', response.access_token);

        // Create user object for store
        // Normalize all phone numbers to 10 digits
        const tenDigitId = normalizeTo10Digits(response.user.id || response.user.phone || normalizedMobile);
        
        const user = {
          id: tenDigitId, // User ID is 10 digits (no 91 prefix)
          name: response.user.name || 'Customer User',
          email: response.user.email || '', // Email is optional, don't auto-generate
          phone: '', // Phone field is blank initially (for secondary number in profile)
          addresses: [
            {
              id: 'addr_1',
              label: 'Home',
              fullAddress: 'Add your address',
              isDefault: true
            }
          ]
        };

        // Login user (marks them as authenticated customer)
        loginUser(user);
        
        // Complete onboarding to bypass signup/OTP flow
        completeOnboarding();
        
        // Wait a bit to show "Thanks" animation, then close
        setTimeout(() => {
          toast.success('Login successful!');
          onOpenChange(false);
          setShowThanks(false);
          setMobileNumber('');
          setPassword('');
          navigate('/');
        }, 1500);
      } else {
        // Show error message from API response
        const errorMessage = response.message || 'Invalid mobile number or password. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info('Forgot password feature coming soon!');
  };

  // Reset state when dialog closes
  const handleDialogChange = (newOpen: boolean) => {
    if (!newOpen) {
      setShowThanks(false);
      setMobileNumber('');
      setPassword('');
      setError('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[380px] max-w-[90vw] rounded-2xl p-0 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 h-8 w-8 flex items-center justify-center text-[#6B7280] hover:text-primary-blue hover:bg-primary-blue/10 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 pt-8 pb-6">
          {/* Illustration - Login Page SVG */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-36 h-36 md:w-40 md:h-40">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-blue/10 via-primary-light/10 to-primary-hover/10 flex items-center justify-center">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white shadow-lg flex items-center justify-center p-4">
                  <img 
                    src="/loginPage.svg" 
                    alt="Login illustration" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl md:text-3xl font-bold text-[#1E1E2F] text-center">
              Login
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Mobile Number Input */}
            <div>
              <label htmlFor="login-mobile" className="block text-sm md:text-base font-medium text-[#1E1E2F] text-left mb-2">
                Mobile Number
              </label>
              <div className="relative flex items-center border-2 rounded-xl bg-white overflow-hidden" style={{
                borderColor: error ? '#EF4444' : '#D0D5DD'
              }}>
                {/* +91 Prefix - Non-editable */}
                <div className="flex items-center px-4 py-0 h-12 md:h-14 bg-[#F5F6FA] border-r-2 border-gray-200">
                  <span className="text-base md:text-lg font-semibold text-primary-blue">+91</span>
                </div>
                {/* Input Field */}
                <Input
                  id="login-mobile"
                  type="tel"
                  inputMode="numeric"
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  placeholder="Enter your number"
                  className={`flex-1 h-12 md:h-14 text-base md:text-lg bg-white text-[#1E1E2F] focus:outline-none transition-all duration-200 border-0 ${
                    error
                      ? 'focus:ring-2 focus:ring-red-500/20'
                      : 'focus:ring-2 focus:ring-primary-blue/20'
                  }`}
                  style={{
                    border: 'none',
                    boxShadow: 'none'
                  }}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              {error && mobileNumber.length > 0 && mobileNumber.length !== 10 && (
                <p className="text-sm text-red-500 text-left mt-1 px-1">Enter a valid 10-digit mobile number</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                className={`h-12 md:h-14 text-base md:text-lg bg-white border-2 rounded-xl text-[#1E1E2F] focus:outline-none transition-all duration-200 ${
                  error
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20'
                }`}
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm md:text-base text-primary-blue hover:text-primary-hover font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-500 text-center pt-1">{error}</p>
            )}

            {/* Login Button */}
            {isLoading ? (
              <button
                type="button"
                disabled
                className="w-full h-12 md:h-14 bg-primary-blue text-white font-semibold text-base md:text-lg rounded-xl opacity-50 cursor-not-allowed mt-5 flex items-center justify-center"
              >
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </button>
            ) : (
              <button
                type="submit"
                disabled={showThanks}
                className={`login-button-animated ${showThanks ? 'show-thanks' : ''} ${showThanks ? 'opacity-50 cursor-not-allowed' : ''} mt-5`}
                style={{
                  border: showThanks ? '1px solid #2C2E83' : '1px solid #18181a',
                  color: showThanks ? '#FFFFFF' : '#18181a',
                  background: showThanks ? '#2C2E83' : '#fff'
                }}
              >
                <span>LOGIN</span>
                <span>Thanks</span>
              </button>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;

