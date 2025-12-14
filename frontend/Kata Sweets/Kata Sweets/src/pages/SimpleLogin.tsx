// Simple login page - ID + Password only, no OTP, no API
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/useStore';
import { storeToken } from '@/utils/jwt';

const SimpleLogin = () => {
  const navigate = useNavigate();
  const { login } = useStore();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation - no API call
    if (!loginId.trim() || !password.trim()) {
      setError('Please enter both Login ID and Password');
      return;
    }

    // Determine role
    const isAdmin = loginId.toLowerCase().includes('admin');
    const role = isAdmin ? 'ADMIN' : 'USER';
    
    // Create mock JWT token (in production, this would come from backend)
    // JWT format: header.payload.signature
    const mockPayload = {
      sub: loginId,
      role: role,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      iat: Math.floor(Date.now() / 1000),
    };
    
    // Create a simple mock JWT (base64 encoded)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(mockPayload));
    const mockToken = `${header}.${payload}.mock-signature`;
    
    // Store token
    storeToken(mockToken);
    
    // Set user state
    const mockUser = {
      id: loginId,
      name: isAdmin ? 'Admin User' : 'User',
      email: `${loginId}@example.com`,
      loginId: loginId,
      role: isAdmin ? 'admin' as const : 'user' as const
    };

    login(mockUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FF6DAA] mb-2">Kata Sweets</h1>
          <p className="text-[#1F1F1F]/70">Welcome back! Please login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="loginId" className="block text-sm font-medium text-[#1F1F1F] mb-2">
              Login ID
            </label>
            <Input
              id="loginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Enter your login ID"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1F1F1F] mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#FF6DAA] hover:bg-[#FF9FC6] text-white"
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="text-[#1F1F1F]/60">Demo mode - No backend validation</p>
          <p className="text-[#1F1F1F]/60 text-xs mt-2">
            Tip: Use "admin" in login ID for admin access
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;

