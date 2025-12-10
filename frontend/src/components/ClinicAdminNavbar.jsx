import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaClinicMedical, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import DriveImage from './DriveImage';

export default function ClinicAdminNavbar() {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get full name with fallback
  const fullName = user?.first_name + " " + user?.last_name || 'User';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/clinic-admin/dashboard" className="flex items-center">
            <img 
              className="h-8 w-auto" 
              src="/vetsync-logo-wname.png" 
              alt="VetSync" 
            />
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center font-semibold overflow-hidden text-sm bg-primary text-white">
                    {user?.profile_image_url ? (
                    <DriveImage
                        image={user.profile_image_url}
                        alt={fullName}
                        className="w-full h-full object-cover"
                        fallbackIcon={false}
                    />
                    ) : null}
                    {!user?.profile_image_url && getInitials(fullName)}
                </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.fullName || 'Clinic Admin'}
              </span>
              <FaChevronDown className={`text-gray-400 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Clinic Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@clinic.com'}</p>
                </div>
                
                <div className="py-2">
                  <Link
                    to="/clinic-admin/clinic-management"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaClinicMedical className="text-primary" />
                    View Clinic
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}