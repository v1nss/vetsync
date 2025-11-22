import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaCog, FaPaw, FaCalendarAlt, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router';

export default function ProfileDropdown() {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); 
  //TODO: before the page loads the images should be already loaded 

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
    <div>
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 bg-white px-4 py-2 transition-all duration-200"
        >
          <div className="w-8 h-8 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-semibold">
            {user.profile_image_url?.link ? (
              <img
                src={user.profile_image_url.link}
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              user.full_name
                .split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()
            )}
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
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {user.profile_image_url?.link ? (
                    <img
                      src={user.profile_image_url.link}
                      alt={user.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.full_name
                      .split(" ")
                      .map(n => n[0])
                      .join("")
                      .toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.full_name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                to="/pet-owner/settings"
                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150"
              >
                <FaCog className="text-gray-600 text-lg" />
                <span className="text-gray-700 font-medium">Account Settings</span>
              </Link>

              <Link
                to="/pet-owner/pets"
                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150"
              >
                <FaPaw className="text-gray-600 text-lg" />
                <span className="text-gray-700 font-medium">My Pets</span>
              </Link>

              <Link
                to="/pet-owner/appointments"
                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150"
              >
                <FaCalendarAlt className="text-gray-600 text-lg" />
                <span className="text-gray-700 font-medium">Appointments</span>
              </Link>

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={logout}
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