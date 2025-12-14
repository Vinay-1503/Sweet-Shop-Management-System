import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, ChevronUp } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface ProfileDropdownProps {
  isMobile?: boolean;
}

export const ProfileDropdown = ({ isMobile = false }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout, isAuthenticated } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const role = user.role || 'user';
  const roleDisplay = role === 'admin' ? 'Admin' : 'User';

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleSettings = () => {
    setIsOpen(false);
    // Settings functionality can be added later
    console.log('Settings clicked');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-lg transition-colors",
          isMobile 
            ? "p-2.5 bg-white border border-[#F2DCE6] text-[#1F1F1F] hover:bg-[#FFF7EC]"
            : "p-2.5 rounded-xl hover:bg-[#FFF7EC] text-[#1F1F1F]"
        )}
      >
        {isMobile ? (
          <>
            <span className="font-medium text-sm text-[#DC143C]">{roleDisplay}</span>
            <div className="w-8 h-8 bg-[#DC143C] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <ChevronUp 
              className={cn(
                "w-4 h-4 transition-transform",
                isOpen ? "rotate-0" : "rotate-180"
              )} 
            />
          </>
        ) : (
          <>
            <div className="w-6 h-6 bg-[#DC143C] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={cn(
          "absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#F2DCE6] z-50",
          isMobile ? "top-full" : "top-full right-0"
        )}>
          <div className="py-2">
            {/* Role Display */}
            <div className="px-4 py-3 border-b border-[#F2DCE6]">
              <p className="text-xs font-medium text-[#1F1F1F]/70 mb-1">Role</p>
              <p className="text-sm font-semibold text-[#1F1F1F]">{roleDisplay}</p>
            </div>

            {/* Settings */}
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#FFF7EC] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#1F1F1F]" />
              <span className="text-sm text-[#1F1F1F]">Settings</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#FFF7EC] transition-colors border-t border-[#F2DCE6]"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

