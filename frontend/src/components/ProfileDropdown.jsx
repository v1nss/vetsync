import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaCog, FaPaw, FaCalendarAlt, FaSignOutAlt, FaChevronDown, FaFileMedical, FaClinicMedical } from 'react-icons/fa';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import DriveImage from './DriveImage';

export default function ProfileDropdown() {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const userType = user?.user_type;

  // Get full name with fallback
  const fullName = user?.full_name || user?.email || 'User';

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get menu items based on user type
  const getMenuItems = () => {
    if (userType === 'vet_professional') {
      return [
        {
          to: '/vet/profile',
          icon: FaUser,
          label: 'My Profile',
        },
        {
          to: '/vet/appointments',
          icon: FaCalendarAlt,
          label: 'Appointments',
        },
        {
          to: '/vet/health-records',
          icon: FaFileMedical,
          label: 'Health Records',
        },
      ];
    }

    // Default: pet_owner
    return [
      {
        to: '/pet-owner/settings',
        icon: FaCog,
        label: 'Account Settings',
      },
      {
        to: '/pet-owner/pets',
        icon: FaPaw,
        label: 'My Pets',
      },
      {
        to: '/pet-owner/appointments',
        icon: FaCalendarAlt,
        label: 'Appointments',
      },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 px-4 py-2 transition-all duration-200"
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
          <FaChevronDown 
            className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-68 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center overflow-hidden bg-primary text-white font-semibold">
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
                <div>
                  <p className="font-semibold text-gray-800">{fullName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  {user?.clinic_name && (
                    <p className="text-xs text-gray-400 mt-0.5">{user.clinic_name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Icon className="text-gray-600 text-lg" />
                    <span className="text-gray-700 font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors duration-150 text-red-600"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}