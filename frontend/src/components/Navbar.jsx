import { Link, useLocation } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import { RiHomeLine, RiHealthBookLine, RiCalendar2Line, RiListSettingsLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from './ProfileDropdown';

const NAV_ITEMS = [
  { to: '/', icon: RiHomeLine, label: 'Home' },
  { to: '/pet-owner/health-records', icon: RiHealthBookLine, label: 'Records' },
  { to: '/pet-owner/appointments', icon: RiCalendar2Line, label: 'Appointments' },
  { to: '/pet-owner/settings', icon: RiListSettingsLine, label: 'Settings' },
];

function MobileNavBar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 p-4 sm:hidden bg-white/95 backdrop-blur-lg border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Home">
            <img src="/vetsync-logo-wname.png" alt="VetSync" className="h-7" />
          </Link>
          <button 
            aria-label="Favorites" 
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <FaRegHeart className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl sm:hidden bg-white/95 backdrop-blur-lg border border-gray-200">
        <div className="flex justify-around items-center px-2 h-20">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className="flex flex-col items-center justify-center gap-1 px-4 py-1 rounded-xl transition-all"
              >
                <div className={`p-2 rounded-xl transition-all ${
                  active 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-500'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  active ? 'text-primary' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function DesktopNavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <>
        {/* Desktop Navigation */}
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 hidden sm:block">
          <div className="mx-auto px-base sm:px-large lg:px-custom-large">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img 
                  className="h-8 w-auto" 
                  src="/vetsync-logo-wname.png" 
                  alt="VetSync" 
                />
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-1">
                <DesktopNavLink to="/">Home</DesktopNavLink>
                <DesktopNavLink to="/pet-owner/health-records">Health Records</DesktopNavLink>
                <DesktopNavLink to="/pet-owner/appointments">Appointments</DesktopNavLink>
              </div>

              <div>
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <MobileNavBar />
      </>
    );
  }

  // Public (unauthenticated) navbar
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="mx-auto px-base sm:px-large lg:px-custom-large">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              className="h-8 w-auto" 
              src="/vetsync-logo-wname.png" 
              alt="VetSync" 
            />
          </Link>

          {/* Auth Links */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-700 hover:text-primary px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#FEA08E] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}