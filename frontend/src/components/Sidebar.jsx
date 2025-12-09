import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";
import DriveImage from './DriveImage';

export default function Sidebar({ isOpen, setIsOpen, title, links, onLogout }) {
  const location = useLocation();
  const { user } = useAuth();

  const fullName = [user?.first_name, user?.last_name]
  .filter(name => name && name.trim())
  .join(' ') || user?.email || 'User';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  return (
    <div
      className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out
      ${isOpen ? "w-64" : "w-0"}
      bg-white border-r border-gray-200 flex flex-col z-40 overflow-hidden`}
    >
      {/* Header / Title */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <h2
          className={`font-bold text-lg text-primary transition-all duration-300 ${
            !isOpen ? "hidden lg:block lg:text-center" : ""
          }`}
        >
          {title}
        </h2>
        <button
          className="md:hidden text-gray-500 text-xl"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes />
        </button>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 mx-2 my-4 border border-gray-200 rounded-xl py-4 px-2">
        <div className="w-10 h-10 shrink-0 border border-gray-200 rounded-full flex items-center justify-center font-semibold overflow-hidden text-sm bg-primary text-white">
          {user?.profile_image_url ? (
            <DriveImage
              image={user.profile_image_url}
              alt={fullName}
              className="w-full h-full object-cover"
              fallbackIcon={false}
            />
          ) : null}
          {!user?.profile_image_url && fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{fullName}</p>
          <p className="text-[10px] text-gray-500">{user?.email || 'user@clinic.com'}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mx-2 transition-all ${
                isActive
                  ? "bg-primary text-white font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {isOpen && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-gray-700 hover:text-primary transition-all"
        >
          <FaSignOutAlt className="text-lg" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}